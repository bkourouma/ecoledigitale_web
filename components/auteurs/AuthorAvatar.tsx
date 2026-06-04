import Image from 'next/image';
import { cn } from '@/lib/ui/cn';

interface AuthorAvatarProps {
  name: string;
  /** Chemin de photo (commençant par /). Si absent, fallback en initiales. */
  photo?: string;
  /** Côté du carré/cercle en pixels. */
  size?: number;
  className?: string;
}

/** Initiales (jusqu'à 2 lettres) à partir du nom. */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Avatar d'auteur : photo si fournie, sinon pastille d'initiales.
 * Partagé par AuthorBio et AuthorCard.
 */
export function AuthorAvatar({ name, photo, size = 64, className }: AuthorAvatarProps) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        className={cn('shrink-0 rounded-full object-cover', className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-800',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials(name)}
    </span>
  );
}
