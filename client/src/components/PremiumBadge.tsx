import { Crown } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({ className, size = 'sm' }: PremiumBadgeProps) {
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

  return (
    <Badge
      className={cn(
        'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md',
        sizeClasses[size],
        className
      )}
    >
      <Crown className={cn('mr-1', iconSizes[size])} />
      Premium
    </Badge>
  );
}
