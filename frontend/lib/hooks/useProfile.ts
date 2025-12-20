import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api';
import type {
  CreateDeveloperProfileDto,
  UpdateDeveloperProfileDto,
  CreateProjectDto,
  UpdateProjectDto,
} from '@/types';
import { toast } from 'sonner';

// Get my profile
export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileApi.getMyProfile(),
    retry: 1,
  });
}

// Get my projects
export function useMyProjects() {
  return useQuery({
    queryKey: ['projects', 'me'],
    queryFn: () => profileApi.getMyProjects(),
  });
}

// Create developer profile
export function useCreateDeveloperProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeveloperProfileDto) =>
      profileApi.createDeveloperProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create profile');
    },
  });
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDeveloperProfileDto) =>
      profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

// Create project
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => profileApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Project created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      profileApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Project updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => profileApi.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });
}
