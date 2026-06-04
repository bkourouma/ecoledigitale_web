import { MDXRemote } from 'next-mdx-remote/rsc';
import { resourceMdxComponents } from '@/components/ressources/resourceMdxComponents';
import { AuthorAvatar } from '@/components/auteurs/AuthorAvatar';
import type { AuthorBundle } from '@/lib/content/authors';

interface AuthorBioProps {
  author: AuthorBundle;
}

/**
 * Présentation complète d'un auteur (en-tête de page `/auteurs/{slug}`).
 * Le `<h1>` porte le nom de l'auteur.
 */
export function AuthorBio({ author }: AuthorBioProps) {
  const { frontmatter, body } = author;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-5">
        <AuthorAvatar name={frontmatter.name} photo={frontmatter.photo} size={96} />
        <div>
          <h1 className="text-display-md font-semibold tracking-tight text-ink">
            {frontmatter.name}
          </h1>
          <p className="mt-2 text-lg text-ink-muted">{frontmatter.role}</p>
          {frontmatter.linkedinUrl && (
            <a
              href={frontmatter.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              Profil LinkedIn
            </a>
          )}
        </div>
      </div>

      <p className="mt-6 max-w-prose text-ink-muted">{frontmatter.bio}</p>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          Domaines d’expertise
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {frontmatter.expertise.map((item) => (
            <li
              key={item}
              className="rounded-full bg-surface-muted px-3 py-1 text-sm text-ink"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {body.trim().length > 0 && (
        <div className="mt-8 max-w-prose">
          <MDXRemote source={body} components={resourceMdxComponents} />
        </div>
      )}
    </div>
  );
}
