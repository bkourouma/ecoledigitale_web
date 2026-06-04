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
      <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-muted marker:text-brand-500" {...props}>
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

    // Composants module whitelistés (closure sur le frontmatter)
    ModuleHero: () => <ModuleHero module={module} />,
    ModuleBenefits: () => <ModuleBenefits module={module} />,
    ModuleFeatures: () => <ModuleFeatures module={module} />,
    ModuleAudiences: () => <ModuleAudiences module={module} />,
    CalloutFinalCTA: () => <CalloutFinalCTA module={module} />,
  };
}
