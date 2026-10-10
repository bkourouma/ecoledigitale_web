import Link from 'next/link';
import { formatFrenchDate } from '@/lib/ui/format-date';
import { RESOURCE_TYPE_LABELS, RESOURCE_PERSONA_LABELS } from '@/lib/content/resource.schema';
import type { ResourceBundle } from '@/lib/content/resources';

interface ResourceCardProps {
  bundle: ResourceBundle;
}

export function ResourceCard({ bundle }: ResourceCardProps) {
  const { frontmatter, readingTime } = bundle;

  return (
    <li>
      <Link
        href={`/ressources/${frontmatter.type}/${frontmatter.slug}`}
        className="group border-line shadow-card hover:shadow-card-hover flex h-full flex-col rounded-md border bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:rotate-[-0.4deg]"
      >
        <h3 className="font-display text-primary-800 group-hover:text-primary-600 text-3xl leading-[1.05] font-bold transition-colors">
          {frontmatter.title}
        </h3>

        <p className="text-ink-muted mt-3 flex-1 text-base leading-relaxed">
          {frontmatter.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {frontmatter.personas.map((persona) => (
            <li
              key={persona}
              className="border-primary-300 text-ink-muted rounded-[3px] border border-dashed px-2 py-0.5 text-sm font-medium"
            >
              {RESOURCE_PERSONA_LABELS[persona]}
            </li>
          ))}
        </ul>

        <p className="text-ink-soft mt-4 flex flex-wrap items-baseline gap-x-3 text-sm">
          <span className="red-note text-xl">
            {RESOURCE_TYPE_LABELS[frontmatter.type].singular}
          </span>
          <time dateTime={frontmatter.publishedAt}>
            {formatFrenchDate(frontmatter.publishedAt)}
          </time>{' '}
          · {readingTime.text}
        </p>
      </Link>
    </li>
  );
}
