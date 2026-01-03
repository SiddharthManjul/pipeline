'use client';

import type { Founder } from '@/lib/api/founders';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  ExternalLink,
  Linkedin,
  Calendar,
  User,
  Briefcase,
} from 'lucide-react';

interface FounderPublicProfileViewProps {
  founder: Founder;
}

export function FounderPublicProfileView({ founder }: FounderPublicProfileViewProps) {
  return (
    <div className="space-y-8">
      {/* Header Card */}
      <FuturisticCard className="border-primary/20" hoverEffect={false}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-6">
            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <Building2 className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-500">
                    {founder.companyName}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{founder.position}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {founder.bio && (
                <p className="text-base text-white/90 leading-relaxed mt-4">
                  {founder.bio}
                </p>
              )}
            </div>

            {/* Founder Badge */}
            <Badge
              variant="outline"
              className="border-blue-500/50 text-blue-400 bg-blue-500/5 px-4 py-2 text-sm font-bold uppercase tracking-wider"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Founder
            </Badge>
          </div>
        </div>
      </FuturisticCard>

      {/* Company Details Card */}
      <FuturisticCard className="border-primary/20" hoverEffect={false}>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-6">Company Information</h3>

          <div className="space-y-6">
            {/* Website */}
            {founder.companyWebsite && (
              <>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                    Website
                  </h4>
                  <a
                    href={founder.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors group"
                  >
                    <ExternalLink className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-lg">{founder.companyWebsite.replace(/^https?:\/\//, '')}</span>
                  </a>
                </div>
                <Separator className="bg-white/10" />
              </>
            )}

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex flex-wrap gap-4">
                {founder.linkedinUrl ? (
                  <a
                    href={founder.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No social links added</p>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Member Since */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                Member Since
              </h4>
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="h-5 w-5 text-orange-400" />
                <span className="text-lg">
                  {new Date(founder.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FuturisticCard>

      {/* Platform Activities (Placeholder for future features) */}
      <FuturisticCard className="border-primary/20" hoverEffect={false}>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">Platform Activity</h3>
          <p className="text-muted-foreground mb-6">Job postings and hiring activity</p>

          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Job postings and developer interactions will appear here
            </p>
          </div>
        </div>
      </FuturisticCard>
    </div>
  );
}
