import { useQuery } from '@tanstack/react-query';
import { projectsApi, type ProjectFilterParams } from '@/lib/api/projects';
import type { Project } from '@/types';

export function useProjects(filters?: ProjectFilterParams) {
  return useQuery<Project[]>({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getAll(filters),
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
}
