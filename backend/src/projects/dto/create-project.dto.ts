/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsUrl()
  @IsNotEmpty()
  livePlatformUrl: string;

  @IsUrl()
  @IsNotEmpty()
  repositoryUrl: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teammateNames?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  technologies: string[];
}
