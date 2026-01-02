'use client';

import { use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
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
  Clock,
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Background3D } from '@/components/landing/Background3D';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="space-y-8 relative">
        <Background3D />
        <div className="relative z-10">
          <Skeleton className="h-10 w-48 bg-white/5 mb-8" />
          <Skeleton className="h-[600px] w-full rounded-3xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6 relative">
        <Background3D />
        <div className="relative z-10">
          <Button
            variant="outline"
            className="backdrop-blur-sm bg-background/50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Alert variant="destructive" className="mt-6 bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(error as Error)?.message || 'Project not found'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const isTeamProject = project.teammateNames && project.teammateNames.length > 0;

  return (
    <div className="space-y-8 relative">
      <Background3D />

      {/* Back Button */}
      <div className="relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="hover:bg-white/10 text-muted-foreground hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to Projects
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 relative z-10">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <FuturisticCard className="border-primary/20" hoverEffect={false}>
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-4">
                      <h1 className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-white to-orange-500 uppercase italic tracking-tighter">
                        {project.name}
                      </h1>
                      {project.isVerified && (
                        <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {isTeamProject && (
                        <Badge variant="secondary" className="bg-blue-500/10 border-blue-500/20 text-blue-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                          <Users className="h-3 w-3 mr-1" />
                          Team Project
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href={project.livePlatformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="default"
                      className="gap-2 h-11 px-6 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Button>
                  </a>
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="gap-2 h-11 px-6 backdrop-blur-sm bg-background/40 hover:bg-orange-500/10 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <Github className="h-4 w-4" />
                      Repository
                    </Button>
                  </a>
                </div>
              </div>

              <div className="my-10 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

              {/* Technologies */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-4 w-4 text-orange-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Technologies & Stack</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="bg-white/5 border-white/10 text-xs font-medium px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Github Deep Stats */}
              {(project.githubStars > 0 || project.githubForks > 0) && (
                <div className="mt-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Github className="h-4 w-4 text-orange-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">GitHub Statistics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <FuturisticCard className="border-white/5 bg-white/5" hoverEffect={false}>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-yellow-500/80 mb-3 uppercase tracking-widest text-[10px] font-black">
                          <Star className="h-4 w-4" />
                          <span>Stars</span>
                        </div>
                        <p className="text-4xl font-black italic tracking-tighter">{project.githubStars}</p>
                      </div>
                    </FuturisticCard>
                    <FuturisticCard className="border-white/5 bg-white/5" hoverEffect={false}>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-blue-500/80 mb-3 uppercase tracking-widest text-[10px] font-black">
                          <GitFork className="h-4 w-4" />
                          <span>Forks</span>
                        </div>
                        <p className="text-4xl font-black italic tracking-tighter">{project.githubForks}</p>
                      </div>
                    </FuturisticCard>
                  </div>
                </div>
              )}
            </div>
          </FuturisticCard>
        </div>

        {/* Right Column: Metadata & Developer */}
        <div className="space-y-8">
          {/* Metadata Card */}
          <FuturisticCard className="border-primary/20" hoverEffect={false}>
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-orange-500" />
                      Created
                    </p>
                    <p className="text-sm font-bold text-white">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 justify-end">
                      <Clock className="h-3 w-3 text-orange-500" />
                      Updated
                    </p>
                    <p className="text-sm font-bold text-white">
                      {new Date(project.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {isTeamProject && (
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Team Composition</p>
                    <div className="space-y-2">
                      {project.teammateNames.map((teammate) => (
                        <div key={teammate} className="flex items-center gap-2 text-sm text-muted-foreground/80 font-medium bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                          <Users className="h-3 w-3 text-orange-400" />
                          {teammate}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FuturisticCard>

          {/* Developer Card */}
          {project.developer && (
            <FuturisticCard className="border-orange-500/20" hoverEffect={false}>
              <div className="p-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                  <span className="w-4 h-px bg-orange-500/50" />
                  Primary Developer
                </h3>
                <Link href={`/developers/${project.developerId}`}>
                  <div className="space-y-4 group/dev cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xl italic group-hover/dev:bg-orange-500/20 transition-colors">
                        {project.developer.fullName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black italic tracking-tighter text-lg leading-none group-hover/dev:text-orange-400 transition-colors">
                            {project.developer.fullName}
                          </p>
                          <TierBadge tier={project.developer.tier} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">
                          @{project.developer.username}
                        </p>
                      </div>
                    </div>
                    {project.developer.bio && (
                      <p className="text-xs text-muted-foreground/70 leading-relaxed italic line-clamp-3">
                        &quot;{project.developer.bio}&quot;
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="w-full text-[10px] font-black uppercase tracking-widest h-9 border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5"
                    >
                      Browse Profile
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </Link>
              </div>
            </FuturisticCard>
          )}
        </div>
      </div>
    </div>
  );
}
