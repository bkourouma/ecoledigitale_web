import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/ui/cn';
import { formatFrenchDate } from '@/lib/ui/format-date';
import type { ResourceFrontmatter } from '@/lib/content/resource.schema';
import type { AuthorBundle } from '@/lib/content/authors';
import type { ReadingTimeResult } from '@/lib/content/reading-time';

interface ResourceMetaProps {
  frontmatter: ResourceFrontmatter;
  author: AuthorBundle | undefined;
  readingTime: ReadingTimeResult;
  className?: string;
}

/** Ligne de méta d'une ressource : auteur cliquable, dates, temps de lecture. */
export function ResourceMeta({ frontmatter, author, readingTime, className }: ResourceMetaProps) {
  const showUpdated =
    frontmatter.updatedAt !== undefined && frontmatter.updatedAt !== frontmatter.publishedAt;

  const items: ReactNode[] = [];

  if (author) {
    items.push(
      <span key="author">
        Par{' '}
        <Link
          href={`/auteurs/${author.frontmatter.slug}`}
          className="font-medium text-brand-700 underline-offset-4 hover:underline"
        >
          {author.frontmatter.name}
        </Link>
      </span>,
    );
  }

  items.push(
    <span key="published">
      Publié le{' '}
      <time dateTime={frontmatter.publishedAt}>
        {formatFrenchDate(frontmatter.publishedAt)}
      </time>
    </span>,
  );

  if (showUpdated) {
    items.push(
      <span key="updated">
        Mis à jour le{' '}
        <time dateTime={frontmatter.updatedAt}>
          {formatFrenchDate(frontmatter.updatedAt as string)}
        </time>
      </span>,
    );
  }

  items.push(<span key="reading-time">{readingTime.text}</span>);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft',
        className,
      )}
    >
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden="true">·</span>}
          {item}
        </Fragment>
      ))}
    </div>
  );
}
