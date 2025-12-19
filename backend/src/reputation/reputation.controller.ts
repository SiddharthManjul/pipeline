import {
  Controller,
  Get,
  Post,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../auth/decorators/index.js';
import { CurrentUser } from '../auth/decorators/index.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { User } from '../../generated/prisma/client.js';
import { ReputationService } from './reputation.service.js';
import { DevelopersService } from '../db_services/developers.service.js';

@Controller('reputation')
export class ReputationController {
  constructor(
    private readonly reputationService: ReputationService,
    private readonly developersService: DevelopersService,
  ) {}

  /**
   * Calculate reputation for the authenticated developer
   * Protected - Developers only
   */
  @Post('calculate/me')
  async calculateMyReputation(@CurrentUser() user: User) {
    const developer = await this.developersService.findDeveloperByUserId(
      user.id,
    );

    if (!developer) {
      throw new HttpException(
        'Only developers can calculate reputation',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.reputationService.calculateReputation(developer.id);
  }

  /**
   * Calculate reputation for a specific developer by ID
   * Protected - Any authenticated user can trigger
   */
  @Post('calculate/:developerId')
  async calculateDeveloperReputation(
    @Param('developerId') developerId: string,
  ) {
    return this.reputationService.calculateReputation(developerId);
  }

  /**
   * Get reputation score for a developer
   * Public endpoint
   */
  @Public()
  @Get(':developerId')
  async getReputation(@Param('developerId') developerId: string) {
    return this.reputationService.getReputation(developerId);
  }

  /**
   * Get reputation history for a developer
   * Public endpoint
   */
  @Public()
  @Get(':developerId/history')
  async getReputationHistory(@Param('developerId') developerId: string) {
    return this.reputationService.getReputationHistory(developerId);
  }

  /**
   * Get my reputation score
   * Protected - Developers only
   */
  @Get('me/score')
  async getMyReputation(@CurrentUser() user: User) {
    const developer = await this.developersService.findDeveloperByUserId(
      user.id,
    );

    if (!developer) {
      throw new HttpException(
        'Only developers have reputation scores',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.reputationService.getReputation(developer.id);
  }

  /**
   * Get my reputation history
   * Protected - Developers only
   */
  @Get('me/history')
  async getMyReputationHistory(@CurrentUser() user: User) {
    const developer = await this.developersService.findDeveloperByUserId(
      user.id,
    );

    if (!developer) {
      throw new HttpException(
        'Only developers have reputation history',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.reputationService.getReputationHistory(developer.id);
  }

  /**
   * Recalculate all developer reputations
   * Admin endpoint (TODO: Add admin role check)
   */
  @Post('recalculate-all')
  @Roles('ADMIN')
  async recalculateAllReputations() {
    return this.reputationService.recalculateAllReputations();
  }
}
