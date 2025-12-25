import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { ExternalLink, Github, Star, GitFork, Users, CheckCircle } from 'lucide-react';
import type { Project } from '@/types';
import Link from 'next/link';

interface PublicProjectCardProps {
  project: Project;
  showDeveloper?: boolean;
}

export function PublicProjectCard({ project, showDeveloper = true }: PublicProjectCardProps) {
  const isTeamProject = project.teammateNames && project.teammateNames.length > 0;

  return (
    <Card className="hover:shadow-lg transition-all hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              {project.isVerified && (
                <Badge variant="outline" className="border-green-500 text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {isTeamProject && (
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  Team Project
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        {/* GitHub Stats */}
        {(project.githubStars > 0 || project.githubForks > 0) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {project.githubStars > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {project.githubStars}
              </div>
            )}
            {project.githubForks > 0 && (
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                {project.githubForks}
              </div>
            )}
          </div>
        )}

        {/* Team Members */}
        {isTeamProject && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Team:</span> {project.teammateNames.join(', ')}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href={project.livePlatformUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </Button>
          </a>
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              Repository
            </Button>
          </a>
          <Link href={`/projects/${project.id}`}>
            <Button variant="default" size="sm">
              View Details
            </Button>
          </Link>
        </div>

        {/* Developer Info */}
        {showDeveloper && project.developer && (
          <div className="pt-2 border-t">
            <Link
              href={`/developers/${project.developerId}`}
              className="text-sm text-primary hover:underline flex items-center gap-2"
            >
              Built by <span className="font-medium">{project.developer.fullName}</span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
