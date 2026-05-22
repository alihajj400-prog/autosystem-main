import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
  imageClassName?: string;
}

export function BrandLogo({
  variant = 'dark',
  showTagline = true,
  className,
  imageClassName,
}: BrandLogoProps) {
  const isLight = variant === 'light';

  return (
    <Link to="/" className={cn('group flex items-center gap-3', className)}>
      <img
        src="/logo.png"
        alt="Auto System S.A.L."
        className={cn(
          'h-11 w-11 object-contain transition-transform group-hover:scale-[1.02] sm:h-12 sm:w-12',
          isLight && 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]',
          imageClassName
        )}
      />
      {showTagline && (
        <div className="hidden leading-tight sm:block">
          <span
            className={cn(
              'block font-display text-lg font-semibold tracking-tight',
              isLight ? 'text-white' : 'text-foreground'
            )}
          >
            <span className={isLight ? 'text-primary' : 'text-primary'}>Auto</span> System
          </span>
          <span
            className={cn(
              'text-[11px] font-medium uppercase tracking-[0.2em]',
              isLight ? 'text-white/75' : 'text-muted-foreground'
            )}
          >
            Mazda · Lebanon
          </span>
        </div>
      )}
    </Link>
  );
}
