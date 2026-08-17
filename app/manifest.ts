import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tawakal Bar B.Q',
    short_name: 'Tawakal BBQ',
    description:
      'Order authentic fire-grilled Pakistani BBQ online at Tawakal Restaurant. Live charcoal tikkas, seekh kebabs, malai boti, rolls, fast food & premium deals.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#11100E',
    theme_color: '#11100E',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
