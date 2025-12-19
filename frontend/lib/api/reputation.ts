import apiClient from './client';
import type { ReputationResponse, ReputationScore, ReputationHistory } from '@/types';

export const reputationApi = {
  // Calculate my reputation
  calculateMy: async (): Promise<ReputationResponse> => {
    const { data } = await apiClient.post<ReputationResponse>(
      '/reputation/calculate/me'
    );
    return data;
  },

  // Calculate reputation for a developer
  calculate: async (developerId: string): Promise<ReputationResponse> => {
    const { data } = await apiClient.post<ReputationResponse>(
      `/reputation/calculate/${developerId}`
    );
    return data;
  },

  // Get reputation score
  getScore: async (developerId: string): Promise<ReputationScore> => {
    const { data } = await apiClient.get<ReputationScore>(
      `/reputation/${developerId}`
    );
    return data;
  },

  // Get reputation history
  getHistory: async (developerId: string): Promise<ReputationHistory[]> => {
    const { data } = await apiClient.get<ReputationHistory[]>(
      `/reputation/${developerId}/history`
    );
    return data;
  },

  // Get my reputation score
  getMyScore: async (): Promise<ReputationScore> => {
    const { data } = await apiClient.get<ReputationScore>('/reputation/me/score');
    return data;
  },

  // Get my reputation history
  getMyHistory: async (): Promise<ReputationHistory[]> => {
    const { data } = await apiClient.get<ReputationHistory[]>(
      '/reputation/me/history'
    );
    return data;
  },
};

export default reputationApi;
