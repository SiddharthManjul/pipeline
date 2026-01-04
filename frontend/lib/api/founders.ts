import apiClient from './client';

export interface Founder {
  id: string;
  userId: string;
  fullName: string;
  companyName: string;
  position: string;
  companyWebsite?: string;
  bio?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    createdAt: string;
  };
}

export interface FoundersListResponse {
  data: Founder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetFoundersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const foundersApi = {
  /**
   * Get all founders with optional filters
   */
  async getFounders(params?: GetFoundersParams): Promise<FoundersListResponse> {
    const response = await apiClient.get<FoundersListResponse>('/founders', { params });
    return response.data;
  },

  /**
   * Get founder by ID
   */
  async getFounderById(id: string): Promise<Founder> {
    const response = await apiClient.get<Founder>(`/founders/${id}`);
    return response.data;
  },
};
