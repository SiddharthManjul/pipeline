import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import { GithubService } from '../github/github.service.js';
import { DeveloperTier } from '../../generated/prisma/client.js';

export interface ReputationBreakdown {
  totalScore: number;
  tier: DeveloperTier;
  breakdown: {
    githubScore: number;
    projectsScore: number;
    timeScore: number;
    hackathonsScore: number;
    communityScore: number;
  };
  weights: {
    github: number;
    projects: number;
    time: number;
    hackathons: number;
    community: number;
  };
  metadata: {
    githubStats?: any;
    projectStats?: any;
    hackathonStats?: any;
    communityStats?: any;
  };
}

@Injectable()
export class ReputationService {
  private readonly logger = new Logger(ReputationService.name);

  // Score weights (must sum to 1.0)
  private readonly WEIGHTS = {
    GITHUB: 0.3, // 30%
    PROJECTS: 0.25, // 25%
    TIME: 0.15, // 15%
    HACKATHONS: 0.2, // 20%
    COMMUNITY: 0.1, // 10%
  };

  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
  ) {}

  /**
   * Calculate comprehensive reputation score for a developer
   */
  async calculateReputation(developerId: string): Promise<ReputationBreakdown> {
    try {
      // Fetch developer with all related data
      const developer = await this.prisma.developer.findUnique({
        where: { id: developerId },
        include: {
          projects: true,
          vouchesReceived: {
            where: { isActive: true },
            include: {
              developerVoucher: {
                select: { tier: true },
              },
              founderVoucher: {
                select: { id: true },
              },
            },
          },
          hackathonParticipations: {
            where: { isVerified: true },
          },
          grantRecipients: {
            where: { isVerified: true },
          },
          openSourceContributions: true,
        },
      });

      if (!developer) {
        throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
      }

      // Calculate individual scores
      const githubScore = await this.calculateGitHubScore(developer);
      const projectsScore = await this.calculateProjectsScore(developer);
      const timeScore = this.calculateTimeInvestmentScore(developer);
      const hackathonsScore = this.calculateHackathonsGrantsScore(developer);
      const communityScore = this.calculateCommunityScore(developer);

      // Calculate weighted total score (0-100)
      const totalScore =
        githubScore * this.WEIGHTS.GITHUB +
        projectsScore * this.WEIGHTS.PROJECTS +
        timeScore * this.WEIGHTS.TIME +
        hackathonsScore * this.WEIGHTS.HACKATHONS +
        communityScore * this.WEIGHTS.COMMUNITY;

      // Determine tier based on score
      const tier = this.assignTier(totalScore);

      // Prepare breakdown
      const breakdown: ReputationBreakdown = {
        totalScore: Math.round(totalScore * 10) / 10,
        tier,
        breakdown: {
          githubScore: Math.round(githubScore * 10) / 10,
          projectsScore: Math.round(projectsScore * 10) / 10,
          timeScore: Math.round(timeScore * 10) / 10,
          hackathonsScore: Math.round(hackathonsScore * 10) / 10,
          communityScore: Math.round(communityScore * 10) / 10,
        },
        weights: {
          github: this.WEIGHTS.GITHUB,
          projects: this.WEIGHTS.PROJECTS,
          time: this.WEIGHTS.TIME,
          hackathons: this.WEIGHTS.HACKATHONS,
          community: this.WEIGHTS.COMMUNITY,
        },
        metadata: {},
      };

      // Save reputation score
      await this.saveReputationScore(developerId, breakdown);

      // Update developer tier and score
      await this.prisma.developer.update({
        where: { id: developerId },
        data: {
          reputationScore: breakdown.totalScore,
          tier,
        },
      });

      // Track history
      await this.saveReputationHistory(developerId, breakdown.totalScore, tier);

      this.logger.log(
        `Calculated reputation for developer ${developerId}: ${breakdown.totalScore} (${tier})`,
      );

      return breakdown;
    } catch (error: any) {
      this.logger.error(
        `Failed to calculate reputation for developer ${developerId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Calculate GitHub score (0-100)
   * Based on: repos, stars, forks, contributions
   */
  private async calculateGitHubScore(developer: any): Promise<number> {
    try {
      if (!developer.github) {
        return 0;
      }

      // Get GitHub username from URL
      const username = this.extractGitHubUsername(developer.github);
      if (!username) {
        return 0;
      }

      // Fetch GitHub stats
      const stats = await this.githubService.getGitHubStats(username);

      // Scoring criteria (max 100 points)
      const repoScore = Math.min((stats.repositories.length / 20) * 25, 25); // Max 25 points at 20+ repos
      const starScore = Math.min((stats.totalStars / 100) * 35, 35); // Max 35 points at 100+ stars
      const forkScore = Math.min((stats.totalForks / 50) * 20, 20); // Max 20 points at 50+ forks
      const followerScore = Math.min((stats.profile.followers / 100) * 20, 20); // Max 20 points at 100+ followers

      const totalScore = repoScore + starScore + forkScore + followerScore;

      return Math.min(totalScore, 100);
    } catch (error) {
      this.logger.warn(`Failed to calculate GitHub score, returning 0`, error);
      return 0;
    }
  }

  /**
   * Calculate Projects score (0-100)
   * Based on: number of projects, complexity, tech diversity, deployment
   */
  private calculateProjectsScore(developer: any): Promise<number> {
    const projects = developer.projects || [];

    if (projects.length === 0) {
      return Promise.resolve(0);
    }

    // Scoring criteria
    const projectCountScore = Math.min((projects.length / 10) * 40, 40); // Max 40 points at 10+ projects

    // Tech diversity (unique technologies used)
    const allTechnologies = projects.flatMap((p: any) => p.technologies || []);
    const uniqueTech = new Set(allTechnologies);
    const techDiversityScore = Math.min((uniqueTech.size / 15) * 25, 25); // Max 25 points at 15+ technologies

    // Deployed projects (have live URLs)
    const deployedCount = projects.filter(
      (p: any) => p.livePlatformUrl && p.livePlatformUrl.length > 0,
    ).length;
    const deploymentScore = Math.min((deployedCount / 5) * 20, 20); // Max 20 points at 5+ deployed

    // GitHub stars on projects
    const totalProjectStars = projects.reduce(
      (sum: number, p: any) => sum + (p.githubStars || 0),
      0,
    );
    const starsScore = Math.min((totalProjectStars / 50) * 15, 15); // Max 15 points at 50+ stars

    const totalScore =
      projectCountScore + techDiversityScore + deploymentScore + starsScore;

    return Promise.resolve(Math.min(totalScore, 100));
  }

  /**
   * Calculate Time Investment score (0-100)
   * Based on: account age, recent activity, consistency
   */
  private calculateTimeInvestmentScore(developer: any): number {
    const now = new Date();
    const createdAt = new Date(developer.createdAt);
    const updatedAt = new Date(developer.updatedAt);

    // Account age in months
    const ageInMonths =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const ageScore = Math.min((ageInMonths / 12) * 40, 40); // Max 40 points at 12+ months

    // Recent activity (updated in last 30 days)
    const daysSinceUpdate =
      (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    const activityScore =
      daysSinceUpdate <= 7
        ? 30
        : daysSinceUpdate <= 30
          ? 20
          : daysSinceUpdate <= 90
            ? 10
            : 0; // Max 30 points if active in last week

    // Project recency (projects updated recently)
    const projects = developer.projects || [];
    const recentProjects = projects.filter((p: any) => {
      const projectUpdate = new Date(p.updatedAt);
      const daysSince =
        (now.getTime() - projectUpdate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 90;
    });
    const recencyScore = Math.min((recentProjects.length / 3) * 30, 30); // Max 30 points at 3+ recent projects

    const totalScore = ageScore + activityScore + recencyScore;

    return Math.min(totalScore, 100);
  }

  /**
   * Calculate Hackathons & Grants score (0-100)
   * Based on: wins, placements, prize amounts, grants
   */
  private calculateHackathonsGrantsScore(developer: any): number {
    const hackathons = developer.hackathonParticipations || [];
    const grants = developer.grantRecipients || [];

    // Hackathon scoring
    const hackathonCount = hackathons.length;
    const hackathonCountScore = Math.min((hackathonCount / 5) * 25, 25); // Max 25 points at 5+ hackathons

    // Placement scoring (1st place = 20, 2nd = 15, 3rd = 10, participation = 5)
    const placementScore = hackathons.reduce((sum: number, h: any) => {
      if (h.placement === 1) return sum + 20;
      if (h.placement === 2) return sum + 15;
      if (h.placement === 3) return sum + 10;
      return sum + 5; // Participation
    }, 0);
    const normalizedPlacementScore = Math.min(placementScore, 40); // Max 40 points

    // Grant scoring
    const grantCount = grants.length;
    const grantCountScore = Math.min((grantCount / 3) * 20, 20); // Max 20 points at 3+ grants

    // Total prize money (hackathons + grants)
    const totalPrize = [
      ...hackathons.map((h: any) => h.prizeAmount || 0),
      ...grants.map((g: any) => g.amountReceived || 0),
    ].reduce((sum: number, amount: number) => sum + amount, 0);
    const prizeScore = Math.min((totalPrize / 10000) * 15, 15); // Max 15 points at $10k+

    const totalScore =
      hackathonCountScore +
      normalizedPlacementScore +
      grantCountScore +
      prizeScore;

    return Math.min(totalScore, 100);
  }

  /**
   * Calculate Community score (0-100)
   * Based on: vouches (weighted by tier), sessions
   */
  private calculateCommunityScore(developer: any): number {
    const vouches = developer.vouchesReceived || [];

    if (vouches.length === 0) {
      return 0;
    }

    // Vouch weights by tier
    const VOUCH_WEIGHTS = {
      TIER_1: 5.0,
      TIER_2: 3.0,
      TIER_3: 1.5,
      TIER_4: 0.5,
    };

    // Calculate weighted vouch score
    const vouchScore = vouches.reduce((sum: number, vouch: any) => {
      // Handle both developer and founder vouchers
      const voucherTier = vouch.developerVoucher?.tier || vouch.voucherTier;
      const weight = VOUCH_WEIGHTS[voucherTier] || 1.0;
      return sum + weight;
    }, 0);

    // Normalize to 0-100 (assuming 10 weighted vouches = 100 points)
    const normalizedVouchScore = Math.min((vouchScore / 20) * 100, 100);

    return normalizedVouchScore;
  }

  /**
   * Assign tier based on total score
   */
  private assignTier(score: number): DeveloperTier {
    if (score >= 76) return DeveloperTier.TIER_1; // Elite
    if (score >= 51) return DeveloperTier.TIER_2; // Advanced
    if (score >= 26) return DeveloperTier.TIER_3; // Intermediate
    return DeveloperTier.TIER_4; // Entry
  }

  /**
   * Save reputation score to database
   */
  private async saveReputationScore(
    developerId: string,
    breakdown: ReputationBreakdown,
  ): Promise<void> {
    await this.prisma.reputationScore.create({
      data: {
        developer: { connect: { id: developerId } },
        totalScore: breakdown.totalScore,
        tier: breakdown.tier,
        githubScore: breakdown.breakdown.githubScore,
        projectsScore: breakdown.breakdown.projectsScore,
        timeScore: breakdown.breakdown.timeScore,
        hackathonsScore: breakdown.breakdown.hackathonsScore,
        communityScore: breakdown.breakdown.communityScore,
        metadata: breakdown.metadata,
      },
    });
  }

  /**
   * Save reputation history entry
   */
  private async saveReputationHistory(
    developerId: string,
    score: number,
    tier: DeveloperTier,
  ): Promise<void> {
    await this.prisma.reputationHistory.create({
      data: {
        developer: { connect: { id: developerId } },
        score,
        tier,
      },
    });
  }

  /**
   * Get reputation score for a developer
   */
  async getReputation(developerId: string): Promise<any> {
    const latestScore = await this.prisma.reputationScore.findFirst({
      where: { developerId },
      orderBy: { calculatedAt: 'desc' },
    });

    if (!latestScore) {
      throw new HttpException(
        'No reputation score found. Calculate first.',
        HttpStatus.NOT_FOUND,
      );
    }

    return latestScore;
  }

  /**
   * Get reputation history for a developer
   */
  async getReputationHistory(developerId: string): Promise<any[]> {
    return this.prisma.reputationHistory.findMany({
      where: { developerId },
      orderBy: { date: 'desc' },
      take: 30, // Last 30 entries
    });
  }

  /**
   * Recalculate reputation for all developers
   */
  async recalculateAllReputations(): Promise<{
    success: number;
    failed: number;
  }> {
    const developers = await this.prisma.developer.findMany({
      select: { id: true },
    });

    let success = 0;
    let failed = 0;

    for (const developer of developers) {
      try {
        await this.calculateReputation(developer.id);
        success++;
      } catch (error) {
        this.logger.error(
          `Failed to calculate reputation for ${developer.id}`,
          error,
        );
        failed++;
      }
    }

    this.logger.log(
      `Recalculated reputation for all developers: ${success} success, ${failed} failed`,
    );

    return { success, failed };
  }

  /**
   * Extract GitHub username from profile URL
   */
  private extractGitHubUsername(githubUrl: string): string | null {
    const match = githubUrl.match(/github\.com\/([^\/]+)/);
    return match ? match[1] : null;
  }
}
