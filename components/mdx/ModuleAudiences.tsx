import {
  Award,
  Briefcase,
  Building2,
  ClipboardList,
  GraduationCap,
  Presentation,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Audience, ModuleFrontmatter } from '@/lib/content/module.schema';

const AUDIENCE_META: Record<Audience, { label: string; icon: LucideIcon }> = {
  director: { label: 'Directeur / fondateur', icon: Briefcase },
  academic: { label: 'Responsable pédagogique', icon: GraduationCap },
  admin: { label: 'Responsable administratif', icon: ClipboardList },
  teacher: { label: 'Enseignant', icon: Presentation },
  student: { label: 'Étudiant', icon: UserRound },
  parent: { label: 'Parent', icon: Users },
  trainer: { label: 'Formateur', icon: Award },
  owner: { label: "Propriétaire d'établissement", icon: Building2 },
};

export interface ModuleAudiencesProps {
  module: ModuleFrontmatter;
}

export function ModuleAudiences({ module }: ModuleAudiencesProps) {
  return (
    <section className="bg-surface-subtle border-y border-slate-100 py-16">
      <div className="container-content">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Profils utilisateurs adressés
        </h2>
        <p className="mt-2 max-w-prose text-ink-muted">
          Chaque profil dispose d'un espace dédié, conçu autour de ses besoins quotidiens.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {module.audiences.map((slug) => {
            const meta = AUDIENCE_META[slug];
            const Icon = meta.icon;
            return (
              <li
                key={slug}
                className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-medium text-ink shadow-xs"
              >
                <Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                <span>{meta.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
