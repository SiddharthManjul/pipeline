'use client';

import { useAuth, useMyProfile, useMyReputationScore } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { ReputationScore, TierBadge } from '@/components/features/reputation';
import { GitHubSyncButton } from '@/components/features/github';
import { FolderGit2, Users, TrendingUp, Plus, User as UserIcon } from 'lucide-react';

export default function DashboardPage() {
  const { user, isDeveloper, isFounder } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: reputationScore, isLoading: reputationLoading } = useMyReputationScore();

  if (!user) return null;

  const developer = profile?.developer;
  const hasProfile = isDeveloper ? !!developer : !!profile?.founder;

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // If no profile, show onboarding
  if (!hasProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Web3 Talent Connect! 👋</h1>
          <p className="text-muted-foreground mt-2">
            Let's get you started by creating your profile
          </p>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              {isDeveloper && 'Create your developer profile to showcase your work and connect with founders'}
              {isFounder && 'Create your founder profile to post jobs and find talented developers'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {isDeveloper && (
                <>
                  <li>Add your GitHub profile and social links</li>
                  <li>Showcase your projects and contributions</li>
                  <li>Build your reputation score</li>
                  <li>Get discovered by Web3 founders</li>
                </>
              )}
              {isFounder && (
                <>
                  <li>Add your company information</li>
                  <li>Post job openings</li>
                  <li>Discover talented developers</li>
                  <li>Connect with verified talent</li>
                </>
              )}
            </ul>
            <Button size="lg" onClick={() => router.push('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              Create Profile Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Developer Dashboard
  if (isDeveloper && developer) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Welcome back, {developer.fullName}! 👋</h1>
            <TierBadge tier={developer.tier} size="lg" />
          </div>
          <p className="text-muted-foreground">
            Here's an overview of your developer profile
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Reputation Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1">
                <p className="text-3xl font-bold">{developer.reputationScore.toFixed(1)}</p>
                <p className="text-muted-foreground pb-1">/ 100</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4" />
                  Projects
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{developer.projects?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Vouches
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Tier Ranking
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {developer.tier.replace('TIER_', 'Tier ')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Reputation Score Card */}
          {!reputationLoading && reputationScore && (
            <ReputationScore
              score={reputationScore.totalScore}
              tier={reputationScore.tier}
            />
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your profile and improve your reputation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push('/profile')}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                View Full Profile
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push('/profile')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
              <div className="pt-2">
                <GitHubSyncButton variant="outline" size="default" showText />
              </div>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push('/developers')}
              >
                <Users className="mr-2 h-4 w-4" />
                Browse Developers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Tips */}
        {developer.reputationScore < 10 && (
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle>💡 Tips to Improve Your Reputation</CardTitle>
              <CardDescription>Complete these actions to increase your visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>Add at least 2-3 projects with live demos and GitHub repositories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>Sync your GitHub profile to showcase your contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>Complete your profile with bio, location, and social links</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>Submit hackathon wins and grant achievements for verification</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Founder Dashboard
  if (isFounder && profile?.founder) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile.founder.companyName}! 👋</h1>
          <p className="text-muted-foreground mt-2">
            Here's your company dashboard overview
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your profile and discover developers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push('/profile')}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                View Company Profile
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push('/developers')}
              >
                <Users className="mr-2 h-4 w-4" />
                Browse Developer Directory
              </Button>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Coming Soon:</p>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  disabled
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Job Opening
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>Available tools for hiring</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-medium">Browse Verified Developers</p>
                    <p className="text-muted-foreground">Access tier-ranked developer profiles with reputation scores</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-medium">View Developer Projects</p>
                    <p className="text-muted-foreground">See live demos and GitHub repositories</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 text-xl">⏳</span>
                  <div>
                    <p className="font-medium">Post Job Openings</p>
                    <p className="text-muted-foreground">Coming soon - AI-powered developer matching</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 text-xl">⏳</span>
                  <div>
                    <p className="font-medium">Schedule Sessions</p>
                    <p className="text-muted-foreground">Coming soon - Direct developer meetings</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Your profile summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{profile.founder.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Position</p>
                <p className="font-medium">{profile.founder.position}</p>
              </div>
              {profile.founder.companyWebsite && (
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={profile.founder.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {profile.founder.companyWebsite}
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{new Date(profile.founder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Tips */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader>
            <CardTitle>💡 Getting Started</CardTitle>
            <CardDescription>Make the most of the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Browse the developer directory to discover talented Web3 developers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Check developer reputation scores and tier rankings for quality assurance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Review developer projects to see their work in action</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Complete your company profile to increase credibility</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
