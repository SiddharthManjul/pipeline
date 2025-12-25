import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreateVouchDto {
  @IsUUID()
  vouchedUserId: string;

  @IsArray()
  @IsString({ each: true })
  skillsEndorsed: string[];

  @IsOptional()
  @IsString()
  message?: string;
}
