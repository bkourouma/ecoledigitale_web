'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { track } from '@/lib/analytics/track';
import { cn } from '@/lib/ui/cn';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/modules', label: 'Modules' },
  { href: '/blog', label: 'Blog' },
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
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-neutral-200/80 bg-white/86 shadow-xs backdrop-blur-xl supports-[backdrop-filter]:bg-white/76 dark:border-white/10 dark:bg-neutral-950/78'
          : 'border-b border-transparent bg-white/55 backdrop-blur-md dark:bg-neutral-950/45',
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="EcoleDigitale — Accueil"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-sm font-bold text-white shadow-xs ring-1 ring-white/20 select-none dark:bg-primary-500">
            É
          </span>
          <span className="font-display text-base font-semibold text-ink dark:text-white">
            EcoleDigitale
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex h-9 items-center rounded-full px-3 text-sm transition-all duration-200',
                      active
                        ? 'bg-primary-50 font-semibold text-primary-800 ring-1 ring-primary-100 dark:bg-primary-400/12 dark:text-primary-200 dark:ring-primary-300/20'
                        : 'font-medium text-ink-muted hover:bg-surface-muted hover:text-ink dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white',
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
          <ThemeToggle />
          <Link
            href="/demander-demo"
            onClick={handleDemoClick}
            className="inline-flex h-9 items-center rounded-full bg-accent-500 px-4 text-sm font-semibold text-neutral-950 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            Demander une démo
          </Link>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-ink-muted shadow-xs transition-colors hover:bg-surface-muted hover:text-ink md:hidden dark:border-white/10 dark:bg-white/8 dark:text-neutral-300 dark:hover:bg-white/12 dark:hover:text-white"
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
          className="border-t border-neutral-200 bg-white/96 shadow-elevated backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-neutral-950/96"
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
                      'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-50 text-primary-800 dark:bg-primary-400/12 dark:text-primary-200'
                        : 'text-ink-muted hover:bg-surface-muted hover:text-ink dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="flex items-center justify-between gap-3 pt-2 pb-1">
              <ThemeToggle />
              <Link
                href="/demander-demo"
                onClick={handleDemoClick}
                className="flex flex-1 items-center justify-center rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
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
