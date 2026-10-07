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
        className="text-ink mt-12 text-2xl font-semibold tracking-tight dark:text-neutral-50"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-ink mt-8 text-xl font-semibold dark:text-neutral-50" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p
        className="text-ink-muted mt-4 max-w-prose text-base leading-relaxed dark:text-slate-300"
        {...props}
      >
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        className="text-ink-muted marker:text-brand-500 mt-4 list-disc space-y-2 pl-6 dark:text-slate-300"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="text-ink-muted mt-4 list-decimal space-y-2 pl-6 dark:text-slate-300"
        {...props}
      >
        {children}
      </ol>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-brand-700 dark:text-brand-300 font-medium underline-offset-4 hover:underline"
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
