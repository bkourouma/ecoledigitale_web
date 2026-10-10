import Link from 'next/link';
import { cn } from '@/lib/ui/cn';
import { getAllResources } from '@/lib/content/resources';
import { RESOURCE_TYPE_LABELS, type ResourceType } from '@/lib/content/resource.schema';

interface RelatedRef {
  type: ResourceType;
  slug: string;
}

interface RelatedResourcesProps {
  refs: readonly RelatedRef[];
  /** Titre de section — "Ressources liées" par défaut, "Voir aussi" pour le glossaire. */
  heading?: string;
  className?: string;
}

/**
 * Section "Ressources liées" : résout les références du frontmatter contre le
 * catalogue publié. Les références vers une ressource draft/deprecated/inconnue
 * sont silencieusement omises (cohérent avec la règle souple de validation).
 * Ne rend rien si aucune référence n'est résolue.
 */
export function RelatedResources({
  refs,
  heading = 'Ressources liées',
  className,
}: RelatedResourcesProps) {
  if (refs.length === 0) return null;

  const published = getAllResources();
  const resolved = refs
    .map((ref) =>
      published.find((b) => b.frontmatter.type === ref.type && b.frontmatter.slug === ref.slug),
    )
    .filter((b): b is NonNullable<typeof b> => b !== undefined);

  if (resolved.length === 0) return null;

  return (
    <section className={cn('max-w-3xl', className)}>
      <h2 className="font-display text-primary-800 text-4xl leading-none font-bold">{heading}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {resolved.map((b) => (
          <li key={`${b.frontmatter.type}/${b.frontmatter.slug}`}>
            <Link
              href={`/ressources/${b.frontmatter.type}/${b.frontmatter.slug}`}
              className="border-line shadow-card hover:border-brand-300 block h-full rounded-md border bg-white p-5 transition-colors"
            >
              <span className="red-note text-xl">
                {RESOURCE_TYPE_LABELS[b.frontmatter.type].singular}
              </span>
              <span className="text-ink mt-2 block font-semibold">{b.frontmatter.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
