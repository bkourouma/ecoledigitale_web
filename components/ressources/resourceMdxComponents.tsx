import type { MDXComponents } from 'mdx/types';

/**
 * Mappings HTML pour le rendu du corps MDX des ressources via `next-mdx-remote/rsc`.
 *
 * Styles cohérents avec `mdx-components.tsx` (racine) et `moduleMdxComponents.tsx`.
 * Aucun composant custom au MVP — les composants spécifiques aux études de cas
 * (CaseStudyAside, etc.) seront injectés à part par la route détail.
 */
export const resourceMdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className="mt-12 text-2xl font-semibold tracking-tight text-ink" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 text-xl font-semibold text-ink" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-muted" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-6 text-ink-muted marker:text-brand-500"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-muted" {...props}>
      {children}
    </ol>
  ),
  a: ({ children, ...props }) => (
    <a className="font-medium text-brand-700 underline-offset-4 hover:underline" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-6 border-l-4 border-brand-200 pl-4 text-ink-muted italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
};
