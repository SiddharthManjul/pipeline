import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TierBadge } from '@/components/features/reputation';
import { MapPin, Star, FolderGit2, ExternalLink } from 'lucide-react';
import type { Developer } from '@/types';
import Link from 'next/link';

interface DeveloperCardProps {
  developer: Developer;
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const availabilityColors = {
    AVAILABLE: 'bg-green-500',
    BUSY: 'bg-yellow-500',
    NOT_LOOKING: 'bg-gray-500',
  };

  const availabilityLabels = {
    AVAILABLE: 'Available',
    BUSY: 'Busy',
    NOT_LOOKING: 'Not Looking',
  };

  // Extract technologies from projects
  const allTechnologies = developer.projects
    ?.flatMap((p) => p.technologies)
    .filter((tech, index, self) => self.indexOf(tech) === index)
    .slice(0, 5) || [];

  return (
    <Card className="hover:shadow-lg transition-all hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-xl">{developer.fullName}</CardTitle>
              <TierBadge tier={developer.tier} size="sm" />
              <Badge className={`${availabilityColors[developer.availability]} text-white`}>
                {availabilityLabels[developer.availability]}
              </Badge>
            </div>
            <CardDescription>@{developer.username}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-lg">{developer.reputationScore.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">Reputation</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bio */}
        {developer.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {developer.bio}
          </p>
        )}

        {/* Location */}
        {developer.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {developer.location}
          </div>
        )}

        {/* Technologies */}
        {allTechnologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTechnologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Projects Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderGit2 className="h-4 w-4" />
          <span>{developer.projects?.length || 0} Projects</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/developers/${developer.id}`} className="flex-1">
            <Button variant="default" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
