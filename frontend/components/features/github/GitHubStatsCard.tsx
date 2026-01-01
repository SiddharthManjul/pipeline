'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="bg-black/40 backdrop-blur-md border-primary/20">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>GitHub Statistics</CardTitle>
              <CardDescription>Unable to load GitHub stats</CardDescription>
            </div>
            <GitHubSyncButton />
          </div>
        </CardHeader>
      </Card>
    );
  }

  const statItems = [
    {
      label: 'Public Repos',
      value: stats.publicRepos || 0,
      icon: BookOpen,
      color: 'text-blue-500',
    },
    {
      label: 'Total Stars',
      value: stats.totalStars || 0,
      icon: Star,
      color: 'text-yellow-500',
    },
    {
      label: 'Total Forks',
      value: stats.totalForks || 0,
      icon: GitFork,
      color: 'text-green-500',
    },
    {
      label: 'Pull Requests',
      value: stats.pullRequests || 0,
      icon: GitPullRequest,
      color: 'text-purple-500',
    },
    {
      label: 'Total Commits',
      value: stats.totalCommits || 0,
      icon: GitCommit,
      color: 'text-orange-500',
    },
    {
      label: 'Followers',
      value: stats.followers || 0,
      icon: BookOpen,
      color: 'text-pink-500',
    },
  ];

  return (
    <Card className="bg-black/40 backdrop-blur-md border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>GitHub Statistics</CardTitle>
            <CardDescription>
              Contribution metrics from your GitHub profile
            </CardDescription>
          </div>
          <GitHubSyncButton />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all"
              >
                <Icon className={`h-5 w-5 ${item.color} mb-2`} />
                <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground text-center">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {stats.lastSyncedAt && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Last synced: {new Date(stats.lastSyncedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
