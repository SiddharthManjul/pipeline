'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PublicProjectCard, ProjectFilters } from '@/components/features/projects';
import { useProjects } from '@/lib/hooks';
import type { ProjectFilterParams } from '@/lib/api/projects';
import { FolderGit2, AlertCircle } from 'lucide-react';
import { Background3D } from '@/components/landing/Background3D';
import { FuturisticCard } from '@/components/ui/futuristic-card';

export default function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilterParams>({});
  const { data: projects, isLoading, error } = useProjects(filters);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <FolderGit2 className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-orange-500">
            Project Directory
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Explore projects built by developers in the Web3 ecosystem
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProjectFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Projects Grid Container */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Discover</h2>
              {!isLoading && projects && (
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
                </p>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64">
                  <Skeleton className="h-full w-full rounded-2xl bg-white/5" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {(error as Error).message || 'Failed to load projects'}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && projects?.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <FolderGit2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && !error && projects && projects.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, index) => (
                <PublicProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
