import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EcoleDigitale',
    short_name: 'EcoleDigitale',
    description:
      "Plateforme SaaS modulaire pour digitaliser la gestion académique, pédagogique et financière des établissements de formation.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#134fdc',
    lang: 'fr-FR',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
