'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DeveloperCard, DeveloperFilters } from '@/components/features/developers';
import { useDevelopers } from '@/lib/hooks';
import type { DeveloperFilterParams } from '@/types';
import { Users, AlertCircle } from 'lucide-react';
import { Background3D } from '@/components/landing/Background3D';

export default function DevelopersPage() {
  const [filters, setFilters] = useState<DeveloperFilterParams>({});
  const { data: developers, isLoading, error } = useDevelopers(filters);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-orange-500 uppercase italic tracking-tighter">
            Developer Directory
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Browse and filter developers by reputation, tier, skills, and availability
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <DeveloperFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Developers Grid Container */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Talent Pool</h2>
              {!isLoading && developers && (
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                  {developers.length} {developers.length === 1 ? 'developer' : 'developers'} found
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
                {(error as Error).message || 'Failed to load developers'}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && developers?.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No developers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}

          {/* Developers Grid */}
          {!isLoading && !error && developers && developers.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {developers.map((developer, index) => (
                <DeveloperCard 
                  key={developer.id} 
                  developer={developer} 
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
