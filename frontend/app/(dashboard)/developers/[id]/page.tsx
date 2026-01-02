'use client';

import { use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/features/reputation';
import { ProjectCard } from '@/components/features/profile/ProjectCard';
import { useDeveloper, useReputationScore } from '@/lib/hooks';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { Background3D } from '@/components/landing/Background3D';
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
    <div className="space-y-6 relative">
      <Background3D />
      {/* Back Button */}
      <div className="relative z-10">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>

      {/* Profile Header */}
      <FuturisticCard className="border-primary/20 relative z-10" hoverEffect={false}>
        <div className="p-6">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-500">
                    {developer.fullName}
                  </h1>
                  <Badge className={availabilityColors[developer.availability as keyof typeof availabilityColors]}>
                    {availabilityLabels[developer.availability as keyof typeof availabilityLabels]}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">@{developer.username}</p>
              </div>
              <TierBadge tier={developer.tier} size="lg" />
            </div>
          </CardHeader>
          <div className="space-y-6">
            {/* Bio */}
            {developer.bio && (
              <div>
                <p className="text-white/90 leading-relaxed text-lg">{developer.bio}</p>
              </div>
            )}

            <Separator className="bg-white/10" />

            {/* Contact & Social */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Contact</h3>
                <div className="space-y-2 text-base">
                  <p className="text-white/90">{developer.contactNumber}</p>
                  {developer.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {developer.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Social Links</h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {developer.twitter && (
                    <a
                      href={developer.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                      Twitter
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {developer.linkedin && (
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Reputation & Tier */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Reputation Score</p>
                <p className="text-3xl font-bold text-orange-500">{(developer.reputationScore || 0).toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Tier</p>
                <TierBadge tier={developer.tier} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </FuturisticCard>

      {/* Projects Section */}
      <FuturisticCard className="border-primary/20 relative z-10" hoverEffect={false}>
        <div className="p-6">
          <CardHeader className="px-0 pt-0 mb-8">
            <CardTitle className="text-2xl font-bold">Projects</CardTitle>
            <CardDescription className="text-base">
              Developer's work and contributions
            </CardDescription>
          </CardHeader>
          <div>
            {developer.projects?.length === 0 || !developer.projects ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                <p className="text-muted-foreground text-lg">No projects yet</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {developer.projects.map((project: any, index: number) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onEdit={() => {}} // Read-only for public view
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </FuturisticCard>
    </div>
  );
}
