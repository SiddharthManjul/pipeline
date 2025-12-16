import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import {
  Developer,
  Prisma,
  DeveloperTier,
  Availability,
} from '../../generated/prisma/client.js';

@Injectable()
export class DevelopersService {
  constructor(private prisma: PrismaService) {}

  async developer(
    developerWhereUniqueInput: Prisma.DeveloperWhereUniqueInput,
  ): Promise<Developer | null> {
    return this.prisma.developer.findUnique({
      where: developerWhereUniqueInput,
    });
  }

  async developers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DeveloperWhereUniqueInput;
    where?: Prisma.DeveloperWhereInput;
    orderBy?: Prisma.DeveloperOrderByWithRelationInput;
  }): Promise<Developer[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.developer.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createDeveloper(data: Prisma.DeveloperCreateInput): Promise<Developer> {
    return this.prisma.developer.create({
      data,
    });
  }

  async updateDeveloper(params: {
    where: Prisma.DeveloperWhereUniqueInput;
    data: Prisma.DeveloperUpdateInput;
  }): Promise<Developer> {
    const { where, data } = params;
    return this.prisma.developer.update({
      data,
      where,
    });
  }

  async deleteDeveloper(
    where: Prisma.DeveloperWhereUniqueInput,
  ): Promise<Developer> {
    return this.prisma.developer.delete({
      where,
    });
  }

  async getDeveloperWithProjects(developerId: string) {
    return this.prisma.developer.findUnique({
      where: { id: developerId },
      include: {
        user: true,
        projects: true,
        reputationScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async getDeveloperByUsername(username: string): Promise<Developer | null> {
    return this.prisma.developer.findUnique({
      where: { username },
    });
  }

  async searchDevelopers(params: {
    tier?: DeveloperTier;
    availability?: Availability;
    minReputation?: number;
    location?: string;
    skip?: number;
    take?: number;
  }) {
    const { tier, availability, minReputation, location, skip, take } = params;

    const whereClause: Prisma.DeveloperWhereInput = {};

    if (tier) {
      whereClause.tier = tier;
    }
    if (availability) {
      whereClause.availability = availability;
    }
    if (minReputation) {
      whereClause.reputationScore = { gte: minReputation };
    }
    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    return this.prisma.developer.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            email: true,
            isVerified: true,
          },
        },
        projects: true,
        reputationScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        reputationScore: 'desc',
      },
      skip,
      take: take || 20,
    });
  }

  async countDevelopers(where?: Prisma.DeveloperWhereInput): Promise<number> {
    return this.prisma.developer.count({ where });
  }
}
