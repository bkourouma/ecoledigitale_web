import Link from 'next/link';
import { ContactChannels } from '@/components/marketing/ContactChannels';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/modules', label: 'Modules' },
  { href: '/blog', label: 'Blog' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/demander-demo', label: 'Demander une démonstration' },
  { href: '/confidentialite', label: 'Confidentialité' },
];

const MODULE_LINKS = [
  { href: '/modules/socle-ecoledigitale', label: 'Socle EcoleDigitale' },
  { href: '/modules/parcours-bts', label: 'Parcours BTS' },
  { href: '/modules/parcours-superieur', label: 'Parcours Supérieur' },
  { href: '/modules/proformation', label: 'ProFormation' },
  { href: '/modules/campus-live', label: 'Campus Live' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-section border-t border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950">
      <div className="container-wide grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="EcoleDigitale — Accueil">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-sm font-bold text-white shadow-xs select-none dark:bg-primary-500">
              É
            </span>
            <span className="font-display text-base font-semibold text-ink dark:text-white">
              EcoleDigitale
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted dark:text-neutral-300">
            Plateforme SaaS modulaire pour digitaliser la gestion académique, pédagogique et
            financière des établissements de formation.
          </p>
        </div>

        <nav aria-label="Pages" className="text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-neutral-400">
            Navigation
          </p>
          <ul className="mt-3 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors hover:text-primary-700 dark:text-neutral-300 dark:hover:text-accent-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Modules" className="text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-neutral-400">
            Modules
          </p>
          <ul className="mt-3 space-y-2.5">
            {MODULE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors hover:text-primary-700 dark:text-neutral-300 dark:hover:text-accent-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-neutral-400">
            Contact
          </p>
          <ContactChannels placement="footer" variant="stacked" className="mt-3" />
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-card dark:border-white/10 dark:bg-white/6">
            <p className="text-xs font-medium text-ink dark:text-white">
              Réponse sous 48 h ouvrées
            </p>
            <p className="mt-1 text-xs text-ink-muted dark:text-neutral-300">
              Remplissez le formulaire de démo ou contactez-nous directement — sans engagement.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-white/10">
        <div className="container-wide flex flex-wrap items-center justify-between gap-4 py-5 text-xs text-ink-soft dark:text-neutral-400">
          <p>© {year} EcoleDigitale. Tous droits réservés.</p>
          <Link
            href="/confidentialite"
            className="transition-colors hover:text-primary-700 dark:hover:text-accent-300"
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}
