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
        'border-line shadow-card flex items-start gap-4 rounded-md border bg-white p-6',
        className,
      )}
    >
      <AuthorAvatar name={frontmatter.name} photo={frontmatter.photo} size={56} />
      <div className="min-w-0">
        <p className="text-ink mt-1 font-semibold">{frontmatter.name}</p>
        <p className="text-ink-soft text-sm">{frontmatter.role}</p>
        <p className="text-ink-muted mt-2 text-sm leading-relaxed">{frontmatter.bio}</p>
        <Link
          href={`/auteurs/${frontmatter.slug}`}
          className="text-brand-700 mt-3 inline-block text-sm font-medium underline-offset-4 hover:underline"
        >
          Voir le profil de l’auteur →
        </Link>
      </div>
    </aside>
  );
}
