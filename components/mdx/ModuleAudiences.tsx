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
    <section className="container-content py-12 md:py-16">
      <h2 className="font-display text-display-sm text-primary-800 font-bold">
        Profils utilisateurs <span className="marker">adressés</span>
      </h2>
      <p className="text-ink-muted mt-2 max-w-prose text-lg">
        Chaque profil dispose d&apos;un espace dédié, conçu autour de ses besoins quotidiens.
      </p>
      <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-4">
        {module.audiences.map((slug, index) => {
          const meta = AUDIENCE_META[slug];
          const Icon = meta.icon;
          return (
            <li
              key={slug}
              className="border-primary-300 font-display text-primary-800 inline-flex items-center gap-2 rounded-[4px] border-2 border-dashed bg-white px-4 py-2 text-2xl leading-none font-bold shadow-xs"
              style={{ transform: `rotate(${index % 2 ? 0.8 : -0.8}deg)` }}
            >
              <Icon className="text-primary-600 h-5 w-5" aria-hidden="true" />
              <span>{meta.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
