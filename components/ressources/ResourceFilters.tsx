import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getAllResources } from '@/lib/content/resources';
import {
  RESOURCE_TYPES,
  RESOURCE_TYPE_LABELS,
  RESOURCE_PERSONAS,
  RESOURCE_PERSONA_LABELS,
} from '@/lib/content/resource.schema';

interface ResourceFiltersProps {
  currentPersona?: string;
  currentType?: string;
}

const SELECT_CLASSES =
  'h-11 rounded-md border border-line bg-white px-3 text-sm text-ink ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

/**
 * Filtres du hub — formulaire HTML natif en `GET`. Aucun JavaScript client :
 * la soumission recharge `/ressources` avec les paramètres d'URL, ce qui
 * préserve l'architecture RSC et le score de performance (cf. research.md R-002).
 */
export function ResourceFilters({ currentPersona, currentType }: ResourceFiltersProps) {
  const hasActiveFilter = Boolean(currentPersona || currentType);
  // Un type sans aucune ressource publiée n'est pas proposé dans le filtre.
  const publishedTypes = new Set(getAllResources().map((bundle) => bundle.frontmatter.type));
  const availableTypes = RESOURCE_TYPES.filter((type) => publishedTypes.has(type));

  return (
    <form method="GET" action="/ressources" className="flex flex-wrap items-end gap-4">
      <div className="space-y-1.5">
        <label htmlFor="filter-persona" className="text-ink block text-sm font-medium">
          Public cible
        </label>
        <select
          id="filter-persona"
          name="persona"
          defaultValue={currentPersona ?? ''}
          className={SELECT_CLASSES}
        >
          <option value="">Tous les publics</option>
          {RESOURCE_PERSONAS.map((persona) => (
            <option key={persona} value={persona}>
              {RESOURCE_PERSONA_LABELS[persona]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="filter-type" className="text-ink block text-sm font-medium">
          Type de ressource
        </label>
        <select
          id="filter-type"
          name="type"
          defaultValue={currentType ?? ''}
          className={SELECT_CLASSES}
        >
          <option value="">Tous les types</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {RESOURCE_TYPE_LABELS[type].plural}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" size="md">
        Filtrer
      </Button>

      {hasActiveFilter && (
        <Link
          href="/ressources"
          className="text-brand-700 text-sm font-medium underline-offset-4 hover:underline"
        >
          Réinitialiser
        </Link>
      )}
    </form>
  );
}
