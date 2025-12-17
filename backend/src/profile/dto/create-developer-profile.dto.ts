/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Availability } from '../../../generated/prisma/client.js';

export class CreateDeveloperProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsUrl()
  @IsNotEmpty()
  github: string;

  @IsUrl()
  @IsOptional()
  twitter?: string;

  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(Availability)
  @IsOptional()
  availability?: Availability;
}
