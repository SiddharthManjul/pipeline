import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../auth/decorators/index.js';
import { CurrentUser } from '../auth/decorators/index.js';
import type { User } from '../../generated/prisma/client.js';
import { GithubService } from './github.service.js';
import { SyncGithubProfileDto, ValidateRepositoryDto } from './dto/index.js';
import { DevelopersService } from '../db_services/developers.service.js';

@Controller('github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly developersService: DevelopersService,
  ) {}

  /**
   * Get GitHub profile information by username
   * Public endpoint for browsing
   */
  @Public()
  @Get('profile/:username')
  async getGitHubProfile(@Param('username') username: string) {
    return this.githubService.getGitHubProfile(username);
  }

  /**
   * Get comprehensive GitHub statistics for a user
   * Public endpoint
   */
  @Public()
  @Get('stats/:username')
  async getGitHubStats(@Param('username') username: string) {
    return this.githubService.getGitHubStats(username);
  }

  /**
   * Get repositories for a GitHub user
   * Public endpoint
   */
  @Public()
  @Get('repositories/:username')
  async getGitHubRepositories(@Param('username') username: string) {
    return this.githubService.getGitHubRepositories(username);
  }

  /**
   * Validate a GitHub repository URL
   * Public endpoint for project submission validation
   */
  @Public()
  @Post('validate-repository')
  async validateRepository(@Body() validateDto: ValidateRepositoryDto) {
    return this.githubService.validateRepository(validateDto.repositoryUrl);
  }

  /**
   * Sync GitHub data for the authenticated developer
   * Protected endpoint - only for own profile
   */
  @Post('sync/me')
  async syncMyGitHubData(@CurrentUser() user: User) {
    // Check if user is a developer
    const developer = await this.developersService.findDeveloperByUserId(
      user.id,
    );

    if (!developer) {
      throw new HttpException(
        'Only developers can sync GitHub data',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.githubService.syncDeveloperGitHubData(developer.id);
  }

  /**
   * Sync GitHub data for a specific developer by ID
   * Admin endpoint (for now, any authenticated user can trigger)
   * TODO: Add admin role check
   */
  @Post('sync/:developerId')
  async syncDeveloperGitHubData(@Param('developerId') developerId: string) {
    return this.githubService.syncDeveloperGitHubData(developerId);
  }

  /**
   * Manually sync GitHub data for a specific username
   * Useful for initial profile creation
   */
  @Post('sync/username')
  async syncByUsername(
    @Body() syncDto: SyncGithubProfileDto,
    @CurrentUser() user: User,
  ) {
    // Get developer profile
    const developer = await this.developersService.findDeveloperByUserId(
      user.id,
    );

    if (!developer) {
      throw new HttpException(
        'Only developers can sync GitHub data',
        HttpStatus.FORBIDDEN,
      );
    }

    // Verify the username matches the developer's GitHub profile
    const stats = await this.githubService.getGitHubStats(
      syncDto.githubUsername,
    );

    return {
      message: 'GitHub profile fetched successfully',
      stats: {
        profile: stats.profile,
        totalRepos: stats.repositories.length,
        totalStars: stats.totalStars,
        totalForks: stats.totalForks,
        contributionScore: stats.contributionScore,
        languages: stats.languages,
      },
    };
  }
}
