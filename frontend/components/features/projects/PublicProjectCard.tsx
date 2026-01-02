import { ExternalLink, Github, Star, GitFork, Users, CheckCircle } from 'lucide-react';
import type { Project } from '@/types';
import Link from 'next/link';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { Badge } from '@/components/ui/badge';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';

interface PublicProjectCardProps {
  project: Project;
  showDeveloper?: boolean;
  index?: number;
}

export function PublicProjectCard({ project, showDeveloper = true, index = 0 }: PublicProjectCardProps) {
  const isTeamProject = project.teammateNames && project.teammateNames.length > 0;

  return (
    <FuturisticCard 
      className="border-primary/20 hover:border-orange-500/50 transition-all duration-300 group"
      chamferSize={20}
    >
      <div className="p-6 h-full flex flex-col">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-orange-400 group-hover:to-orange-500 transition-all duration-300 line-clamp-1">
                  {project.name}
                </CardTitle>
                {project.isVerified && (
                  <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/5 px-2 py-0 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2 text-sm text-muted-foreground/90 leading-relaxed">
                {project.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-6 mt-2 flex-1">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge 
                key={tech} 
                variant="secondary" 
                className="bg-white/5 border-white/10 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-white/10 transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="bg-white/5 border-white/10 text-xs font-medium px-2.5 py-0.5 rounded-full">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>

          {/* Stats & Info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {project.githubStars > 0 && (
              <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{project.githubStars}</span>
              </div>
            )}
            {project.githubForks > 0 && (
              <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                <GitFork className="h-4 w-4 text-green-500" />
                <span>{project.githubForks}</span>
              </div>
            )}
            {isTeamProject && (
              <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{project.teammateNames.length + 1} MEMBERS</span>
              </div>
            )}
          </div>

          {/* Links & CTA */}
          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
              <a
                href={project.livePlatformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-all group/link"
              >
                <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                <span>Live Demo</span>
              </a>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-all group/link"
              >
                <Github className="h-4 w-4 group-hover/link:scale-110 transition-transform" />
                <span>Repository</span>
              </a>
            </div>
            
            <Link href={`/projects/${project.id}`} className="w-full">
              <Button variant="default" className="w-full font-bold uppercase tracking-widest text-xs h-10">
                View Details
              </Button>
            </Link>
          </div>

          {/* Developer Info */}
          {showDeveloper && project.developer && (
            <div className="pt-2 border-t border-white/5">
              <Link
                href={`/developers/${project.developerId}`}
                className="text-xs text-muted-foreground hover:text-orange-400 flex items-center gap-2 transition-colors uppercase tracking-widest font-bold"
              >
                <span>Built by</span>
                <span className="text-white">{project.developer.fullName}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Background Index Number */}
      <div className="absolute -bottom-4 -right-2 p-4 opacity-[0.03] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.07] pointer-events-none select-none">
        <span className="text-[12rem] font-black leading-none text-white italic">
          {index + 1}
        </span>
      </div>
    </FuturisticCard>
  );
}
