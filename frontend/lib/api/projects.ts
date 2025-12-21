import apiClient from './client';
import type { Project } from '@/types';

export interface ProjectFilterParams {
  search?: string;
  technology?: string;
  isTeamProject?: boolean;
  isVerified?: boolean;
  sortBy?: 'recent' | 'stars' | 'forks';
}

export const projectsApi = {
  // Get all projects with filters
  getAll: async (params?: ProjectFilterParams): Promise<Project[]> => {
    const { data } = await apiClient.get<{
      projects: Project[];
      total: number;
      limit: number;
      skip: number;
    }>('/projects', { params });
    return data.projects;
  },

  // Get project by ID
  getById: async (id: string): Promise<Project> => {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  // Validate repository URL
  validateRepository: async (url: string) => {
    const { data } = await apiClient.post('/projects/validate', { repositoryUrl: url });
    return data;
  },
};

export default projectsApi;
