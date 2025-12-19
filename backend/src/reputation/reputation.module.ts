import { Module } from '@nestjs/common';
import { ReputationController } from './reputation.controller.js';
import { ReputationService } from './reputation.service.js';
import { DbServicesModule } from '../db_services/db-services.module.js';
import { GithubModule } from '../github/github.module.js';

@Module({
  imports: [DbServicesModule, GithubModule],
  controllers: [ReputationController],
  providers: [ReputationService],
  exports: [ReputationService],
})
export class ReputationModule {}
