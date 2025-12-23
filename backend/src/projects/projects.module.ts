import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller.js';
import { DbServicesModule } from '../db_services/db-services.module.js';

@Module({
  imports: [DbServicesModule],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
