'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your search</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search projects..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Technology */}
        <div className="space-y-2">
          <Label htmlFor="technology">Technology</Label>
          <Input
            id="technology"
            placeholder="e.g., React, Solidity"
            value={filters.technology || ''}
            onChange={(e) => handleTechnologyChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Filter by specific technology or framework
          </p>
        </div>

        {/* Team vs Solo */}
        <div className="space-y-2">
          <Label htmlFor="teamProject">Project Type</Label>
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
            <SelectTrigger id="teamProject">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="team">Team Projects</SelectItem>
              <SelectItem value="solo">Solo Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verified */}
        <div className="space-y-2">
          <Label htmlFor="verified">Verification Status</Label>
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
            <SelectTrigger id="verified">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select
            value={filters.sortBy || 'recent'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Recent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="forks">Most Forks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
