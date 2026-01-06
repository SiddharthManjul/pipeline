'use client';

import { Award, User, Calendar, MessageSquare } from 'lucide-react';
import { useDeveloperVouches } from '@/lib/hooks';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '../reputation/TierBadge';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface VouchListProps {
  developerId: string;
}

export function VouchList({ developerId }: VouchListProps) {
  const { data: vouches, isLoading } = useDeveloperVouches(developerId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  // Ensure vouches is an array
  const vouchesArray = Array.isArray(vouches) ? vouches : [];

  if (vouchesArray.length === 0) {
    return (
      <FuturisticCard className="p-8 text-center">
        <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No vouches yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Be the first to vouch for this developer!
        </p>
      </FuturisticCard>
    );
  }

  const activeVouches = vouchesArray.filter(v => v.isActive);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Vouches ({activeVouches.length})
        </h3>
      </div>

      {activeVouches.map((vouch) => (
        <FuturisticCard key={vouch.id} className="p-6 hover:border-orange-500/50 transition-colors">
          <div className="space-y-4">
            {/* Header: Voucher Info */}
            <div className="flex items-start justify-between">
              <Link
                href={`/developers/${vouch.voucher.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white">{vouch.voucher.fullName}</p>
                  <p className="text-sm text-muted-foreground">@{vouch.voucher.username}</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <TierBadge tier={vouch.voucherTier as any} />
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Weight: {vouch.weight}x
                </Badge>
              </div>
            </div>

            {/* Skills Endorsed */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills Endorsed:
              </p>
              <div className="flex flex-wrap gap-2">
                {vouch.skillsEndorsed.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-orange-500/10 border-orange-500/30 text-orange-400"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Message */}
            {vouch.message && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message:
                </p>
                <p className="text-sm text-white/80 bg-black/20 p-3 rounded-md border border-white/5">
                  "{vouch.message}"
                </p>
              </div>
            )}

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Vouched {formatDistanceToNow(new Date(vouch.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </FuturisticCard>
      ))}
    </div>
  );
}
