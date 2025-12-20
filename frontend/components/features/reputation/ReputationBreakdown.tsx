'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Github, FolderGit2, Clock, Trophy, Users } from 'lucide-react';
import type { ReputationBreakdown as ReputationBreakdownType } from '@/types';

interface ReputationBreakdownProps {
  breakdown: ReputationBreakdownType;
}

const categoryConfig = {
  github: {
    label: 'GitHub Profile',
    icon: Github,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    description: 'Repos, stars, commits, PRs',
    maxScore: 30,
  },
  projects: {
    label: 'Projects',
    icon: FolderGit2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    description: 'Completed projects, complexity',
    maxScore: 25,
  },
  time: {
    label: 'Time Investment',
    icon: Clock,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    description: 'Consistency, activity',
    maxScore: 15,
  },
  hackathons: {
    label: 'Hackathons & Grants',
    icon: Trophy,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    description: 'Wins, placements, grants',
    maxScore: 20,
  },
  community: {
    label: 'Community',
    icon: Users,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    description: 'Vouches, sessions',
    maxScore: 10,
  },
};

export function ReputationBreakdown({ breakdown }: ReputationBreakdownProps) {
  const categories = [
    { key: 'github' as const, score: breakdown.githubScore },
    { key: 'projects' as const, score: breakdown.projectsScore },
    { key: 'time' as const, score: breakdown.timeScore },
    { key: 'hackathons' as const, score: breakdown.hackathonsScore },
    { key: 'community' as const, score: breakdown.communityScore },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reputation Breakdown</CardTitle>
        <CardDescription>
          How your reputation score is calculated across different categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map(({ key, score }) => {
          const config = categoryConfig[key];
          const Icon = config.icon;
          const percentage = (score / config.maxScore) * 100;

          return (
            <div key={key} className="space-y-2">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <div>
                    <p className="font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{score.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">
                    / {config.maxScore}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {percentage.toFixed(0)}%
                </p>
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Total Reputation Score</p>
            <p className="text-2xl font-bold">{breakdown.totalScore.toFixed(1)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
