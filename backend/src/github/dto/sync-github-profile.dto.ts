import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SyncGithubProfileDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'Invalid GitHub username format',
  })
  githubUsername: string;
}
