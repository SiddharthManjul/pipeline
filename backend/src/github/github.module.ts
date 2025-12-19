import { Module } from '@nestjs/common';
import { GithubController } from './github.controller.js';
import { GithubService } from './github.service.js';
import { DbServicesModule } from '../db_services/db-services.module.js';

@Module({
  imports: [DbServicesModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
