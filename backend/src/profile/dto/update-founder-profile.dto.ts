/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateFounderProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  companyName?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsUrl()
  @IsOptional()
  companyWebsite?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;
}
