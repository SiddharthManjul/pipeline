import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../auth/decorators/index.js';
import { DevelopersService } from '../db_services/developers.service.js';
import { ProjectsService } from '../db_services/projects.service.js';
import { DeveloperFilterDto } from './dto/index.js';

@Controller('developers')
export class DevelopersController {
  constructor(
    private readonly developersService: DevelopersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Public()
  @Get()
  async listDevelopers(@Query() filterDto: DeveloperFilterDto) {
    const {
      tier,
      availability,
      minReputation,
      location,
      search,
      limit,
      skip,
      orderBy,
    } = filterDto;

    // Build order by clause
    let orderByClause;
    switch (orderBy) {
      case 'recent':
        orderByClause = { createdAt: 'desc' as const };
        break;
      case 'alphabetical':
        orderByClause = { username: 'asc' as const };
        break;
      case 'reputation':
      default:
        orderByClause = { reputationScore: 'desc' as const };
    }

    // Search developers
    if (search) {
      const developers = await this.developersService.developers({
        where: {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { fullName: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
          ],
          ...(tier && { tier }),
          ...(availability && { availability }),
          ...(minReputation && { reputationScore: { gte: minReputation } }),
          ...(location && {
            location: { contains: location, mode: 'insensitive' },
          }),
        },
        orderBy: orderByClause,
        skip: skip || 0,
        take: limit || 20,
      });

      const total = await this.developersService.countDevelopers({
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
        ],
        ...(tier && { tier }),
        ...(availability && { availability }),
        ...(minReputation && { reputationScore: { gte: minReputation } }),
        ...(location && {
          location: { contains: location, mode: 'insensitive' },
        }),
      });

      return {
        developers,
        total,
        limit: limit || 20,
        skip: skip || 0,
      };
    }

    // Regular filtered search
    const developers = await this.developersService.searchDevelopers({
      tier,
      availability,
      minReputation,
      location,
      skip: skip || 0,
      take: limit || 20,
    });

    const total = await this.developersService.countDevelopers({
      ...(tier && { tier }),
      ...(availability && { availability }),
      ...(minReputation && { reputationScore: { gte: minReputation } }),
      ...(location && {
        location: { contains: location, mode: 'insensitive' },
      }),
    });

    return {
      developers,
      total,
      limit: limit || 20,
      skip: skip || 0,
    };
  }

  @Public()
  @Get(':id')
  async getDeveloper(@Param('id') id: string) {
    const developer = await this.developersService.getDeveloperWithProjects(id);

    if (!developer) {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }

    return developer;
  }

  @Public()
  @Get(':id/projects')
  async getDeveloperProjects(@Param('id') id: string) {
    const developer = await this.developersService.developer({ id });

    if (!developer) {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }

    return this.projectsService.findProjectsByDeveloper(id);
  }

  @Public()
  @Get(':id/reputation')
  async getDeveloperReputation(@Param('id') id: string) {
    const developer = await this.developersService.developer({ id });

    if (!developer) {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }

    return {
      developerId: developer.id,
      username: developer.username,
      tier: developer.tier,
      reputationScore: developer.reputationScore,
    };
  }
}
