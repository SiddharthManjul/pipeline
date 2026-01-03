import { useQuery } from '@tanstack/react-query';
import { foundersApi, type GetFoundersParams } from '../api/founders';

/**
 * Hook to fetch all founders with optional filters
 */
export function useFounders(params?: GetFoundersParams) {
  return useQuery({
    queryKey: ['founders', params],
    queryFn: () => foundersApi.getFounders(params),
  });
}

/**
 * Hook to fetch a single founder by ID
 */
export function useFounder(id: string) {
  return useQuery({
    queryKey: ['founder', id],
    queryFn: () => foundersApi.getFounderById(id),
    enabled: !!id,
  });
}
