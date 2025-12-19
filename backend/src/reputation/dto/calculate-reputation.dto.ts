import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CalculateReputationDto {
  @IsString()
  @IsNotEmpty()
  developerId: string;

  @IsBoolean()
  @IsOptional()
  forceRecalculate?: boolean;
}
