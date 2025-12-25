'use client';

import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { RefreshCw } from 'lucide-react';
import { useSyncGitHub } from '@/lib/hooks';

interface GitHubSyncButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export function GitHubSyncButton({
  variant = 'outline',
  size = 'default',
  showText = true
}: GitHubSyncButtonProps) {
  const syncGitHub = useSyncGitHub();

  const handleSync = async () => {
    await syncGitHub.mutateAsync();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSync}
      disabled={syncGitHub.isPending}
    >
      <RefreshCw
        className={`h-4 w-4 ${syncGitHub.isPending ? 'animate-spin' : ''} ${showText ? 'mr-2' : ''}`}
      />
      {showText && (syncGitHub.isPending ? 'Syncing...' : 'Sync GitHub')}
    </Button>
  );
}
