/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsUrl,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @IsUrl()
  @IsOptional()
  livePlatformUrl?: string;

  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teammateNames?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];
}
