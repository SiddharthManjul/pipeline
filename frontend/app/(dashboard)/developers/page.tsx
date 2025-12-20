'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DeveloperCard, DeveloperFilters } from '@/components/features/developers';
import { useDevelopers } from '@/lib/hooks';
import type { DeveloperFilterParams } from '@/types';
import { Users, AlertCircle } from 'lucide-react';

export default function DevelopersPage() {
  const [filters, setFilters] = useState<DeveloperFilterParams>({});
  const { data: developers, isLoading, error } = useDevelopers(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Developer Directory</h1>
        </div>
        <p className="text-muted-foreground">
          Browse and filter developers by reputation, tier, skills, and availability
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <DeveloperFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Developers Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Count */}
          {!isLoading && developers && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {developers.length} {developers.length === 1 ? 'developer' : 'developers'} found
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {(error as Error).message || 'Failed to load developers'}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && developers?.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No developers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}

          {/* Developers Grid */}
          {!isLoading && !error && developers && developers.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {developers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
