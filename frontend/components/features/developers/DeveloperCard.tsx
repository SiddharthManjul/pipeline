import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { TierBadge } from '@/components/features/reputation';
import { MapPin, Star, FolderGit2, ExternalLink, CheckCircle } from 'lucide-react';
import type { Developer } from '@/types';
import Link from 'next/link';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { cn } from '@/lib/utils';

interface DeveloperCardProps {
  developer: Developer;
  index?: number;
}

export function DeveloperCard({ developer, index = 0 }: DeveloperCardProps) {
  const availabilityColors = {
    AVAILABLE: 'border-green-500/50 text-green-500 bg-green-500/5',
    BUSY: 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5',
    NOT_LOOKING: 'border-gray-500/50 text-muted-foreground bg-white/5',
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
                  {developer.fullName}
                </CardTitle>
                <TierBadge tier={developer.tier} size="sm" />
                <Badge variant="outline" className={cn("px-2 py-0 text-[10px] font-bold uppercase tracking-wider", availabilityColors[developer.availability])}>
                  {availabilityLabels[developer.availability]}
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground/90 font-bold uppercase tracking-widest">
                @{developer.username}
              </CardDescription>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-orange-500 bg-orange-500/5 border border-orange-500/20 px-3 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-orange-500" />
                <span className="font-black italic text-lg tracking-tighter">{developer.reputationScore.toFixed(0)}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60 mr-1">Reputation</span>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-6 mt-2 flex-1">
          {/* Bio */}
          {developer.bio && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 italic">
              &quot;{developer.bio}&quot;
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {developer.location && (
              <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>{developer.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
              <FolderGit2 className="h-4 w-4 text-blue-500" />
              <span>{developer.projects?.length || 0} PROJECTS</span>
            </div>
          </div>

          {/* Technologies */}
          {allTechnologies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {allTechnologies.map((tech) => (
                <Badge 
                  key={tech} 
                  variant="secondary" 
                  className="bg-white/5 border-white/10 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full hover:bg-white/10 transition-colors tracking-tight"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-white/5 mt-auto">
            <Link href={`/developers/${developer.id}`} className="w-full">
              <Button variant="default" className="w-full font-bold uppercase tracking-widest text-xs h-10">
                View Profile
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
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
