import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service.js';
import { DevelopersService } from '../db_services/developers.service.js';
import { FoundersService } from '../db_services/founders.service.js';
import {
  CreateDeveloperProfileDto,
  UpdateDeveloperProfileDto,
  CreateFounderProfileDto,
  UpdateFounderProfileDto,
} from './dto/index.js';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private developersService: DevelopersService,
    private foundersService: FoundersService,
  ) {}

  async getFullProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        developer: {
          include: {
            projects: true,
            vouchesReceived: {
              where: { isActive: true },
              include: {
                developerVoucher: {
                  select: {
                    username: true,
                    tier: true,
                  },
                },
                founderVoucher: {
                  select: {
                    fullName: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        },
        founder: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createDeveloperProfile(
    userId: string,
    createDto: CreateDeveloperProfileDto,
  ) {
    // Check if developer profile already exists
    const existing = await this.developersService.findDeveloperByUserId(userId);
    if (existing) {
      throw new HttpException(
        'Developer profile already exists',
        HttpStatus.CONFLICT,
      );
    }

    // Check if username is already taken
    const usernameExists = await this.developersService.findDeveloperByUsername(
      createDto.username,
    );
    if (usernameExists) {
      throw new HttpException(
        'Username already taken',
        HttpStatus.CONFLICT,
      );
    }

    return this.developersService.createDeveloper({
      user: { connect: { id: userId } },
      ...createDto,
    });
  }

  async updateDeveloperProfile(
    userId: string,
    updateDto: UpdateDeveloperProfileDto,
  ) {
    const developer = await this.developersService.findDeveloperByUserId(userId);
    if (!developer) {
      throw new HttpException(
        'Developer profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // If updating username, check if it's already taken
    if (updateDto.username && updateDto.username !== developer.username) {
      const usernameExists = await this.developersService.findDeveloperByUsername(
        updateDto.username,
      );
      if (usernameExists) {
        throw new HttpException(
          'Username already taken',
          HttpStatus.CONFLICT,
        );
      }
    }

    return this.developersService.updateDeveloper({
      where: { id: developer.id },
      data: updateDto,
    });
  }

  async createFounderProfile(
    userId: string,
    createDto: CreateFounderProfileDto,
  ) {
    // Check if founder profile already exists
    const existing = await this.foundersService.findFounderByUserId(userId);
    if (existing) {
      throw new HttpException(
        'Founder profile already exists',
        HttpStatus.CONFLICT,
      );
    }

    return this.foundersService.createFounder({
      user: { connect: { id: userId } },
      ...createDto,
    });
  }

  async updateFounderProfile(
    userId: string,
    updateDto: UpdateFounderProfileDto,
  ) {
    const founder = await this.foundersService.findFounderByUserId(userId);
    if (!founder) {
      throw new HttpException(
        'Founder profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.foundersService.updateFounder({
      where: { id: founder.id },
      data: updateDto,
    });
  }
}
