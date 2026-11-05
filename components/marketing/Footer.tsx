import Link from 'next/link';
import { ManageCookiesButton } from '@/components/consent/ManageCookiesButton';
import { ContactChannels } from '@/components/marketing/ContactChannels';
import { PUBLISHER_NOTICE } from '@/lib/site/contact';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/modules', label: 'Packs' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/ressources', label: 'Ressources' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/demander-demo', label: 'Demander une démonstration' },
  { href: '/confidentialite', label: 'Confidentialité' },
];

const MODULE_LINKS = [
  { href: '/modules/socle-ecoledigitale', label: 'Socle EcoleDigitale' },
  { href: '/modules/ecoledigitale-primary', label: 'Primary : maternelle et primaire' },
  { href: '/modules/ecoledigitale-secondary', label: 'Secondary : collège et lycée' },
  { href: '/modules/ecoledigitale-higher', label: 'Higher : supérieur et BTS' },
  { href: '/modules/ecoledigitale-virtual', label: 'Virtual : formation à distance' },
];

const FEATURE_LINKS = [
  { href: '/cote-d-ivoire', label: "Logiciel en Côte d'Ivoire" },
  { href: '/fonctions/bulletins-et-notes', label: 'Notes et bulletins' },
  { href: '/fonctions/frais-de-scolarite', label: 'Frais de scolarité et Mobile Money' },
  { href: '/fonctions/portail-parents', label: 'Portail parents' },
  { href: '/fonctions/emploi-du-temps-et-absences', label: 'Emploi du temps et absences' },
  { href: '/fonctions', label: 'Toutes les fonctions' },
];

const LINK_CLASS =
  'text-ink-muted underline-offset-4 decoration-2 transition-colors hover:text-marker hover:underline';

/** Le dos du cahier : couverture bleue, reliure spirale, étiquette de propriétaire. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="cover mt-section relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 h-6"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #0b1235 0 4.5px, #e3e6f5 5px 7px, transparent 7.5px)',
          backgroundSize: '30px 24px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: '8px center',
        }}
      />

      <div className="container-wide grid gap-12 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.9fr_0.9fr_1fr]">
        <div>
          <div className="label-card max-w-xs rotate-[-1.5deg] p-5">
            <p className="font-hand text-ink-soft text-sm">Ce cahier appartient à</p>
            <Link
              href="/"
              className="border-primary-400 font-display text-primary-800 mt-1 block border-b-2 border-dotted pb-1 text-4xl leading-none font-bold"
              aria-label="EcoleDigitale — Accueil"
            >
              EcoleDigitale
            </Link>
            <p className="text-ink-muted mt-3 text-sm leading-snug">
              Logiciel de gestion scolaire pour les établissements de la maternelle au supérieur, en
              Côte d&apos;Ivoire et en Afrique francophone.
            </p>
          </div>
        </div>

        <nav aria-label="Pages" className="text-base">
          <p className="font-display text-chalk-yellow text-3xl leading-none font-bold">
            Navigation
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Packs" className="text-base">
          <p className="font-display text-chalk-yellow text-3xl leading-none font-bold">Packs</p>
          <ul className="mt-4 space-y-2.5">
            {MODULE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Fonctions" className="text-base">
          <p className="font-display text-chalk-yellow text-3xl leading-none font-bold">
            Fonctions
          </p>
          <ul className="mt-4 space-y-2.5">
            {FEATURE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-display text-chalk-yellow text-3xl leading-none font-bold">Contact</p>
          <ContactChannels placement="footer" variant="stacked" className="mt-4" />
          <p className="text-ink-muted mt-6 max-w-xs text-base leading-snug">
            Réponse sous 48 h ouvrées. Remplissez le formulaire de démonstration ou écrivez-nous
            directement, sans engagement.
          </p>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-white/25">
        <div className="container-wide text-ink-soft flex flex-wrap items-center justify-between gap-4 py-5 text-sm">
          <p>
            © {year} EcoleDigitale. {PUBLISHER_NOTICE}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/confidentialite" className={LINK_CLASS}>
              Politique de confidentialité
            </Link>
            <ManageCookiesButton className={LINK_CLASS} />
          </div>
        </div>
      </div>
    </footer>
  );
}
