import { useQuery } from '@tanstack/react-query';
import { developersApi } from '@/lib/api';
import type { Developer, DeveloperFilterParams } from '@/types';

export function useDevelopers(filters?: DeveloperFilterParams) {
  return useQuery<Developer[]>({
    queryKey: ['developers', filters],
    queryFn: () => developersApi.getAll(filters),
  });
}

export function useDeveloper(id: string) {
  return useQuery<Developer>({
    queryKey: ['developers', id],
    queryFn: () => developersApi.getById(id),
    enabled: !!id,
  });
}
