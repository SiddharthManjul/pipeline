'use client';

import { use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { useFounder } from '@/lib/hooks';
import { Background3D } from '@/components/landing/Background3D';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FounderPublicProfileView } from '@/components/features/founder/FounderPublicProfileView';

export default function FounderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: founder, isLoading, error } = useFounder(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !founder) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {(error as Error)?.message || 'Founder not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <Background3D />

      {/* Back Button */}
      <div className="relative z-10">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>

      {/* Founder Profile */}
      <div className="relative z-10">
        <FounderPublicProfileView founder={founder} />
      </div>
    </div>
  );
}
