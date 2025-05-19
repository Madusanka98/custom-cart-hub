
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  className?: string;
  size?: number;
}

export function Rating({ value, className, size = 16 }: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="text-yellow-500 fill-yellow-500" />
      ))}
      
      {hasHalfStar && (
        <div className="relative">
          <Star size={size} className="text-yellow-500 fill-yellow-500" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
          <Star size={size} className="text-yellow-500 absolute top-0 left-0" />
        </div>
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-yellow-500" />
      ))}
    </div>
  );
}
