import { z } from 'zod';

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be at most 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  livePlatformUrl: z.string().url('Must be a valid URL'),
  repositoryUrl: z
    .string()
    .url('Must be a valid URL')
    .includes('github.com', { message: 'Must be a GitHub repository URL' }),
});

export const updateProjectSchema = projectSchema.partial();

export type ProjectFormData = z.infer<typeof projectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
