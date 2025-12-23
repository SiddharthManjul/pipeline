import { DeveloperTier } from './auth';

export interface Project {
  id: string;
  developerId: string;
  name: string;
  description: string;
  livePlatformUrl: string;
  repositoryUrl: string;
  teammateNames: string[];
  technologies: string[];
  githubStars: number;
  githubForks: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  developer?: {
    id: string;
    username: string;
    fullName: string;
    tier: DeveloperTier;
    bio?: string;
  };
}

export interface CreateProjectDto {
  name: string;
  description: string;
  livePlatformUrl: string;
  repositoryUrl: string;
  teammateNames?: string[];
  technologies: string[];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  livePlatformUrl?: string;
  repositoryUrl?: string;
  teammateNames?: string[];
  technologies?: string[];
}
