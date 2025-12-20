'use client';

import { use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/features/reputation';
import { ProjectCard } from '@/components/features/profile/ProjectCard';
import { useDeveloper, useReputationScore } from '@/lib/hooks';
import { AlertCircle, ArrowLeft, Github, Twitter, Linkedin, MapPin, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeveloperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: developer, isLoading, error } = useDeveloper(resolvedParams.id);
  const { data: reputationScore } = useReputationScore(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {(error as Error)?.message || 'Developer not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Directory
      </Button>

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{developer.fullName}</CardTitle>
                <Badge className={availabilityColors[developer.availability]}>
                  {availabilityLabels[developer.availability]}
                </Badge>
              </div>
              <CardDescription className="text-base">@{developer.username}</CardDescription>
            </div>
            <TierBadge tier={developer.tier} size="lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bio */}
          {developer.bio && (
            <div>
              <p className="text-muted-foreground">{developer.bio}</p>
            </div>
          )}

          <Separator />

          {/* Contact & Social */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{developer.contactNumber}</p>
                {developer.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {developer.location}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Social Links</h3>
              <div className="space-y-2">
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
                {developer.twitter && (
                  <a
                    href={developer.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {developer.linkedin && (
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Reputation & Tier */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Reputation Score</p>
              <p className="text-2xl font-bold">{developer.reputationScore.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tier</p>
              <TierBadge tier={developer.tier} size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Developer's work and contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {developer.projects?.length === 0 || !developer.projects ? (
            <p className="text-muted-foreground text-center py-8">
              No projects yet
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {developer.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => {}} // Read-only for public view
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
