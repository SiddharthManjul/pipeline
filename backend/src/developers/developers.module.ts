import { Module } from '@nestjs/common';
import { DevelopersController } from './developers.controller.js';
import { DbServicesModule } from '../db_services/db-services.module.js';

@Module({
  imports: [DbServicesModule],
  controllers: [DevelopersController],
})
export class DevelopersModule {}
