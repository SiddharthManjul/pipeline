'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FounderCard, FounderFilters } from '@/components/features/founder';
import { useFounders } from '@/lib/hooks';
import { Building2, AlertCircle } from 'lucide-react';
import { Background3D } from '@/components/landing/Background3D';

export default function FoundersPage() {
  const [filters, setFilters] = useState<{ search?: string }>({});
  const { data: foundersResponse, isLoading, error } = useFounders(filters);

  const founders = foundersResponse?.data || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-orange-500 uppercase italic tracking-tighter">
            Founder Directory
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Browse companies and founders building in Web3
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FounderFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Founders Grid Container */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Companies</h2>
              {!isLoading && foundersResponse && (
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                  {foundersResponse.pagination.total} {foundersResponse.pagination.total === 1 ? 'founder' : 'founders'} found
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
                {(error as Error).message || 'Failed to load founders'}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && founders.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <Building2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No founders found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}

          {/* Founders Grid */}
          {!isLoading && !error && founders.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {founders.map((founder, index) => (
                <FounderCard
                  key={founder.id}
                  founder={founder}
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
