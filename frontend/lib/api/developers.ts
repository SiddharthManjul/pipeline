import apiClient from './client';
import type {
  Developer,
  DeveloperFilterParams,
  Project,
} from '@/types';

export const developersApi = {
  // Get all developers with filters
  getAll: async (params?: DeveloperFilterParams): Promise<Developer[]> => {
    const { data } = await apiClient.get<{
      developers: Developer[];
      total: number;
      limit: number;
      skip: number;
    }>('/developers', { params });
    return data.developers;
  },

  // Get developer by ID
  getById: async (id: string): Promise<Developer> => {
    const { data } = await apiClient.get<Developer>(`/developers/${id}`);
    return data;
  },

  // Get developer's projects
  getProjects: async (id: string): Promise<Project[]> => {
    const { data } = await apiClient.get<Project[]>(`/developers/${id}/projects`);
    return data;
  },

  // Get developer's reputation
  getReputation: async (id: string) => {
    const { data } = await apiClient.get(`/developers/${id}/reputation`);
    return data;
  },
};

export default developersApi;
