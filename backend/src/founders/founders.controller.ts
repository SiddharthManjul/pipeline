import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { FoundersService } from '../db_services/founders.service.js';

@Controller('founders')
export class FoundersController {
  constructor(private readonly foundersService: FoundersService) {}

  /**
   * Get all founders with optional filtering
   */
  @Get()
  async getAllFounders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const skip = (pageNum - 1) * limitNum;

    const whereClause = search
      ? {
          OR: [
            { companyName: { contains: search, mode: 'insensitive' as const } },
            { position: { contains: search, mode: 'insensitive' as const } },
            { bio: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [founders, total] = await Promise.all([
      this.foundersService.founders({
        skip,
        take: limitNum,
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.foundersService.countFounders(whereClause),
    ]);

    return {
      data: founders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get founder by ID
   */
  @Get(':id')
  async getFounderById(@Param('id') id: string) {
    const founder = await this.foundersService.getFounderWithJobs(id);

    if (!founder) {
      throw new HttpException('Founder not found', HttpStatus.NOT_FOUND);
    }

    return founder;
  }
}
