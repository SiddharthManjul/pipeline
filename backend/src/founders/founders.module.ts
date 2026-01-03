import { Module } from '@nestjs/common';
import { FoundersController } from './founders.controller.js';
import { FoundersService } from '../db_services/founders.service.js';
import { PrismaService } from '../lib/prisma.service.js';

@Module({
  controllers: [FoundersController],
  providers: [FoundersService, PrismaService],
  exports: [FoundersService],
})
export class FoundersModule {}
