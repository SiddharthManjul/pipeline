import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vouchingApi, type CreateVouchDto, type Vouch, type VouchEligibility } from '../api/vouching';
import { toast } from 'sonner';

// Hook to create a vouch
export function useCreateVouch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVouchDto) => vouchingApi.createVouch(data),
    onSuccess: (_, variables) => {
      toast.success('Vouch created successfully!');
      queryClient.invalidateQueries({ queryKey: ['vouches', 'my-vouches'] });
      queryClient.invalidateQueries({ queryKey: ['vouches', variables.vouchedUserId] });
      queryClient.invalidateQueries({ queryKey: ['reputation'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create vouch');
    },
  });
}

// Hook to check eligibility of a developer
export function useVouchEligibility(developerId: string | undefined) {
  return useQuery<VouchEligibility>({
    queryKey: ['vouch-eligibility', developerId],
    queryFn: () => vouchingApi.checkEligibility(developerId!),
    enabled: !!developerId,
  });
}

// Hook to get vouches for a specific developer
export function useDeveloperVouches(developerId: string | undefined) {
  return useQuery<Vouch[]>({
    queryKey: ['vouches', developerId],
    queryFn: () => vouchingApi.getDeveloperVouches(developerId!),
    enabled: !!developerId,
  });
}

// Hook to get vouches given by the current user
export function useMyVouches() {
  return useQuery<Vouch[]>({
    queryKey: ['vouches', 'my-vouches'],
    queryFn: () => vouchingApi.getMyVouches(),
  });
}

// Hook to revoke a vouch
export function useRevokeVouch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vouchId, reason }: { vouchId: string; reason?: string }) =>
      vouchingApi.revokeVouch(vouchId, reason),
    onSuccess: () => {
      toast.success('Vouch revoked successfully');
      queryClient.invalidateQueries({ queryKey: ['vouches'] });
      queryClient.invalidateQueries({ queryKey: ['reputation'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke vouch');
    },
  });
}
