import { Badge } from '@/components/ui/badge';
import { DeveloperTier } from '@/types';
import { Crown, Award, Star, Rocket } from 'lucide-react';

interface TierBadgeProps {
  tier: DeveloperTier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
}

const tierConfig = {
  TIER_1: {
    label: 'Elite',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    icon: Crown,
    description: 'Top 1% - 76-100 reputation',
  },
  TIER_2: {
    label: 'Advanced',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    icon: Award,
    description: 'Top 10% - 51-75 reputation',
  },
  TIER_3: {
    label: 'Intermediate',
    color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    icon: Star,
    description: 'Growing - 26-50 reputation',
  },
  TIER_4: {
    label: 'Entry',
    color: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
    icon: Rocket,
    description: 'Starting - 0-25 reputation',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function TierBadge({
  tier,
  size = 'md',
  showIcon = true,
  showLabel = true
}: TierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.color} ${sizeClasses[size]} font-semibold border-0 gap-1.5`}
      title={config.description}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {showLabel && config.label}
    </Badge>
  );
}
