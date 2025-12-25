/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DevelopersService } from '../db_services/developers.service.js';
import { VouchesService } from '../db_services/vouches.service.js';
import { ProjectsService } from '../db_services/projects.service.js';
import { CreateVouchDto } from './dto/create-vouch.dto.js';
import { DeveloperTier } from '../../generated/prisma/client.js';

@Injectable()
export class VouchingService {
  constructor(
    private developersService: DevelopersService,
    private vouchesService: VouchesService,
    private projectsService: ProjectsService,
  ) {}

  // Tier hierarchy weights
  private readonly TIER_WEIGHTS = {
    TIER_1: 3.0,
    TIER_2: 2.0,
    TIER_3: 1.0,
    ADMIN: 5.0,
  };

  // Anti-gaming limits
  private readonly MAX_VOUCHES_PER_MONTH = 5;
  private readonly MIN_ACCOUNT_AGE_DAYS = 30;
  private readonly MIN_REPUTATION_TO_RECEIVE = 10;
  private readonly MIN_OPEN_SOURCE_PROJECTS = 2;
  private readonly GITHUB_ACTIVITY_DAYS = 90;

  /**
   * Check if a voucher can vouch for a specific tier
   */
  private canVouchForTier(voucherTier: DeveloperTier, targetTier: DeveloperTier): boolean {
    const hierarchy: Record<DeveloperTier, DeveloperTier[]> = {
      TIER_1: ['TIER_2' as DeveloperTier, 'TIER_3' as DeveloperTier, 'TIER_4' as DeveloperTier],
      TIER_2: ['TIER_3' as DeveloperTier, 'TIER_4' as DeveloperTier],
      TIER_3: ['TIER_4' as DeveloperTier],
      TIER_4: [],
    };

    return hierarchy[voucherTier]?.includes(targetTier) || false;
  }

  /**
   * Get vouch weight based on voucher's tier
   */
  private getVouchWeight(tier: DeveloperTier, isAdmin: boolean = false): number {
    if (isAdmin) return this.TIER_WEIGHTS.ADMIN;
    return this.TIER_WEIGHTS[tier] || 0;
  }

  /**
   * Check if developer is eligible to receive vouches
   */
  async checkVouchEligibility(developerId: string): Promise<{
    isEligible: boolean;
    reasonsNotEligible: string[];
  }> {
    const developer = await this.developersService.developer({ id: developerId });
    if (!developer) {
      throw new NotFoundException('Developer not found');
    }

    const reasonsNotEligible: string[] = [];

    // Check minimum reputation
    if (developer.reputationScore < this.MIN_REPUTATION_TO_RECEIVE) {
      reasonsNotEligible.push(`Minimum reputation score of ${this.MIN_REPUTATION_TO_RECEIVE} required`);
    }

    // Check account age
    const accountAgeDays = Math.floor(
      (Date.now() - new Date(developer.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (accountAgeDays < this.MIN_ACCOUNT_AGE_DAYS) {
      reasonsNotEligible.push(`Account must be at least ${this.MIN_ACCOUNT_AGE_DAYS} days old`);
    }

    // Check open-source projects
    const projects = await this.projectsService.projects({
      where: { developerId, isVerified: true },
    });
    if (projects.length < this.MIN_OPEN_SOURCE_PROJECTS) {
      reasonsNotEligible.push(`At least ${this.MIN_OPEN_SOURCE_PROJECTS} verified open-source projects required`);
    }

    // Check profile completeness
    if (!developer.bio || !developer.location || !developer.github) {
      reasonsNotEligible.push('Profile must be complete (bio, location, GitHub)');
    }

    // TODO: Check GitHub activity in last 3 months
    // This would require GitHub API integration to check recent commits

    const isEligible = reasonsNotEligible.length === 0;

    // Update eligibility record
    await this.vouchesService.updateVouchEligibility(
      developerId,
      isEligible,
      reasonsNotEligible,
    );

    return { isEligible, reasonsNotEligible };
  }

  /**
   * Create a new vouch
   */
  async createVouch(voucherId: string, dto: CreateVouchDto) {
    const voucher = await this.developersService.developer({ id: voucherId });
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    const vouchedUser = await this.developersService.developer({ id: dto.vouchedUserId });
    if (!vouchedUser) {
      throw new NotFoundException('Developer to vouch for not found');
    }

    // Check if trying to vouch for self
    if (voucherId === dto.vouchedUserId) {
      throw new BadRequestException('Cannot vouch for yourself');
    }

    // Check tier hierarchy
    if (!this.canVouchForTier(voucher.tier, vouchedUser.tier)) {
      throw new ForbiddenException(
        `${voucher.tier} tier cannot vouch for ${vouchedUser.tier} tier`
      );
    }

    // Check eligibility of vouched user
    const eligibility = await this.checkVouchEligibility(dto.vouchedUserId);
    if (!eligibility.isEligible) {
      throw new BadRequestException(
        `Developer is not eligible to receive vouches: ${eligibility.reasonsNotEligible.join(', ')}`
      );
    }

    // Check if already vouched
    const existingVouch = await this.vouchesService.vouch({
      voucherId_vouchedUserId: {
        voucherId,
        vouchedUserId: dto.vouchedUserId,
      },
    });

    if (existingVouch) {
      throw new BadRequestException('You have already vouched for this developer');
    }

    // Check monthly vouch limit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const vouchesThisMonth = await this.vouchesService.vouches({
      where: {
        voucherId,
        createdAt: { gte: startOfMonth },
        isActive: true,
      },
    });

    if (vouchesThisMonth.length >= this.MAX_VOUCHES_PER_MONTH) {
      throw new BadRequestException(
        `You have reached the maximum of ${this.MAX_VOUCHES_PER_MONTH} vouches per month`
      );
    }

    // Calculate vouch weight
    const weight = this.getVouchWeight(voucher.tier);

    // Create the vouch
    const vouch = await this.vouchesService.createVouch({
      voucher: { connect: { id: voucherId } },
      voucherTier: voucher.tier,
      vouchedUser: { connect: { id: dto.vouchedUserId } },
      vouchedUserTier: vouchedUser.tier,
      skillsEndorsed: dto.skillsEndorsed,
      message: dto.message,
      weight,
      isActive: true,
    });

    return vouch;
  }

  /**
   * Get vouches for a developer
   */
  async getVouchesForDeveloper(developerId: string) {
    const vouches = await this.vouchesService.vouches({
      where: {
        vouchedUserId: developerId,
        isActive: true,
      },
      include: {
        voucher: {
          select: {
            id: true,
            username: true,
            fullName: true,
            tier: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalWeight = vouches.reduce((sum, v) => sum + v.weight, 0);
    const vouchCount = vouches.length;

    return {
      vouches,
      totalWeight,
      vouchCount,
    };
  }

  /**
   * Get vouches given by a developer
   */
  async getVouchesGivenByDeveloper(developerId: string) {
    return this.vouchesService.vouches({
      where: {
        voucherId: developerId,
        isActive: true,
      },
      include: {
        vouchedUser: {
          select: {
            id: true,
            username: true,
            fullName: true,
            tier: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Revoke a vouch
   */
  async revokeVouch(vouchId: string, voucherId: string, reason?: string) {
    const vouch = await this.vouchesService.vouch({ id: vouchId });

    if (!vouch) {
      throw new NotFoundException('Vouch not found');
    }

    if (vouch.voucherId !== voucherId) {
      throw new ForbiddenException('You can only revoke your own vouches');
    }

    if (!vouch.isActive) {
      throw new BadRequestException('This vouch is already revoked');
    }

    return this.vouchesService.updateVouch({
      where: { id: vouchId },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokeReason: reason,
      },
    });
  }
}
