'use client';

import { useState } from 'react';
import { ExternalLink, Github, Edit, Trash2, Users, Star, GitFork } from 'lucide-react';
import type { Project } from '@/types';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { Badge } from '@/components/ui/badge';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteMyProject } from '@/lib/hooks';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  index?: number;
}

export function ProjectCard({ project, onEdit, index = 0 }: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteProject = useDeleteMyProject();

  const handleDelete = async () => {
    await deleteProject.mutateAsync(project.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <FuturisticCard 
        className="border-primary/20 hover:border-orange-500/50 transition-all duration-300 group"
        chamferSize={20}
      >
        <div className="p-6 h-full flex flex-col">
          <CardHeader className="px-0 pt-0 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-orange-400 group-hover:to-orange-500 transition-all duration-300">
                  {project.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-muted-foreground/90 leading-relaxed">
                  {project.description}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/10"
                  onClick={() => onEdit(project)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <div className="space-y-6 mt-2 flex-1">
            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge 
                  key={tech} 
                  variant="secondary" 
                  className="bg-white/5 border-white/10 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {project.githubStars > 0 && (
                <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{project.githubStars}</span>
                </div>
              )}
              {project.githubForks > 0 && (
                <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                  <GitFork className="h-4 w-4 text-green-500" />
                  <span>{project.githubForks}</span>
                </div>
              )}
              {project.teammateNames.length > 0 && (
                <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{project.teammateNames.length + 1} MEMBERS</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4">
              {/* Links */}
              <div className="flex gap-4">
                <a
                  href={project.livePlatformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-all group/link"
                >
                  <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  <span>Live Demo</span>
                </a>
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-all group/link"
                >
                  <Github className="h-4 w-4 group-hover/link:scale-110 transition-transform" />
                  <span>Repository</span>
                </a>
              </div>

              {/* Verification Badge */}
              {project.isVerified && (
                <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Background Index Number */}
        <div className="absolute -bottom-4 -right-2 p-4 opacity-[0.03] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.07] pointer-events-none select-none">
          <span className="text-[12rem] font-black leading-none text-white italic">
            {index + 1}
          </span>
        </div>
      </FuturisticCard>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteProject.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
