import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EcoleDigitale',
    short_name: 'EcoleDigitale',
    description:
      'Logiciel de gestion scolaire pour les établissements de la maternelle au supérieur, en Côte d’Ivoire et en Afrique francophone.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fcfbf6',
    theme_color: '#1f2d7a',
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
