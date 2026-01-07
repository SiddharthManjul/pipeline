'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { VouchDialog } from './VouchDialog';
import { useVouchEligibility, useAuth } from '@/lib/hooks';
import type { Developer } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VouchButtonProps {
  developer: Developer;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function VouchButton({
  developer,
  variant = 'default',
  size = 'default',
  showLabel = true
}: VouchButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isDeveloper, isFounder } = useAuth();
  const { data: eligibility, isLoading } = useVouchEligibility(developer.id);

  // Don't show button if user is neither developer nor founder
  // Also don't show if developer is trying to vouch for themselves
  const currentDeveloperId = user && 'developer' in user ? (user as any).developer?.id : null;

  if (!isDeveloper && !isFounder) {
    return null;
  }

  // Don't let developers vouch for themselves
  if (isDeveloper && currentDeveloperId === developer.id) {
    return null;
  }

  const isEligible = eligibility?.isEligible ?? true; // Default to true if loading
  const reasons = eligibility?.reasonsNotEligible ?? [];

  const handleClick = () => {
    setDialogOpen(true);
  };

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      borderColor="rgba(249, 115, 22, 1)"
      className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all hover:scale-105"
    >
      <Award className="h-4 w-4" />
      {showLabel && 'Vouch'}
    </Button>
  );

  if (!isEligible && reasons.length > 0) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-black/95 border border-orange-500/20">
              <p className="font-semibold mb-1 text-orange-400">Cannot vouch:</p>
              <ul className="list-disc list-inside text-sm text-white/80">
                {reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <VouchDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          developer={developer}
        />
      </>
    );
  }

  return (
    <>
      {buttonContent}
      <VouchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        developer={developer}
      />
    </>
  );
}
