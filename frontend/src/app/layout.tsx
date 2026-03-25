import type { Metadata } from 'next';
import './globals.css';
import AuthInitializer from '@/components/AuthInitializer';

export const metadata: Metadata = {
  title: 'Copa 2026 — Álbum de Figurinhas',
  description: 'Gerencie seu álbum de figurinhas da Copa do Mundo 2026',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Carrega sessão do localStorage antes de renderizar */}
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
