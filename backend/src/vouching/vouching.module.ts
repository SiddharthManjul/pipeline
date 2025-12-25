import { Module } from '@nestjs/common';
import { VouchingController } from './vouching.controller.js';
import { VouchingService } from './vouching.service.js';
import { DbServicesModule } from '../db_services/index.js';

@Module({
  imports: [DbServicesModule],
  controllers: [VouchingController],
  providers: [VouchingService],
  exports: [VouchingService],
})
export class VouchingModule {}
