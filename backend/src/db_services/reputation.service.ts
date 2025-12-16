import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import {
  ReputationScore,
  ReputationHistory,
  Prisma,
} from '../../generated/prisma/client.js';

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

  async reputationScore(
    reputationScoreWhereUniqueInput: Prisma.ReputationScoreWhereUniqueInput,
  ): Promise<ReputationScore | null> {
    return this.prisma.reputationScore.findUnique({
      where: reputationScoreWhereUniqueInput,
    });
  }

  async reputationScores(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReputationScoreWhereUniqueInput;
    where?: Prisma.ReputationScoreWhereInput;
    orderBy?: Prisma.ReputationScoreOrderByWithRelationInput;
  }): Promise<ReputationScore[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.reputationScore.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createReputationScore(
    data: Prisma.ReputationScoreCreateInput,
  ): Promise<ReputationScore> {
    return this.prisma.reputationScore.create({
      data,
    });
  }

  async updateReputationScore(params: {
    where: Prisma.ReputationScoreWhereUniqueInput;
    data: Prisma.ReputationScoreUpdateInput;
  }): Promise<ReputationScore> {
    const { where, data } = params;
    return this.prisma.reputationScore.update({
      data,
      where,
    });
  }

  async deleteReputationScore(
    where: Prisma.ReputationScoreWhereUniqueInput,
  ): Promise<ReputationScore> {
    return this.prisma.reputationScore.delete({
      where,
    });
  }

  async getLatestReputationScore(
    developerId: string,
  ): Promise<ReputationScore | null> {
    return this.prisma.reputationScore.findFirst({
      where: { developerId },
      orderBy: { calculatedAt: 'desc' },
    });
  }

  async getReputationHistory(params: {
    developerId: string;
    skip?: number;
    take?: number;
  }): Promise<ReputationHistory[]> {
    const { developerId, skip, take } = params;
    return this.prisma.reputationHistory.findMany({
      where: { developerId },
      orderBy: { date: 'desc' },
      skip,
      take: take || 50,
    });
  }

  async createReputationHistory(
    data: Prisma.ReputationHistoryCreateInput,
  ): Promise<ReputationHistory> {
    return this.prisma.reputationHistory.create({
      data,
    });
  }

  async calculateAndUpdateReputation(developerId: string, scores: {
    githubScore: number;
    projectsScore: number;
    timeScore: number;
    hackathonsScore: number;
    communityScore: number;
  }) {
    const totalScore =
      scores.githubScore * 0.3 +
      scores.projectsScore * 0.25 +
      scores.timeScore * 0.15 +
      scores.hackathonsScore * 0.2 +
      scores.communityScore * 0.1;

    let tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4';
    if (totalScore >= 76) tier = 'TIER_1';
    else if (totalScore >= 51) tier = 'TIER_2';
    else if (totalScore >= 26) tier = 'TIER_3';
    else tier = 'TIER_4';

    return this.prisma.$transaction(async (tx) => {
      const reputationScore = await tx.reputationScore.create({
        data: {
          developer: { connect: { id: developerId } },
          totalScore,
          tier,
          githubScore: scores.githubScore,
          projectsScore: scores.projectsScore,
          timeScore: scores.timeScore,
          hackathonsScore: scores.hackathonsScore,
          communityScore: scores.communityScore,
        },
      });

      await tx.reputationHistory.create({
        data: {
          developer: { connect: { id: developerId } },
          score: totalScore,
          tier,
        },
      });

      await tx.developer.update({
        where: { id: developerId },
        data: {
          reputationScore: totalScore,
          tier,
        },
      });

      return reputationScore;
    });
  }
}
