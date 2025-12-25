import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import {
  Vouch,
  VouchEligibility,
  Prisma,
} from '../../generated/prisma/client.js';

@Injectable()
export class VouchesService {
  constructor(private prisma: PrismaService) {}

  async vouch(
    vouchWhereUniqueInput: Prisma.VouchWhereUniqueInput,
  ): Promise<Vouch | null> {
    return this.prisma.vouch.findUnique({
      where: vouchWhereUniqueInput,
    });
  }

  async vouches(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.VouchWhereUniqueInput;
    where?: Prisma.VouchWhereInput;
    orderBy?: Prisma.VouchOrderByWithRelationInput;
    include?: Prisma.VouchInclude;
  }): Promise<any[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.vouch.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async createVouch(data: Prisma.VouchCreateInput): Promise<Vouch> {
    return this.prisma.vouch.create({
      data,
    });
  }

  async updateVouch(params: {
    where: Prisma.VouchWhereUniqueInput;
    data: Prisma.VouchUpdateInput;
  }): Promise<Vouch> {
    const { where, data } = params;
    return this.prisma.vouch.update({
      data,
      where,
    });
  }

  async deleteVouch(where: Prisma.VouchWhereUniqueInput): Promise<Vouch> {
    return this.prisma.vouch.delete({
      where,
    });
  }

  async getVouchesForDeveloper(developerId: string) {
    return this.prisma.vouch.findMany({
      where: {
        vouchedUserId: developerId,
        isActive: true,
      },
      include: {
        voucher: {
          select: {
            username: true,
            fullName: true,
            tier: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getVouchesByDeveloper(voucherId: string) {
    return this.prisma.vouch.findMany({
      where: {
        voucherId,
        isActive: true,
      },
      include: {
        vouchedUser: {
          select: {
            username: true,
            fullName: true,
            tier: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkVouchEligibility(
    developerId: string,
  ): Promise<VouchEligibility | null> {
    return this.prisma.vouchEligibility.findUnique({
      where: { developerId },
    });
  }

  async updateVouchEligibility(
    developerId: string,
    isEligible: boolean,
    reasonsNotEligible: string[],
  ): Promise<VouchEligibility> {
    return this.prisma.vouchEligibility.upsert({
      where: { developerId },
      update: {
        isEligible,
        reasonsNotEligible,
        lastCheckedAt: new Date(),
      },
      create: {
        developer: { connect: { id: developerId } },
        isEligible,
        reasonsNotEligible,
      },
    });
  }

  async revokeVouch(vouchId: string, reason: string): Promise<Vouch> {
    return this.prisma.vouch.update({
      where: { id: vouchId },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokeReason: reason,
      },
    });
  }

  async countVouches(where?: Prisma.VouchWhereInput): Promise<number> {
    return this.prisma.vouch.count({ where });
  }
}
