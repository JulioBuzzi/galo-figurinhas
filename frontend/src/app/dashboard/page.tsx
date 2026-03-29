'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import { useAuthStore } from '@/contexts/authStore';
import { AlbumProgress } from '@/lib/types';
import api from '@/lib/api';
import Link from 'next/link';
import { BookOpen, Users, Shield, TrendingUp, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [progress, setProgress] = useState<AlbumProgress | null>(null);

  useEffect(() => {
    api.get('/api/album/progress').then((r) => setProgress(r.data)).catch(console.error);
  }, []);

  const pct = progress?.completionPercent ?? 0;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">

          {/* Hero */}
          <div className="rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 opacity-5"
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4A135 0, #C4A135 2px, transparent 0, transparent 12px)', backgroundSize: '20px 20px' }} />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-white/50 text-sm mb-1 uppercase tracking-widest font-medium">Bem-vindo,</p>
                <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                <p className="text-white/40 text-sm mt-1">{user?.email}</p>
              </div>
              <div className="w-14 h-14 bg-galo-gold rounded-xl overflow-hidden shadow-lg">
                <img src="/logo.png" alt="FroSócios" className="w-full h-full object-cover"
                     onError={(e: any) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<span style="font-size:30px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">🐓</span>'; }} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-galo-gold text-xs font-bold uppercase tracking-widest">
                CANAL DO FROSSARD — COPA 2026
              </p>
            </div>
          </div>

          {/* Progresso */}
          {progress && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-galo-gold" />
                  Progresso do Álbum
                </h2>
                <span className="text-3xl font-black text-galo-black">{pct}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C4A135, #e8bf4a)', boxShadow: '0 0 8px rgba(196,161,53,0.5)' }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox value={progress.tenho}          label="Tenho"        color="text-green-700"  bg="bg-green-50 border-green-200" />
                <StatBox value={progress.naoTenho}       label="Faltam"       color="text-red-600"    bg="bg-red-50 border-red-200" />
                <StatBox value={progress.comRepetidas}   label="C/ Repetidas" color="text-yellow-700" bg="bg-yellow-50 border-yellow-200" />
                <StatBox value={progress.totalRepetidas} label="Tot. Repet."  color="text-orange-700" bg="bg-orange-50 border-orange-200" />
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">{progress.total} figurinhas no álbum</p>
            </div>
          )}

          {/* Cards — sem feed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NavCard href="/album"     icon={<BookOpen size={24}/>}  title="Álbum"     desc="Marque suas figurinhas"  dark />
            <NavCard href="/repetidas" icon={<RefreshCw size={24}/>} title="Repetidas" desc="Gerencie suas trocas"    gold />
            <NavCard href="/matches"   icon={<Users size={24}/>}     title="Matches"   desc="Encontre parceiros"      />
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}

function StatBox({ value, label, color, bg }: {
  value: number; label: string; color: string; bg: string;
}) {
  return (
    <div className={`${bg} border rounded-xl p-3 text-center`}>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

function NavCard({ href, icon, title, desc, dark, gold }: {
  href: string; icon: React.ReactNode; title: string; desc: string;
  dark?: boolean; gold?: boolean;
}) {
  const bg = dark ? 'bg-galo-black hover:bg-galo-gray text-white'
           : gold ? 'bg-galo-gold hover:bg-galo-gold2 text-galo-black'
           :        'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200';
  return (
    <Link href={href}
      className={`${bg} rounded-2xl p-5 flex flex-col gap-3 transition-all shadow-sm hover:shadow-md cursor-pointer`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
        ${dark ? 'bg-white/10' : gold ? 'bg-black/10' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className={`text-xs mt-0.5 ${dark ? 'text-white/50' : gold ? 'text-black/50' : 'text-gray-400'}`}>{desc}</p>
      </div>
    </Link>
  );
}
