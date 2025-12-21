'use client';

import { use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TierBadge } from '@/components/features/reputation';
import { useProject } from '@/lib/hooks';
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Github,
  Star,
  GitFork,
  Users,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {(error as Error)?.message || 'Project not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isTeamProject = project.teammateNames && project.teammateNames.length > 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>

      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <CardTitle className="text-3xl">{project.name}</CardTitle>
                  {project.isVerified && (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {isTeamProject && (
                    <Badge variant="secondary" className="text-base">
                      <Users className="h-4 w-4 mr-1" />
                      Team Project
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base mt-2">
                  {project.description}
                </CardDescription>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <a
                href={project.livePlatformUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Live Demo
                </Button>
              </a>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  View Repository
                </Button>
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          {/* Technologies */}
          <div>
            <h3 className="font-semibold mb-3">Technologies & Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* GitHub Stats */}
          {(project.githubStars > 0 || project.githubForks > 0) && (
            <>
              <div>
                <h3 className="font-semibold mb-3">GitHub Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-yellow-500 mb-2">
                        <Star className="h-5 w-5" />
                        <span className="text-sm font-medium">Stars</span>
                      </div>
                      <p className="text-2xl font-bold">{project.githubStars}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-blue-500 mb-2">
                        <GitFork className="h-5 w-5" />
                        <span className="text-sm font-medium">Forks</span>
                      </div>
                      <p className="text-2xl font-bold">{project.githubForks}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Team Members */}
          {isTeamProject && (
            <>
              <div>
                <h3 className="font-semibold mb-3">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {project.teammateNames.map((teammate) => (
                    <Badge key={teammate} variant="outline" className="text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      {teammate}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Project Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created
              </p>
              <p className="font-medium mt-1">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium mt-1">
                {new Date(project.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Card */}
      {project.developer && (
        <Card>
          <CardHeader>
            <CardTitle>Built By</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/developers/${project.developerId}`}>
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-lg">{project.developer.fullName}</p>
                    <TierBadge tier={project.developer.tier} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{project.developer.username}
                  </p>
                  {project.developer.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {project.developer.bio}
                    </p>
                  )}
                </div>
                <Button variant="outline">
                  View Profile
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
