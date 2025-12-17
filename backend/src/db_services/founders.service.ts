import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import { Founder, Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class FoundersService {
  constructor(private prisma: PrismaService) {}

  async founder(
    founderWhereUniqueInput: Prisma.FounderWhereUniqueInput,
  ): Promise<Founder | null> {
    return this.prisma.founder.findUnique({
      where: founderWhereUniqueInput,
    });
  }

  async founders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FounderWhereUniqueInput;
    where?: Prisma.FounderWhereInput;
    orderBy?: Prisma.FounderOrderByWithRelationInput;
  }): Promise<Founder[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.founder.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createFounder(data: Prisma.FounderCreateInput): Promise<Founder> {
    return this.prisma.founder.create({
      data,
    });
  }

  async updateFounder(params: {
    where: Prisma.FounderWhereUniqueInput;
    data: Prisma.FounderUpdateInput;
  }): Promise<Founder> {
    const { where, data } = params;
    return this.prisma.founder.update({
      data,
      where,
    });
  }

  async deleteFounder(where: Prisma.FounderWhereUniqueInput): Promise<Founder> {
    return this.prisma.founder.delete({
      where,
    });
  }

  async getFounderWithJobs(founderId: string) {
    return this.prisma.founder.findUnique({
      where: { id: founderId },
      include: {
        user: true,
        jobs: {
          include: {
            referrals: true,
          },
        },
      },
    });
  }

  async countFounders(where?: Prisma.FounderWhereInput): Promise<number> {
    return this.prisma.founder.count({ where });
  }

  // Helper methods for profile service
  async findFounderByUserId(userId: string): Promise<Founder | null> {
    return this.prisma.founder.findUnique({
      where: { userId },
    });
  }
}
