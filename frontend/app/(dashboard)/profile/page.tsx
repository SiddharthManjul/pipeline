/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useAuth } from '@/lib/hooks';
import { useMyProfile } from '@/lib/hooks/useProfile';
import { Loader2 } from 'lucide-react';
import { DeveloperProfileForm } from '@/components/features/profile/DeveloperProfileForm';
import { DeveloperProfileView } from '@/components/features/profile/DeveloperProfileView';
import { FounderProfileForm } from '@/components/features/profile/FounderProfileForm';
import { FounderProfileView } from '@/components/features/profile/FounderProfileView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const { user, isDeveloper, isFounder } = useAuth();
  const { data: profile, isLoading, error } = useMyProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
            <CardDescription>
              There was an error loading your profile. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if profile exists
  const hasProfile = isDeveloper ? !!profile?.developer : !!profile?.founder;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {!hasProfile ? (
        // Show profile creation form
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-muted-foreground mt-2">
              {isDeveloper && 'Create your developer profile to start showcasing your work'}
              {isFounder && 'Create your founder profile to start hiring developers'}
            </p>
          </div>

          {isDeveloper && <DeveloperProfileForm />}
          {isFounder && <FounderProfileForm />}
        </div>
      ) : (
        // Show profile view
        <div className="space-y-6">
          {isDeveloper && profile?.developer && (
            <DeveloperProfileView developer={profile.developer} />
          )}
          {isFounder && profile?.founder && (
            <FounderProfileView founder={profile.founder} />
          )}
        </div>
      )}
    </div>
  );
}
