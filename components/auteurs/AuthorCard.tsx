import Link from 'next/link';
import { cn } from '@/lib/ui/cn';
import { AuthorAvatar } from '@/components/auteurs/AuthorAvatar';
import type { AuthorBundle } from '@/lib/content/authors';

interface AuthorCardProps {
  author: AuthorBundle;
  className?: string;
}

/**
 * Encadré « À propos de l'auteur » — affiché en pied des pages ressources
 * pour renforcer le signal E-E-A-T. Lien vers la page auteur complète.
 */
export function AuthorCard({ author, className }: AuthorCardProps) {
  const { frontmatter } = author;

  return (
    <aside
      className={cn(
        'flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card',
        className,
      )}
    >
      <AuthorAvatar name={frontmatter.name} photo={frontmatter.photo} size={56} />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          À propos de l’auteur
        </p>
        <p className="mt-1 font-semibold text-ink">{frontmatter.name}</p>
        <p className="text-sm text-ink-soft">{frontmatter.role}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{frontmatter.bio}</p>
        <Link
          href={`/auteurs/${frontmatter.slug}`}
          className="mt-3 inline-block text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
        >
          Voir le profil de l’auteur →
        </Link>
      </div>
    </aside>
  );
}
