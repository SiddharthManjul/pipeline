import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { DevelopersService } from './developers.service.js';
import { FoundersService } from './founders.service.js';
import { ProjectsService } from './projects.service.js';
import { JobsService } from './jobs.service.js';
import { VouchesService } from './vouches.service.js';
import { ReputationService } from './reputation.service.js';
import { AlertsService } from './alerts.service.js';
import { SessionsService } from './sessions.service.js';
import { HallOfFameService } from './hall-of-fame.service.js';

@Module({
  providers: [
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
  ],
  exports: [
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
  ],
})
export class DbServicesModule {}
