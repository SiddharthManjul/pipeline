import apiClient from './client';
import type {
  Developer,
  Founder,
  CreateDeveloperProfileDto,
  UpdateDeveloperProfileDto,
  CreateFounderProfileDto,
  UpdateFounderProfileDto,
  CreateProjectDto,
  UpdateProjectDto,
  Project,
} from '@/types';

export const profileApi = {
  // Get my full profile
  getMyProfile: async () => {
    const { data } = await apiClient.get<{
      id: string;
      email: string;
      role: string;
      developer?: Developer;
      founder?: Founder;
    }>('/profile/me');
    return data;
  },

  // Create developer profile
  createDeveloperProfile: async (
    profileData: CreateDeveloperProfileDto
  ): Promise<Developer> => {
    const { data } = await apiClient.post<Developer>('/profile/me', profileData);
    return data;
  },

  // Create founder profile
  createFounderProfile: async (profileData: CreateFounderProfileDto): Promise<Founder> => {
    const { data } = await apiClient.post<Founder>('/profile/me', profileData);
    return data;
  },

  // Update profile (works for both developer and founder)
  updateProfile: async (
    profileData: UpdateDeveloperProfileDto | UpdateFounderProfileDto
  ): Promise<Developer | Founder> => {
    const { data } = await apiClient.patch('/profile/me', profileData);
    return data;
  },

  // Get my projects
  getMyProjects: async (): Promise<Project[]> => {
    const { data} = await apiClient.get<Project[]>('/profile/me/projects');
    return data;
  },

  // Create project
  createProject: async (projectData: CreateProjectDto): Promise<Project> => {
    const { data } = await apiClient.post<Project>(
      '/profile/me/projects',
      projectData
    );
    return data;
  },

  // Update project
  updateProject: async (
    projectId: string,
    projectData: UpdateProjectDto
  ): Promise<Project> => {
    const { data } = await apiClient.patch<Project>(
      `/profile/me/projects/${projectId}`,
      projectData
    );
    return data;
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<void> => {
    await apiClient.delete(`/profile/me/projects/${projectId}`);
  },
};

export default profileApi;
