import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ValidateRepositoryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/,
    {
      message: 'Invalid GitHub repository URL format',
    },
  )
  repositoryUrl: string;
}
