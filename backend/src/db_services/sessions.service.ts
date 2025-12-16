import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import {
  Session,
  SessionParticipant,
  Prisma,
} from '../../generated/prisma/client.js';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async session(
    sessionWhereUniqueInput: Prisma.SessionWhereUniqueInput,
  ): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: sessionWhereUniqueInput,
    });
  }

  async sessions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SessionWhereUniqueInput;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
  }): Promise<Session[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.session.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createSession(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({
      data,
    });
  }

  async updateSession(params: {
    where: Prisma.SessionWhereUniqueInput;
    data: Prisma.SessionUpdateInput;
  }): Promise<Session> {
    const { where, data } = params;
    return this.prisma.session.update({
      data,
      where,
    });
  }

  async deleteSession(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session.delete({
      where,
    });
  }

  async getSessionWithParticipants(sessionId: string) {
    return this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                developer: {
                  select: {
                    username: true,
                    fullName: true,
                  },
                },
                founder: {
                  select: {
                    companyName: true,
                    position: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getUpcomingSessions(skip?: number, take?: number) {
    return this.prisma.session.findMany({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      skip,
      take: take || 20,
    });
  }

  async addParticipant(
    sessionId: string,
    userId: string,
  ): Promise<SessionParticipant> {
    return this.prisma.sessionParticipant.create({
      data: {
        session: { connect: { id: sessionId } },
        user: { connect: { id: userId } },
        status: 'INVITED',
      },
    });
  }

  async updateParticipantStatus(
    participantId: string,
    status: 'CONFIRMED' | 'DECLINED' | 'ATTENDED' | 'NO_SHOW',
  ): Promise<SessionParticipant> {
    return this.prisma.sessionParticipant.update({
      where: { id: participantId },
      data: { status },
    });
  }

  async getUserSessions(userId: string) {
    return this.prisma.sessionParticipant.findMany({
      where: { userId },
      include: {
        session: true,
      },
      orderBy: {
        session: {
          scheduledAt: 'desc',
        },
      },
    });
  }

  async countSessions(where?: Prisma.SessionWhereInput): Promise<number> {
    return this.prisma.session.count({ where });
  }
}
