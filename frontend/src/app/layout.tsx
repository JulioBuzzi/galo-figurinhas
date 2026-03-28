import type { Metadata } from 'next';
import './globals.css';
import AuthInitializer from '@/components/AuthInitializer';

export const metadata: Metadata = {
  title: 'Galo Figurinhas 2026',
  description: 'Gerencie seu álbum de figurinhas da Copa do Mundo 2026 — Atlético Mineiro',
  icons: {
    icon: [
      { url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐓</text></svg>' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Favicon galo emoji */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐓</text></svg>"
        />
      </head>
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}