'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 dark:border-white/10 dark:bg-white/8 dark:text-neutral-300 dark:hover:border-accent-400/60 dark:hover:text-white"
      aria-label={`Activer le mode ${nextTheme === 'dark' ? 'sombre' : 'clair'}`}
      title={`Mode ${nextTheme === 'dark' ? 'sombre' : 'clair'}`}
      onClick={() => {
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        localStorage.setItem('theme', nextTheme);
        setTheme(nextTheme);
      }}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
