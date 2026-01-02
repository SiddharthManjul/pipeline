'use client';

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { ProjectFilterParams } from '@/lib/api/projects';

interface ProjectFiltersProps {
  filters: ProjectFilterParams;
  onFiltersChange: (filters: ProjectFilterParams) => void;
}

export function ProjectFilters({ filters, onFiltersChange }: ProjectFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleTechnologyChange = (value: string) => {
    onFiltersChange({ ...filters, technology: value || undefined });
  };

  const handleTeamProjectChange = (value: string) => {
    const isTeamProject = value === 'all' ? undefined : value === 'team';
    onFiltersChange({ ...filters, isTeamProject });
  };

  const handleVerifiedChange = (value: string) => {
    const isVerified = value === 'all' ? undefined : value === 'verified';
    onFiltersChange({ ...filters, isVerified });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value === 'recent' || value === 'stars' || value === 'forks' ? value : undefined,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search ||
    filters.technology ||
    filters.isTeamProject !== undefined ||
    filters.isVerified !== undefined ||
    filters.sortBy;

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
                placeholder="Project name..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Technology */}
          <div className="space-y-3">
            <Label htmlFor="technology" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Technology</Label>
            <Input
              id="technology"
              placeholder="e.g., React, AI"
              value={filters.technology || ''}
              onChange={(e) => handleTechnologyChange(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Team vs Solo */}
          <div className="space-y-3">
            <Label htmlFor="teamProject" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Type</Label>
            <Select
              value={
                filters.isTeamProject === undefined
                  ? 'all'
                  : filters.isTeamProject
                  ? 'team'
                  : 'solo'
              }
              onValueChange={handleTeamProjectChange}
            >
              <SelectTrigger id="teamProject" className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="team">Team Projects</SelectItem>
                <SelectItem value="solo">Solo Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verified */}
          <div className="space-y-3">
            <Label htmlFor="verified" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</Label>
            <Select
              value={
                filters.isVerified === undefined
                  ? 'all'
                  : filters.isVerified
                  ? 'verified'
                  : 'unverified'
              }
              onValueChange={handleVerifiedChange}
            >
              <SelectTrigger id="verified" className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <Label htmlFor="sortBy" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort By</Label>
            <Select
              value={filters.sortBy || 'recent'}
              onValueChange={handleSortChange}
            >
              <SelectTrigger id="sortBy" className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors">
                <SelectValue placeholder="Recent" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="stars">Most Stars</SelectItem>
                <SelectItem value="forks">Most Forks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </div>
    </FuturisticCard>
  );
}
