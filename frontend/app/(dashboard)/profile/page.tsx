'use client';

import { useAuth } from '@/lib/hooks';
import { DeveloperProfileForm } from '@/components/features/profile/DeveloperProfileForm';
import { FounderProfileForm } from '@/components/features/profile/FounderProfileForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Background3D } from '@/components/landing/Background3D';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isDeveloper, isFounder, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 relative">
      <Background3D />
      <div className="relative z-10">
        {isDeveloper && <DeveloperProfileForm />}
        {isFounder && <FounderProfileForm />}
      </div>
    </div>
  );
}
