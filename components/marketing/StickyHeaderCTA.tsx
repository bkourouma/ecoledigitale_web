'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, Menu, X } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { cn } from '@/lib/ui/cn';

/** Pages regroupées sous « Fonctions » : les pages par fonction, puis le contexte ivoirien. */
const FEATURE_MENU = [
  { href: '/fonctions/bulletins-et-notes', label: 'Notes et bulletins' },
  { href: '/fonctions/frais-de-scolarite', label: 'Frais de scolarité et Mobile Money' },
  { href: '/fonctions/portail-parents', label: 'Portail parents' },
  { href: '/fonctions/emploi-du-temps-et-absences', label: 'Emploi du temps et absences' },
  { href: '/cote-d-ivoire', label: "Logiciel en Côte d'Ivoire" },
  { href: '/fonctions', label: 'Toutes les fonctions' },
];

const FEATURE_PATHS = ['/fonctions', '/cote-d-ivoire'];

const NAV_BEFORE = [
  { href: '/', label: 'Accueil', hideOnDesktop: true },
  { href: '/modules', label: 'Packs' },
];

const NAV_AFTER = [
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/ressources', label: 'Ressources' },
  { href: '/a-propos', label: 'À propos' },
];

const DESKTOP_LINK =
  'font-display inline-flex h-10 items-center px-3 text-2xl leading-none font-bold transition-colors';

export function StickyHeaderCTA() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const featuresRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  // Le menu « Fonctions » se ferme à chaque navigation, à Échap et au clic à l'extérieur.
  useEffect(() => {
    setFeaturesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!featuresOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFeaturesOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [featuresOpen]);

  const handleDemoClick = () => {
    setMobileOpen(false);
    track('Demo CTA Clicked', {
      placement: 'header',
      sourcePage: pathname || '/',
    });
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));
  const featuresActive = FEATURE_PATHS.some((path) => isActive(path));

  return (
    <header
      className={cn(
        'border-primary-700/80 bg-paper/95 sticky top-0 z-40 border-b-2 backdrop-blur-sm transition-shadow duration-300',
        scrolled && 'shadow-card',
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="EcoleDigitale — Accueil"
          onClick={() => setMobileOpen(false)}
        >
          <span
            aria-hidden="true"
            className="border-primary-700 font-display text-primary-700 flex h-10 w-10 -rotate-3 items-center justify-center rounded-[4px] border-2 border-double bg-white text-3xl leading-none font-bold shadow-xs select-none"
          >
            É
          </span>
          <span className="font-display text-primary-800 text-3xl leading-none font-bold">
            EcoleDigitale
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_BEFORE.map((item) => (
              <li key={item.href} className={item.hideOnDesktop ? 'lg:hidden' : undefined}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    DESKTOP_LINK,
                    isActive(item.href)
                      ? 'pen-underline text-primary-800'
                      : 'text-ink-muted hover:text-primary-700',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li ref={featuresRef} className="relative">
              <button
                type="button"
                aria-expanded={featuresOpen}
                aria-controls="features-menu"
                onClick={() => setFeaturesOpen((open) => !open)}
                className={cn(
                  DESKTOP_LINK,
                  'gap-1',
                  featuresActive
                    ? 'pen-underline text-primary-800'
                    : 'text-ink-muted hover:text-primary-700',
                )}
              >
                Fonctions
                <ChevronDown
                  className={cn('h-5 w-5 transition-transform', featuresOpen && 'rotate-180')}
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </button>
              {featuresOpen && (
                <ul
                  id="features-menu"
                  className="border-primary-700 bg-paper shadow-elevated absolute top-full left-0 z-50 mt-2 w-80 rounded-md border-2 py-2"
                >
                  {FEATURE_MENU.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        className={cn(
                          'font-display hover:bg-marker-soft block px-4 py-2 text-2xl leading-tight font-bold transition-colors',
                          pathname === item.href ? 'text-primary-800' : 'text-ink-muted',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {NAV_AFTER.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    DESKTOP_LINK,
                    isActive(item.href)
                      ? 'pen-underline text-primary-800'
                      : 'text-ink-muted hover:text-primary-700',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/demander-demo"
            onClick={handleDemoClick}
            className="stamp font-display inline-flex h-10 items-center px-4 text-xl leading-none font-bold"
          >
            Demander une démo
          </Link>
        </div>

        <button
          type="button"
          className="border-primary-700 text-primary-800 hover:bg-marker-soft flex h-10 w-10 items-center justify-center rounded-md border-2 bg-white shadow-xs transition-colors lg:hidden"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navigation mobile"
          className="border-primary-300 bg-paper shadow-elevated max-h-[calc(100vh-4rem)] overflow-y-auto border-t-2 border-dashed lg:hidden"
        >
          <ul className="container-content flex flex-col gap-1 py-3">
            {[
              ...NAV_BEFORE,
              { href: '/fonctions', label: 'Fonctions', children: FEATURE_MENU },
              ...NAV_AFTER,
            ].map((item) => {
              const children = 'children' in item ? item.children : undefined;
              const active = children ? featuresActive : isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active && !children ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'font-display flex items-center px-2 py-2 text-3xl leading-none font-bold transition-colors',
                      active ? 'text-primary-800' : 'text-ink-muted hover:text-primary-700',
                    )}
                  >
                    {active && (
                      <Check
                        className="text-accent-600 mr-2 h-6 w-6"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                  </Link>
                  {children && (
                    <ul className="border-primary-200 mt-1 mb-2 ml-4 border-l-2 border-dashed pl-4">
                      {children
                        .filter((child) => child.href !== '/fonctions')
                        .map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={pathname === child.href ? 'page' : undefined}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                'font-display block px-2 py-1.5 text-2xl leading-tight font-bold transition-colors',
                                pathname === child.href
                                  ? 'text-primary-800'
                                  : 'text-ink-muted hover:text-primary-700',
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="pt-3 pb-2">
              <Link
                href="/demander-demo"
                onClick={handleDemoClick}
                className="stamp font-display flex h-12 items-center justify-center text-2xl leading-none font-bold"
              >
                Demander une démonstration
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
