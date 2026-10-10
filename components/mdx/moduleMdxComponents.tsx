import type { MDXComponents } from 'mdx/types';
import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { ModuleHero } from '@/components/mdx/ModuleHero';
import { ModuleBenefits } from '@/components/mdx/ModuleBenefits';
import { ModuleFeatures } from '@/components/mdx/ModuleFeatures';
import { ModuleAudiences } from '@/components/mdx/ModuleAudiences';
import { CalloutFinalCTA } from '@/components/mdx/CalloutFinalCTA';

/**
 * Génère les composants MDX pour le rendu via `next-mdx-remote/rsc`.
 *
 * Combine :
 * 1. Mappings HTML par défaut (h2, h3, p, ul, ol, a) avec nos styles Tailwind.
 * 2. Composants whitelistés (ModuleHero, ModuleBenefits, ...) liés par closure
 *    au module en cours — voir module-content.contract.md.
 */
export function createModuleMdxComponents(module: ModuleFrontmatter): MDXComponents {
  return {
    // HTML mappings (cohérents avec mdx-components.tsx racine)
    h2: ({ children, ...props }) => (
      <h2
        className="font-display text-primary-800 mt-12 text-4xl leading-none font-bold"
        {...props}
      >
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
      <ul
        className="text-ink-muted marker:text-pen-500 mt-4 list-disc space-y-2 pl-6 text-lg"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="text-ink-muted mt-4 list-decimal space-y-2 pl-6 text-lg" {...props}>
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

    // Composants module whitelistés (closure sur le frontmatter)
    ModuleHero: () => <ModuleHero module={module} />,
    ModuleBenefits: () => <ModuleBenefits module={module} />,
    ModuleFeatures: () => <ModuleFeatures module={module} />,
    ModuleAudiences: () => <ModuleAudiences module={module} />,
    CalloutFinalCTA: () => <CalloutFinalCTA module={module} />,
  };
}
