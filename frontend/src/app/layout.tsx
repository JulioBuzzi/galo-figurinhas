import type { Metadata } from 'next';
import './globals.css';
import AuthInitializer from '@/components/AuthInitializer';

export const metadata: Metadata = {
  title: 'FroSócios Figurinhas 2026',
  description: 'Álbum de figurinhas da Copa 2026 — Canal do Frossard',
  icons: {
<<<<<<< HEAD
    icon: '/logo.png',
    apple: '/logo.png',
=======
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐔</text></svg>',
      },
    ],
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
<<<<<<< HEAD
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
=======
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
