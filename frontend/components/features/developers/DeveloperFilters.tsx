'use client';

import { CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { X, Search, SlidersHorizontal, MapPin, Award, UserCheck } from 'lucide-react';
import { DeveloperTier, Availability } from '@/types';
import type { DeveloperFilterParams } from '@/types';
import { FuturisticCard } from '@/components/ui/futuristic-card';

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
                placeholder="Name or username..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Tier */}
          <div className="space-y-3">
            <Label htmlFor="tier" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Award className="h-3 w-3 text-orange-500/70" />
              Tier
            </Label>
            <Select
              value={filters.tier || 'all'}
              onValueChange={handleTierChange}
            >
              <SelectTrigger id="tier" className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value={DeveloperTier.TIER_1}>Tier 1 - Elite</SelectItem>
                <SelectItem value={DeveloperTier.TIER_2}>Tier 2 - Advanced</SelectItem>
                <SelectItem value={DeveloperTier.TIER_3}>Tier 3 - Intermediate</SelectItem>
                <SelectItem value={DeveloperTier.TIER_4}>Tier 4 - Entry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label htmlFor="availability" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-3 w-3 text-orange-500/70" />
              Availability
            </Label>
            <Select
              value={filters.availability || 'all'}
              onValueChange={handleAvailabilityChange}
            >
              <SelectTrigger id="availability" className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={Availability.AVAILABLE}>Available</SelectItem>
                <SelectItem value={Availability.BUSY}>Busy</SelectItem>
                <SelectItem value={Availability.NOT_LOOKING}>Not Looking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MapPin className="h-3 w-3 text-orange-500/70" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              value={filters.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Skills */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <Label htmlFor="skills" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills / Tech</Label>
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
              className="bg-white/5 border-white/10 focus:border-orange-500/50 transition-colors"
            />
            {filters.skills && filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="gap-1 bg-orange-500/10 border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </FuturisticCard>
  );
}
