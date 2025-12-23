import apiClient from './client';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types';

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
    try {
      const { data } = await apiClient.get<{
        projects: Project[];
        total: number;
        limit: number;
        skip: number;
      }>('/projects', { params });
      return data?.projects || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  // Get project by ID
  getById: async (id: string): Promise<Project> => {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  // Create new project
  create: async (projectData: CreateProjectDto): Promise<Project> => {
    const { data } = await apiClient.post<Project>('/profile/me/projects', projectData);
    return data;
  },

  // Update project
  update: async (id: string, projectData: UpdateProjectDto): Promise<Project> => {
    const { data } = await apiClient.patch<Project>(`/profile/me/projects/${id}`, projectData);
    return data;
  },

  // Delete project
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/profile/me/projects/${id}`);
  },

  // Validate repository URL
  validateRepository: async (url: string) => {
    const { data } = await apiClient.post('/projects/validate', { repositoryUrl: url });
    return data;
  },
};

export default projectsApi;
