import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { FinalCTA } from '@/components/marketing/FinalCTA';

export interface CalloutFinalCTAProps {
  module: ModuleFrontmatter;
}

export function CalloutFinalCTA({ module }: CalloutFinalCTAProps) {
  return (
    <FinalCTA
      title={`Découvrez ${module.name} en démonstration`}
      description={`Échangez avec un conseiller pour comprendre comment ${module.type === 'socle' ? 'le socle' : 'ce pack'} s’intègre à votre établissement.`}
      ctaLabel={module.cta.label}
    />
  );
}
