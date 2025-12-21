'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PublicProjectCard, ProjectFilters } from '@/components/features/projects';
import { useProjects } from '@/lib/hooks';
import type { ProjectFilterParams } from '@/lib/api/projects';
import { FolderGit2, AlertCircle } from 'lucide-react';

export default function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilterParams>({});
  const { data: projects, isLoading, error } = useProjects(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FolderGit2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Project Directory</h1>
        </div>
        <p className="text-muted-foreground">
          Explore projects built by developers in the Web3 ecosystem
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProjectFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Projects Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Count */}
          {!isLoading && projects && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-64 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {(error as Error).message || 'Failed to load projects'}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && projects?.length === 0 && (
            <div className="text-center py-12">
              <FolderGit2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && !error && projects && projects.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <PublicProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
