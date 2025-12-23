import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi, type ProjectFilterParams } from '@/lib/api/projects';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types';
import { toast } from 'sonner';

export function useProjects(filters?: ProjectFilterParams) {
  return useQuery<Project[]>({
    queryKey: ['projects', filters || {}],
    queryFn: () => projectsApi.getAll(filters),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: [],
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectsApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch all project queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });
}
