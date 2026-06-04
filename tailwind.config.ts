/**
 * Tailwind CSS v4 utilise une configuration CSS-first.
 *
 * Tous les tokens du design system (couleurs, typographies, espacements,
 * ombres, container) sont définis dans `@theme` dans `app/globals.css`.
 *
 * Ce fichier est conservé vide pour compatibilité IDE / prettier-plugin-tailwindcss
 * mais n'est plus la source de vérité du thème.
 *
 * Voir https://tailwindcss.com/docs/v4-beta#css-first-configuration
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    './lib/**/*.{ts,tsx}',
    './mdx-components.tsx',
  ],
};

export default config;
