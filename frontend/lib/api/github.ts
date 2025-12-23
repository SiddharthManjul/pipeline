import apiClient from './client';

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubStats {
  profile: GitHubProfile;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  pullRequests: number;
  followers: number;
  contributionScore: number;
  languages: Record<string, number>;
  repositories: any[];
  lastSyncedAt?: string;
}

export interface RepositoryValidation {
  isValid: boolean;
  isPublic: boolean;
  exists: boolean;
  stars: number;
  forks: number;
  language: string;
  message?: string;
}

export const githubApi = {
  // Get GitHub profile
  getProfile: async (username: string): Promise<GitHubProfile> => {
    const { data } = await apiClient.get<GitHubProfile>(
      `/github/profile/${username}`
    );
    return data;
  },

  // Get GitHub stats
  getStats: async (username: string): Promise<GitHubStats> => {
    const { data } = await apiClient.get<GitHubStats>(`/github/stats/${username}`);
    return data;
  },

  // Validate repository
  validateRepository: async (
    repositoryUrl: string
  ): Promise<RepositoryValidation> => {
    const { data } = await apiClient.post<RepositoryValidation>(
      '/github/validate-repository',
      { repositoryUrl }
    );
    return data;
  },

  // Sync my GitHub data
  syncMyData: async () => {
    const { data } = await apiClient.post('/github/sync/me');
    return data;
  },

  // Sync by username
  syncByUsername: async (githubUsername: string) => {
    const { data } = await apiClient.post('/github/sync/username', {
      githubUsername,
    });
    return data;
  },
};

export default githubApi;
