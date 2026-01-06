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
  variant = 'outline',
  size = 'default',
  showLabel = true
}: VouchButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isDeveloper } = useAuth();
  const { data: eligibility, isLoading } = useVouchEligibility(developer.id);

  // Don't show button if user is not a developer or if vouching themselves
  const currentDeveloperId = user && 'developer' in user ? (user as any).developer?.id : null;
  if (!isDeveloper || currentDeveloperId === developer.id) {
    return null;
  }

  const isEligible = eligibility?.isEligible ?? false;
  const reasons = eligibility?.reasonsNotEligible ?? [];

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={() => setDialogOpen(true)}
      disabled={isLoading || !isEligible}
      borderColor="rgba(255, 0, 0, 1)"
      className="gap-2"
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
            <TooltipContent className="max-w-xs">
              <p className="font-semibold mb-1">Cannot vouch:</p>
              <ul className="list-disc list-inside text-sm">
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
