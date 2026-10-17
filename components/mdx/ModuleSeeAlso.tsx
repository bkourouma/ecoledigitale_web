import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface SeeAlsoLink {
  href: string;
  label: string;
  hint?: string;
}

export interface ModuleSeeAlsoProps {
  packs: readonly SeeAlsoLink[];
  resources: readonly SeeAlsoLink[];
}

const LINK_CLASS =
  'text-primary-700 hover:bg-marker-soft inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-4';

/**
 * Maillage de fin de page : packs voisins, ressources liées, démonstration.
 * Les liens sont de vrais liens HTML, sans JavaScript.
 */
export function ModuleSeeAlso({ packs, resources }: ModuleSeeAlsoProps) {
  return (
    <section aria-labelledby="see-also-heading" className="container-content py-12 md:py-16">
      <h2 id="see-also-heading" className="font-display text-display-sm text-primary-800 font-bold">
        Voir <span className="marker">aussi</span>
      </h2>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {packs.length > 0 && (
          <div>
            <h3 className="font-display text-primary-700 text-3xl leading-none font-bold">
              Les autres packs
            </h3>
            <ul className="mt-4 space-y-3 text-lg">
              {packs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {link.hint && <p className="text-ink-muted mt-1 text-base">{link.hint}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h3 className="font-display text-primary-700 text-3xl leading-none font-bold">
            Pour s&apos;informer
          </h3>
          <ul className="mt-4 space-y-3 text-lg">
            {resources.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/fonctions" className={LINK_CLASS}>
                Les fonctions : notes, frais, parents, emploi du temps
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href="/cote-d-ivoire" className={LINK_CLASS}>
                Logiciel de gestion scolaire en Côte d&apos;Ivoire
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href="/faq" className={LINK_CLASS}>
                Questions fréquentes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href="/tarifs" className={LINK_CLASS}>
                Tarifs : des offres sur devis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href="/ressources" className={LINK_CLASS}>
                Toutes les ressources
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href="/demander-demo" className={LINK_CLASS}>
                Demander une démonstration
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
