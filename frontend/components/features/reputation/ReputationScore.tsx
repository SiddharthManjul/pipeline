import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TierBadge } from './TierBadge';
import { DeveloperTier } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ReputationScoreProps {
  score: number;
  tier: DeveloperTier;
  previousScore?: number;
  compact?: boolean;
}

export function ReputationScore({
  score,
  tier,
  previousScore,
  compact = false
}: ReputationScoreProps) {
  const getTrendIcon = () => {
    if (!previousScore) return null;
    if (score > previousScore) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (score < previousScore) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendText = () => {
    if (!previousScore) return null;
    const diff = score - previousScore;
    if (diff === 0) return 'No change';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)} from last calculation`;
  };

  const getProgressColor = () => {
    if (score >= 76) return 'bg-purple-500';
    if (score >= 51) return 'bg-blue-500';
    if (score >= 26) return 'bg-green-500';
    return 'bg-gray-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{score.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">Reputation</span>
        </div>
        <TierBadge tier={tier} size="md" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Reputation Score</CardTitle>
            <CardDescription>Your overall platform ranking</CardDescription>
          </div>
          <TierBadge tier={tier} size="lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold">{score.toFixed(1)}</span>
          <span className="text-2xl text-muted-foreground pb-1">/ 100</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* Trend */}
        {previousScore !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            {getTrendIcon()}
            <span className="text-muted-foreground">{getTrendText()}</span>
          </div>
        )}

        {/* Tier Info */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {score >= 76 && "You're in the Elite tier - top 1% of developers!"}
            {score >= 51 && score < 76 && "You're in the Advanced tier - top 10% of developers!"}
            {score >= 26 && score < 51 && "You're in the Intermediate tier - keep building!"}
            {score < 26 && "Welcome! Complete projects to increase your reputation."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
