'use client';

import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { RefreshCw } from 'lucide-react';
import { useSyncGitHub } from '@/lib/hooks';
import { cn } from '@/lib/utils';

interface GitHubSyncButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export function GitHubSyncButton({
  variant = 'outline',
  size = 'default',
  showText = true,
  className
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
      className={cn(
        "backdrop-blur-sm transition-all duration-300",
        variant === 'outline' && "bg-background/40 hover:bg-orange-500/10",
        syncGitHub.isPending && "opacity-70",
        className
      )}
    >
      <RefreshCw
        className={`h-4 w-4 ${syncGitHub.isPending ? 'animate-spin' : ''} ${showText ? 'mr-2' : ''} ${syncGitHub.isPending ? 'text-orange-500' : ''}`}
      />
      {showText && (
        <span className={syncGitHub.isPending ? "text-orange-400 font-medium" : ""}>
          {syncGitHub.isPending ? 'Syncing...' : 'Sync GitHub'}
        </span>
      )}
    </Button>
  );
}
