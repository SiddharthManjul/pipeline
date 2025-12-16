import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './lib/index.js';
import { DbServicesModule } from './db_services/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    DbServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
