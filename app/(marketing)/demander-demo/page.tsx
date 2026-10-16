import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { DemoRequestForm } from '@/components/forms/DemoRequestForm';
import { ContactChannels } from '@/components/marketing/ContactChannels';
import { Reveal } from '@/components/ui/Reveal';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Demander une démonstration du logiciel',
  description:
    'Échangez avec un conseiller EcoleDigitale pour voir le logiciel de gestion scolaire à l’œuvre. Remplissez le formulaire : réponse sous 48 h ouvrées.',
  path: '/demander-demo',
  ogImage: DEFAULT_OG_IMAGE,
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

      <section className="border-line relative overflow-hidden border-b">
        <Reveal className="container-wide max-w-4xl py-16 md:py-20">
          <h1 className="font-display text-display-md text-primary-800 mt-3 font-bold">
            Découvrez EcoleDigitale avec un conseiller
          </h1>
          <p className="text-ink-muted mt-4 max-w-prose text-lg leading-relaxed">
            Renseignez vos coordonnées et les packs qui vous intéressent. Un membre de l'équipe
            commerciale vous recontacte sous 48 heures ouvrées. Les offres sont établies sur devis.
          </p>
        </Reveal>
      </section>

      <section className="container-wide py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <Reveal className="border-line shadow-card rounded-md border bg-white p-6 md:p-8">
            <DemoRequestForm />
          </Reveal>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Reveal delay={0.05} className="sheet p-6">
              <h2 className="font-display text-primary-800 text-3xl leading-none font-bold">
                Pas de formulaire ?
              </h2>
              <p className="text-ink-muted mt-2 text-sm">
                Vous pouvez aussi nous contacter directement :
              </p>
              <ContactChannels placement="inline" variant="stacked" className="mt-4" />
            </Reveal>

            <Reveal delay={0.1} className="sheet p-6">
              <h2 className="font-display text-primary-800 text-3xl leading-none font-bold">
                Ce qui suit
              </h2>
              <ol className="text-ink-muted mt-3 space-y-3 text-sm">
                {[
                  'Réception de votre demande',
                  'Échange téléphonique de qualification',
                  'Démonstration personnalisée selon vos packs',
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="bg-primary-100 text-primary-700 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal
              delay={0.15}
              className="border-accent-200 bg-accent-50 rounded-md border p-6 shadow-xs"
            >
              <div className="flex gap-3">
                <CheckCircle2 className="text-accent-700 mt-0.5 h-5 w-5" aria-hidden="true" />
                <div>
                  <p className="text-accent-900 text-sm font-medium">
                    Réponse garantie sous 48 h ouvrées.
                  </p>
                  <p className="text-accent-800 mt-1 text-xs">
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
