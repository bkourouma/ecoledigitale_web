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
    <h2 className="font-display text-primary-800 mt-12 text-4xl leading-none font-bold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="font-display text-primary-700 mt-8 text-3xl leading-none font-bold" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-ink-muted mt-4 max-w-prose text-lg leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="text-ink-muted marker:text-pen-500 mt-4 list-disc space-y-2 pl-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="text-ink-muted mt-4 list-decimal space-y-2 pl-6" {...props}>
      {children}
    </ol>
  ),
  a: ({ children, ...props }) => (
    <a
      className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="red-note mt-6 max-w-prose text-2xl not-italic" {...props}>
      {children}
    </blockquote>
  ),
};
