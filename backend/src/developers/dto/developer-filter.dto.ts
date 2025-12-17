/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import {
  DeveloperTier,
  Availability,
} from '../../../generated/prisma/client.js';
import { Type } from 'class-transformer';

export class DeveloperFilterDto {
  @IsOptional()
  @IsEnum(DeveloperTier)
  tier?: DeveloperTier;

  @IsOptional()
  @IsEnum(Availability)
  availability?: Availability;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minReputation?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  search?: string; // Search in username, fullName, bio

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @IsString()
  orderBy?: 'reputation' | 'recent' | 'alphabetical' = 'reputation';
}
