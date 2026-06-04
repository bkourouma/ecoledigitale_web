import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { DemoRequestForm } from '@/components/forms/DemoRequestForm';
import { ContactChannels } from '@/components/marketing/ContactChannels';
import { Reveal } from '@/components/ui/Reveal';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Demander une démonstration',
  description:
    'Échangez avec un conseiller EcoleDigitale pour découvrir la plateforme. Remplissez le formulaire et nous vous recontactons sous 48 heures.',
  path: '/demander-demo',
});

export default function DemanderDemoPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'Demander une démonstration', url: '/demander-demo' },
        ])}
      />

      <section className="relative overflow-hidden border-b border-neutral-200 premium-surface dark:border-white/10 dark:dark-premium-surface">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40 dark:opacity-15" aria-hidden="true" />
        <Reveal className="container-wide max-w-4xl py-16 md:py-20">
          <p className="section-kicker">Demande de démonstration</p>
          <h1 className="mt-3 font-display text-display-md font-semibold text-ink dark:text-white">
            Découvrez EcoleDigitale avec un conseiller
          </h1>
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
            Renseignez vos coordonnées et les modules qui vous intéressent. Un membre de l'équipe
            commerciale vous recontacte sous 48 heures ouvrées.
          </p>
        </Reveal>
      </section>

      <section className="container-wide py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <Reveal className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card md:p-8 dark:border-white/10 dark:bg-white/6">
            <DemoRequestForm />
          </Reveal>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Reveal delay={0.05} className="rounded-2xl border border-neutral-200/80 bg-neutral-50 p-6 shadow-xs dark:border-white/10 dark:bg-white/6">
              <h2 className="text-sm font-semibold text-ink dark:text-white">Pas de formulaire ?</h2>
              <p className="mt-2 text-sm text-ink-muted dark:text-neutral-300">
                Vous pouvez aussi nous contacter directement :
              </p>
              <ContactChannels placement="inline" variant="stacked" className="mt-4" />
            </Reveal>

            <Reveal delay={0.1} className="rounded-2xl border border-neutral-200/80 bg-neutral-50 p-6 shadow-xs dark:border-white/10 dark:bg-white/6">
              <h2 className="text-sm font-semibold text-ink dark:text-white">Ce qui suit</h2>
              <ol className="mt-3 space-y-3 text-sm text-ink-muted dark:text-neutral-300">
                {[
                  'Réception de votre demande',
                  'Échange téléphonique de qualification',
                  'Démonstration personnalisée selon vos modules',
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-400/15 dark:text-primary-200">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.15} className="rounded-2xl border border-accent-200 bg-accent-50 p-6 shadow-xs dark:border-accent-400/30 dark:bg-accent-400/10">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent-700 dark:text-accent-300" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-accent-900 dark:text-accent-100">
                    Réponse garantie sous 48 h ouvrées.
                  </p>
                  <p className="mt-1 text-xs text-accent-800 dark:text-accent-200">
                    Sans engagement — pas de carte bancaire requise.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
