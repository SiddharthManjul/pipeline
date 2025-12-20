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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';
import { DeveloperTier, Availability } from '@/types';
import type { DeveloperFilterParams } from '@/types';

interface DeveloperFiltersProps {
  filters: DeveloperFilterParams;
  onFiltersChange: (filters: DeveloperFilterParams) => void;
}

export function DeveloperFilters({ filters, onFiltersChange }: DeveloperFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleTierChange = (value: string) => {
    onFiltersChange({
      ...filters,
      tier: value === 'all' ? undefined : (value as DeveloperTier),
    });
  };

  const handleAvailabilityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      availability: value === 'all' ? undefined : (value as Availability),
    });
  };

  const handleLocationChange = (value: string) => {
    onFiltersChange({ ...filters, location: value || undefined });
  };

  const handleSkillChange = (value: string) => {
    if (!value.trim()) return;
    const currentSkills = filters.skills || [];
    if (!currentSkills.includes(value.trim())) {
      onFiltersChange({
        ...filters,
        skills: [...currentSkills, value.trim()],
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onFiltersChange({
      ...filters,
      skills: filters.skills?.filter((s) => s !== skill),
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search ||
    filters.tier ||
    filters.availability ||
    filters.location ||
    (filters.skills && filters.skills.length > 0);

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
              placeholder="Search by name or username..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tier */}
        <div className="space-y-2">
          <Label htmlFor="tier">Tier</Label>
          <Select
            value={filters.tier || 'all'}
            onValueChange={handleTierChange}
          >
            <SelectTrigger id="tier">
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value={DeveloperTier.TIER_1}>Tier 1 - Elite</SelectItem>
              <SelectItem value={DeveloperTier.TIER_2}>Tier 2 - Advanced</SelectItem>
              <SelectItem value={DeveloperTier.TIER_3}>Tier 3 - Intermediate</SelectItem>
              <SelectItem value={DeveloperTier.TIER_4}>Tier 4 - Entry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={filters.availability || 'all'}
            onValueChange={handleAvailabilityChange}
          >
            <SelectTrigger id="availability">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={Availability.AVAILABLE}>Available</SelectItem>
              <SelectItem value={Availability.BUSY}>Busy</SelectItem>
              <SelectItem value={Availability.NOT_LOOKING}>Not Looking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., San Francisco, CA"
            value={filters.location || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills">Skills / Technologies</Label>
          <Input
            id="skills"
            placeholder="Add skill and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSkillChange(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          {filters.skills && filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
