import { z } from 'zod';
import { Availability } from '@/types';

export const developerProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  contactNumber: z.string().min(10, 'Invalid contact number'),
  github: z.string().url('Must be a valid GitHub URL').includes('github.com', {
    message: 'Must be a GitHub URL',
  }),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  availability: z.nativeEnum(Availability).optional(),
});

export const updateDeveloperProfileSchema = developerProfileSchema.partial().omit({
  username: true,
  github: true,
});

export type DeveloperProfileFormData = z.infer<typeof developerProfileSchema>;
export type UpdateDeveloperProfileFormData = z.infer<typeof updateDeveloperProfileSchema>;
