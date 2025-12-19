import { DeveloperTier } from './auth';

export interface ReputationBreakdown {
  githubScore: number;
  projectsScore: number;
  timeScore: number;
  hackathonsScore: number;
  communityScore: number;
}

export interface ReputationWeights {
  github: number;
  projects: number;
  time: number;
  hackathons: number;
  community: number;
}

export interface ReputationScore {
  id: string;
  developerId: string;
  totalScore: number;
  tier: DeveloperTier;
  githubScore: number;
  projectsScore: number;
  timeScore: number;
  hackathonsScore: number;
  communityScore: number;
  calculatedAt: string;
  metadata?: any;
}

export interface ReputationResponse {
  totalScore: number;
  tier: DeveloperTier;
  breakdown: ReputationBreakdown;
  weights: ReputationWeights;
  metadata?: any;
}

export interface ReputationHistory {
  id: string;
  developerId: string;
  score: number;
  tier: DeveloperTier;
  date: string;
}
