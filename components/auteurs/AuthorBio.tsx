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
          <h1 className="font-display text-display-md text-primary-800 font-bold">
            {frontmatter.name}
          </h1>
          <p className="text-ink-muted mt-2 text-lg">{frontmatter.role}</p>
          {frontmatter.linkedinUrl && (
            <a
              href={frontmatter.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 mt-2 inline-block text-sm font-medium underline-offset-4 hover:underline"
            >
              Profil LinkedIn
            </a>
          )}
        </div>
      </div>

      <p className="text-ink-muted mt-6 max-w-prose">{frontmatter.bio}</p>

      <div className="mt-6">
        <h2 className="font-display text-primary-800 text-3xl leading-none font-bold">
          Domaines d’expertise
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {frontmatter.expertise.map((item) => (
            <li key={item} className="bg-surface-muted text-ink rounded-full px-3 py-1 text-sm">
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
