'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X } from 'lucide-react';
import { projectSchema, type ProjectFormData } from '@/lib/validations';
import { useCreateProject, useUpdateProject } from '@/lib/hooks';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project; // If provided, edit mode
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
  const isEditMode = !!project;
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [techInput, setTechInput] = useState('');
  const [teammates, setTeammates] = useState<string[]>(project?.teammateNames || []);
  const [teammateInput, setTeammateInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          description: project.description,
          livePlatformUrl: project.livePlatformUrl,
          repositoryUrl: project.repositoryUrl,
          technologies: project.technologies,
          teammateNames: project.teammateNames,
        }
      : undefined,
  });

  useEffect(() => {
    if (project) {
      setTechnologies(project.technologies);
      setTeammates(project.teammateNames);
    }
  }, [project]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        ...data,
        technologies,
        teammateNames: teammates,
      };

      if (isEditMode) {
        await updateProject.mutateAsync({ id: project.id, data: projectData });
      } else {
        await createProject.mutateAsync(projectData);
      }

      reset();
      setTechnologies([]);
      setTeammates([]);
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const addTeammate = () => {
    if (teammateInput.trim() && !teammates.includes(teammateInput.trim())) {
      setTeammates([...teammates, teammateInput.trim()]);
      setTeammateInput('');
    }
  };

  const removeTeammate = (teammate: string) => {
    setTeammates(teammates.filter((t) => t !== teammate));
  };

  const isPending = createProject.isPending || updateProject.isPending;
  const error = createProject.error || updateProject.error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update your project information'
              : 'Add a project to showcase your work and increase your reputation'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="My Awesome DApp"
              {...register('name')}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what your project does and its key features..."
              rows={4}
              {...register('description')}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* URLs */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="livePlatformUrl">
                Live URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="livePlatformUrl"
                placeholder="https://myproject.com"
                {...register('livePlatformUrl')}
                disabled={isPending}
              />
              {errors.livePlatformUrl && (
                <p className="text-sm text-destructive">
                  {errors.livePlatformUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="repositoryUrl">
                GitHub Repository <span className="text-destructive">*</span>
              </Label>
              <Input
                id="repositoryUrl"
                placeholder="https://github.com/user/repo"
                {...register('repositoryUrl')}
                disabled={isPending}
              />
              {errors.repositoryUrl && (
                <p className="text-sm text-destructive">
                  {errors.repositoryUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label>
              Technologies <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React, Solidity, Web3.js"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
                disabled={isPending}
              />
              <Button type="button" onClick={addTechnology} disabled={isPending}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="gap-1">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {technologies.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add at least one technology
              </p>
            )}
          </div>

          {/* Teammates */}
          <div className="space-y-2">
            <Label>Teammates (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Teammate name"
                value={teammateInput}
                onChange={(e) => setTeammateInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTeammate();
                  }
                }}
                disabled={isPending}
              />
              <Button type="button" onClick={addTeammate} disabled={isPending}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {teammates.map((teammate) => (
                <Badge key={teammate} variant="outline" className="gap-1">
                  {teammate}
                  <button
                    type="button"
                    onClick={() => removeTeammate(teammate)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || technologies.length === 0}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditMode ? (
                'Update Project'
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
