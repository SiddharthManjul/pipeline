'use client';

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticCard } from '@/components/ui/futuristic-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, GitFork, GitPullRequest, GitCommit, BookOpen } from 'lucide-react';
import { useGitHubStats } from '@/lib/hooks';
import { GitHubSyncButton } from './GitHubSyncButton';

interface GitHubStatsCardProps {
  username: string;
}

export function GitHubStatsCard({ username }: GitHubStatsCardProps) {
  const { data: stats, isLoading } = useGitHubStats(username);

  if (isLoading) {
    return (
      <FuturisticCard className="border-primary/20" hoverEffect={false}>
        <div className="p-6">
          <CardHeader className="px-0 pt-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </FuturisticCard>
    );
  }

  if (!stats) {
    return (
      <FuturisticCard className="border-primary/20" hoverEffect={false}>
        <div className="p-6">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">GitHub Statistics</CardTitle>
                <CardDescription>Unable to load GitHub stats</CardDescription>
              </div>
              <GitHubSyncButton />
            </div>
          </CardHeader>
        </div>
      </FuturisticCard>
    );
  }

  const statItems = [
    {
      label: 'Public Repos',
      value: stats.publicRepos || 0,
      icon: BookOpen,
      color: 'text-blue-400',
    },
    {
      label: 'Total Stars',
      value: stats.totalStars || 0,
      icon: Star,
      color: 'text-yellow-400',
    },
    {
      label: 'Total Forks',
      value: stats.totalForks || 0,
      icon: GitFork,
      color: 'text-green-400',
    },
    {
      label: 'Pull Requests',
      value: stats.pullRequests || 0,
      icon: GitPullRequest,
      color: 'text-purple-400',
    },
    {
      label: 'Total Commits',
      value: stats.totalCommits || 0,
      icon: GitCommit,
      color: 'text-orange-400',
    },
    {
      label: 'Followers',
      value: stats.followers || 0,
      icon: BookOpen,
      color: 'text-pink-400',
    },
  ];

  return (
    <FuturisticCard className="border-primary/20">
      <div className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">GitHub Statistics</CardTitle>
              <CardDescription className="text-base mt-1">
                Contribution metrics from your GitHub profile
              </CardDescription>
            </div>
            <GitHubSyncButton />
          </div>
        </CardHeader>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-white/5 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{item.value.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {stats.lastSyncedAt && (
          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-muted-foreground bg-white/5 py-2 rounded-full border border-white/5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Last synced: {new Date(stats.lastSyncedAt).toLocaleString()}
          </div>
        )}
      </div>
    </FuturisticCard>
  );
}
