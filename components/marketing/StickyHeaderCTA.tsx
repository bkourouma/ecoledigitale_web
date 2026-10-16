'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, Menu, X } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { cn } from '@/lib/ui/cn';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/modules', label: 'Packs' },
  { href: '/ressources', label: 'Ressources' },
  { href: '/a-propos', label: 'À propos' },
];

export function StickyHeaderCTA() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  const handleDemoClick = () => {
    setMobileOpen(false);
    track('Demo CTA Clicked', {
      placement: 'header',
      sourcePage: pathname || '/',
    });
  };

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

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'font-display inline-flex h-10 items-center px-3 text-2xl leading-none font-bold transition-colors',
                      active
                        ? 'pen-underline text-primary-800'
                        : 'text-ink-muted hover:text-primary-700',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
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
          className="border-primary-700 text-primary-800 hover:bg-marker-soft flex h-10 w-10 items-center justify-center rounded-md border-2 bg-white shadow-xs transition-colors md:hidden"
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
          className="border-primary-300 bg-paper shadow-elevated border-t-2 border-dashed md:hidden"
        >
          <ul className="container-content flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
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
