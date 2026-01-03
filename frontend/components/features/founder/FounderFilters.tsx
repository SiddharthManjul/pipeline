'use client';

import { CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import { FuturisticCard } from '@/components/ui/futuristic-card';

interface FounderFiltersProps {
  filters: { search?: string };
  onFiltersChange: (filters: { search?: string }) => void;
}

export function FounderFilters({ filters, onFiltersChange }: FounderFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = !!filters.search;

  return (
    <FuturisticCard className="border-primary/20" hoverEffect={false}>
      <div className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-orange-500" />
              <div>
                <CardTitle className="text-xl font-bold">Filters</CardTitle>
                <CardDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">Refine your search</CardDescription>
              </div>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 text-[10px] uppercase tracking-tighter font-bold hover:bg-orange-500/10 text-orange-400"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-0 space-y-6 pt-2">
          {/* Search */}
          <div className="space-y-3">
            <Label htmlFor="search" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Company or position..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>
        </CardContent>
      </div>
    </FuturisticCard>
  );
}
