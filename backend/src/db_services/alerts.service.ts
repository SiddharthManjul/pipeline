import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import {
  Alert,
  NotificationPreferences,
  Prisma,
} from '../../generated/prisma/client.js';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async alert(
    alertWhereUniqueInput: Prisma.AlertWhereUniqueInput,
  ): Promise<Alert | null> {
    return this.prisma.alert.findUnique({
      where: alertWhereUniqueInput,
    });
  }

  async alerts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AlertWhereUniqueInput;
    where?: Prisma.AlertWhereInput;
    orderBy?: Prisma.AlertOrderByWithRelationInput;
  }): Promise<Alert[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.alert.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createAlert(data: Prisma.AlertCreateInput): Promise<Alert> {
    return this.prisma.alert.create({
      data,
    });
  }

  async updateAlert(params: {
    where: Prisma.AlertWhereUniqueInput;
    data: Prisma.AlertUpdateInput;
  }): Promise<Alert> {
    const { where, data } = params;
    return this.prisma.alert.update({
      data,
      where,
    });
  }

  async deleteAlert(where: Prisma.AlertWhereUniqueInput): Promise<Alert> {
    return this.prisma.alert.delete({
      where,
    });
  }

  async getUserAlerts(userId: string, unreadOnly = false) {
    return this.prisma.alert.findMany({
      where: {
        userId,
        ...(unreadOnly && { isRead: false }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAlertAsRead(alertId: string): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id: alertId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAlertsAsRead(userId: string) {
    return this.prisma.alert.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getNotificationPreferences(
    userId: string,
  ): Promise<NotificationPreferences | null> {
    return this.prisma.notificationPreferences.findUnique({
      where: { userId },
    });
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: {
      emailNotifications?: boolean;
      inAppNotifications?: boolean;
      jobMatches?: boolean;
      vouches?: boolean;
      messages?: boolean;
      hackathons?: boolean;
      weeklyDigest?: boolean;
    },
  ): Promise<NotificationPreferences> {
    return this.prisma.notificationPreferences.upsert({
      where: { userId },
      update: preferences,
      create: {
        user: { connect: { id: userId } },
        emailNotifications: preferences.emailNotifications ?? true,
        inAppNotifications: preferences.inAppNotifications ?? true,
        jobMatches: preferences.jobMatches ?? true,
        vouches: preferences.vouches ?? true,
        messages: preferences.messages ?? true,
        hackathons: preferences.hackathons ?? true,
        weeklyDigest: preferences.weeklyDigest ?? true,
      },
    });
  }

  async countUnreadAlerts(userId: string): Promise<number> {
    return this.prisma.alert.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}
