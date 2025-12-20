import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reputationApi } from '@/lib/api';
import { toast } from 'sonner';
import type { ReputationScore, ReputationHistory } from '@/types';

export function useMyReputationScore() {
  return useQuery<ReputationScore>({
    queryKey: ['reputation', 'me', 'score'],
    queryFn: () => reputationApi.getMyScore(),
  });
}

export function useMyReputationHistory() {
  return useQuery<ReputationHistory[]>({
    queryKey: ['reputation', 'me', 'history'],
    queryFn: () => reputationApi.getMyHistory(),
  });
}

export function useReputationScore(developerId: string) {
  return useQuery<ReputationScore>({
    queryKey: ['reputation', developerId, 'score'],
    queryFn: () => reputationApi.getScore(developerId),
    enabled: !!developerId,
  });
}

export function useReputationHistory(developerId: string) {
  return useQuery<ReputationHistory[]>({
    queryKey: ['reputation', developerId, 'history'],
    queryFn: () => reputationApi.getHistory(developerId),
    enabled: !!developerId,
  });
}

export function useCalculateMyReputation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reputationApi.calculateMy(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reputation', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Reputation recalculated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to calculate reputation');
    },
  });
}

export function useCalculateReputation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (developerId: string) => reputationApi.calculate(developerId),
    onSuccess: (_data, developerId) => {
      queryClient.invalidateQueries({ queryKey: ['reputation', developerId] });
      queryClient.invalidateQueries({ queryKey: ['developers', developerId] });
      toast.success('Reputation recalculated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to calculate reputation');
    },
  });
}
