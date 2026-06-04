import Link from 'next/link';
import { formatFrenchDate } from '@/lib/ui/format-date';
import {
  RESOURCE_TYPE_LABELS,
  RESOURCE_PERSONA_LABELS,
} from '@/lib/content/resource.schema';
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
        className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
          {RESOURCE_TYPE_LABELS[frontmatter.type].singular}
        </span>

        <h3 className="mt-3 text-base font-semibold tracking-tight text-ink group-hover:text-brand-700 transition-colors">
          {frontmatter.title}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {frontmatter.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {frontmatter.personas.map((persona) => (
            <li
              key={persona}
              className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted"
            >
              {RESOURCE_PERSONA_LABELS[persona]}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs text-ink-soft">
          <time dateTime={frontmatter.publishedAt}>
            {formatFrenchDate(frontmatter.publishedAt)}
          </time>{' '}
          · {readingTime.text}
        </p>
      </Link>
    </li>
  );
}
