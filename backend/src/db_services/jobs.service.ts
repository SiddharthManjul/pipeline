import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import { Job, Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async job(jobWhereUniqueInput: Prisma.JobWhereUniqueInput): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: jobWhereUniqueInput,
    });
  }

  async jobs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.JobWhereUniqueInput;
    where?: Prisma.JobWhereInput;
    orderBy?: Prisma.JobOrderByWithRelationInput;
  }): Promise<Job[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.job.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    return this.prisma.job.create({
      data,
    });
  }

  async updateJob(params: {
    where: Prisma.JobWhereUniqueInput;
    data: Prisma.JobUpdateInput;
  }): Promise<Job> {
    const { where, data } = params;
    return this.prisma.job.update({
      data,
      where,
    });
  }

  async deleteJob(where: Prisma.JobWhereUniqueInput): Promise<Job> {
    return this.prisma.job.delete({
      where,
    });
  }

  async getJobWithReferrals(jobId: string) {
    return this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        founder: {
          select: {
            companyName: true,
            companyWebsite: true,
          },
        },
        referrals: {
          include: {
            developer: {
              select: {
                username: true,
                tier: true,
                reputationScore: true,
              },
            },
          },
        },
      },
    });
  }

  async getOpenJobs() {
    return this.prisma.job.findMany({
      where: {
        status: 'OPEN',
      },
      include: {
        founder: {
          select: {
            companyName: true,
            companyWebsite: true,
          },
        },
      },
      orderBy: {
        postedAt: 'desc',
      },
    });
  }

  async countJobs(where?: Prisma.JobWhereInput): Promise<number> {
    return this.prisma.job.count({ where });
  }
}
