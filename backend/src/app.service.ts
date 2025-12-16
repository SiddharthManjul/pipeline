import { Injectable } from '@nestjs/common';
import { PrismaService } from './lib/prisma.service.js';
import {
  UsersService,
  DevelopersService,
  FoundersService,
  ProjectsService,
  JobsService,
  VouchesService,
  ReputationService,
  AlertsService,
  SessionsService,
  HallOfFameService,
} from './db_services/index.js';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private developersService: DevelopersService,
    private foundersService: FoundersService,
    private projectsService: ProjectsService,
    private jobsService: JobsService,
    private vouchesService: VouchesService,
    private reputationService: ReputationService,
    private alertsService: AlertsService,
    private sessionsService: SessionsService,
    private hallOfFameService: HallOfFameService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async healthCheck() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Test each service with a simple count operation
      const [
        usersCount,
        developersCount,
        foundersCount,
        projectsCount,
        jobsCount,
        vouchesCount,
        alertsCount,
        sessionsCount,
      ] = await Promise.all([
        this.usersService.countUsers(),
        this.developersService.countDevelopers(),
        this.foundersService.countFounders(),
        this.projectsService.countProjects(),
        this.jobsService.countJobs(),
        this.vouchesService.countVouches(),
        this.alertsService.countUnreadAlerts('test'), // Will return 0 for non-existent user
        this.sessionsService.countSessions(),
      ]);

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        services: {
          users: { status: 'working', count: usersCount },
          developers: { status: 'working', count: developersCount },
          founders: { status: 'working', count: foundersCount },
          projects: { status: 'working', count: projectsCount },
          jobs: { status: 'working', count: jobsCount },
          vouches: { status: 'working', count: vouchesCount },
          alerts: { status: 'working' },
          sessions: { status: 'working', count: sessionsCount },
          reputation: { status: 'working' },
          hallOfFame: { status: 'working' },
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
