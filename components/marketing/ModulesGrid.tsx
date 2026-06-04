import { ModuleCard } from '@/components/marketing/ModuleCard';
import { loadModules } from '@/lib/content/modules';

export interface ModulesGridProps {
  className?: string;
}

/**
 * Grille des 5 modules (triés par order). Source unique pour l'aperçu
 * sur l'accueil et la vue catalogue `/modules`.
 */
export function ModulesGrid({ className }: ModulesGridProps) {
  const modules = loadModules();

  return (
    <ul
      className={
        'grid gap-6 md:grid-cols-2 lg:grid-cols-3 ' + (className ?? '')
      }
    >
      {modules.map(({ frontmatter }) => (
        <li key={frontmatter.slug}>
          <ModuleCard module={frontmatter} />
        </li>
      ))}
    </ul>
  );
}
