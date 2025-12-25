import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { VouchingService } from './vouching.service.js';
import { CreateVouchDto } from './dto/create-vouch.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

interface UserWithDeveloper {
  id: string;
  email: string;
  developer: {
    id: string;
    username: string;
    tier: string;
  };
}

@Controller('vouches')
@UseGuards(JwtAuthGuard)
export class VouchingController {
  constructor(private vouchingService: VouchingService) {}

  /**
   * Create a new vouch
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createVouch(
    @CurrentUser() user: UserWithDeveloper,
    @Body() createVouchDto: CreateVouchDto,
  ) {
    const voucherId = user.developer.id;
    return this.vouchingService.createVouch(voucherId, createVouchDto);
  }

  /**
   * Check eligibility of a developer to receive vouches
   */
  @Get('eligibility/:developerId')
  async checkEligibility(@Param('developerId') developerId: string) {
    return this.vouchingService.checkVouchEligibility(developerId);
  }

  /**
   * Get all vouches for a specific developer
   */
  @Get(':developerId')
  async getVouchesForDeveloper(@Param('developerId') developerId: string) {
    return this.vouchingService.getVouchesForDeveloper(developerId);
  }

  /**
   * Get all vouches given by the current user
   */
  @Get('my-vouches')
  async getMyVouches(@CurrentUser() user: UserWithDeveloper) {
    const developerId = user.developer.id;
    return this.vouchingService.getVouchesGivenByDeveloper(developerId);
  }

  /**
   * Revoke a vouch
   */
  @Delete(':vouchId')
  @HttpCode(HttpStatus.OK)
  async revokeVouch(
    @Param('vouchId') vouchId: string,
    @CurrentUser() user: UserWithDeveloper,
    @Body('reason') reason?: string,
  ) {
    const voucherId = user.developer.id;
    return this.vouchingService.revokeVouch(vouchId, voucherId, reason);
  }
}
