import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Building2, ExternalLink, Linkedin, Globe } from 'lucide-react';
import type { Founder } from '@/lib/api/founders';
import Link from 'next/link';
import { FuturisticCard } from '@/components/ui/futuristic-card';

interface FounderCardProps {
  founder: Founder;
  index?: number;
}

export function FounderCard({ founder, index = 0 }: FounderCardProps) {
  return (
    <FuturisticCard
      className="border-primary/20 hover:border-orange-500/50 transition-all duration-300 group"
      chamferSize={20}
    >
      <div className="p-6 h-full flex flex-col">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-orange-400 group-hover:to-orange-500 transition-all duration-300 line-clamp-1">
                {founder.fullName}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/90 font-semibold flex items-center gap-2">
                <span>{founder.position}</span>
                <span className="text-muted-foreground/50">at</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {founder.companyName}
                </span>
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className="border-blue-500/50 text-blue-400 bg-blue-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            >
              Founder
            </Badge>
          </div>
        </CardHeader>

        <div className="space-y-6 mt-2 flex-1">
          {/* Bio */}
          {founder.bio && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-3 italic">
              &quot;{founder.bio}&quot;
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {founder.companyWebsite && (
              <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                <Globe className="h-4 w-4 text-orange-500" />
                <span>Website</span>
              </div>
            )}
            {founder.linkedinUrl && (
              <div className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                <Linkedin className="h-4 w-4 text-blue-500" />
                <span>LinkedIn</span>
              </div>
            )}
          </div>

          {/* Member Since */}
          <div className="pt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Member Since {new Date(founder.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/5 mt-auto">
            <Link href={`/founders/${founder.id}`} className="w-full">
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
