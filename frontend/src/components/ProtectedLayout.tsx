'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/contexts/authStore';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user   = useAuthStore((s) => s.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) router.replace('/login');
    }, 100);
    return () => clearTimeout(timer);
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-galo-gold rounded-2xl overflow-hidden animate-pulse shadow-lg">
            <img src="/logo.png" alt="FroSócios"
                 className="w-full h-full object-cover"
                 onError={(e: any) => { e.target.style.display='none'; }} />
          </div>
          <p className="text-white/40 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
