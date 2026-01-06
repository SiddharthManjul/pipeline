import apiClient from './client';

export interface CreateVouchDto {
  vouchedUserId: string;
  skillsEndorsed: string[];
  message?: string;
}

export interface Vouch {
  id: string;
  voucherId: string;
  voucher: {
    id: string;
    username: string;
    fullName: string;
    tier: string;
  };
  voucherTier: string;
  vouchedUserId: string;
  vouchedUser: {
    id: string;
    username: string;
    fullName: string;
    tier: string;
  };
  vouchedUserTier: string;
  skillsEndorsed: string[];
  message?: string;
  weight: number;
  isActive: boolean;
  createdAt: string;
  revokedAt?: string;
  revokeReason?: string;
}

export interface VouchEligibility {
  id: string;
  developerId: string;
  isEligible: boolean;
  reasonsNotEligible: string[];
  lastCheckedAt: string;
}

export const vouchingApi = {
  createVouch: async (data: CreateVouchDto): Promise<Vouch> => {
    const response = await apiClient.post('/vouches', data);
    return response.data;
  },

  checkEligibility: async (developerId: string): Promise<VouchEligibility> => {
    const response = await apiClient.get(`/vouches/eligibility/${developerId}`);
    return response.data;
  },

  getDeveloperVouches: async (developerId: string): Promise<Vouch[]> => {
    const response = await apiClient.get(`/vouches/${developerId}`);
    // Backend returns { vouches, totalWeight, vouchCount }, extract vouches array
    return response.data.vouches || [];
  },

  getMyVouches: async (): Promise<Vouch[]> => {
    const response = await apiClient.get('/vouches/my-vouches');
    return response.data;
  },

  revokeVouch: async (vouchId: string, reason?: string): Promise<void> => {
    await apiClient.delete(`/vouches/${vouchId}`, {
      data: { reason },
    });
  },
};
