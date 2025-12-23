import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { Public } from '../auth/decorators/index.js';
import { ProjectsService } from '../db_services/projects.service.js';

interface ProjectFilters {
  technologies?: string;
  search?: string;
  isVerified?: string;
  limit?: string;
  skip?: string;
}

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Get all projects with optional filtering
   * Public endpoint
   */
  @Public()
  @Get()
  async getAllProjects(@Query() filters: ProjectFilters) {
    const {
      technologies,
      search,
      isVerified,
      limit = '20',
      skip = '0',
    } = filters;

    const where: any = {};

    // Filter by technologies
    if (technologies) {
      const techArray = technologies.split(',').map(t => t.trim());
      where.technologies = {
        hasSome: techArray,
      };
    }

    // Filter by verified status
    if (isVerified === 'true') {
      where.isVerified = true;
    }

    // Search in name and description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.projectsService.projects({
        where,
        include: {
          developer: {
            select: {
              id: true,
              username: true,
              fullName: true,
              tier: true,
              reputationScore: true,
            },
          },
        },
        orderBy: { githubStars: 'desc' },
        take: parseInt(limit),
        skip: parseInt(skip),
      }),
      this.projectsService.countProjects(where),
    ]);

    return {
      projects,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    };
  }

  /**
   * Get a single project by ID
   * Public endpoint
   */
  @Public()
  @Get(':id')
  async getProject(@Param('id') id: string) {
    const project = await this.projectsService.projects({
      where: { id },
      include: {
        developer: {
          select: {
            id: true,
            username: true,
            fullName: true,
            tier: true,
            reputationScore: true,
            github: true,
            twitter: true,
            linkedin: true,
          },
        },
      },
      take: 1,
    });

    if (!project || project.length === 0) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return project[0];
  }
}
