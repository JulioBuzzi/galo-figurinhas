'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import { UserSticker } from '@/lib/types';
import { groupBy } from '@/lib/utils';
import api from '@/lib/api';
<<<<<<< HEAD
import { RefreshCw, Loader2, Plus, Minus, Search, ChevronDown, ChevronUp, Shield } from 'lucide-react';
=======
import { RefreshCw, Loader2, Plus, Minus, Search, ChevronDown, ChevronUp } from 'lucide-react';
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07

export default function RepetidasPage() {
  const [stickers, setStickers] = useState<UserSticker[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.get('/api/album/owned').then((r) => {
      const sorted = (r.data as UserSticker[]).sort(
        (a, b) => (a.albumNumber ?? 0) - (b.albumNumber ?? 0)
      );
      setStickers(sorted);
      const teams = Array.from(new Set(sorted.map((s) => s.team)));
      const init: Record<string, boolean> = {};
      teams.forEach((t) => { init[t] = true; });
      setExpanded(init);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleRepeat = useCallback(async (stickerId: number, delta: number) => {
    setUpdating(stickerId);
    try {
      const { data } = await api.patch(`/api/album/stickers/${stickerId}/repeated?delta=${delta}`);
      setStickers((prev) =>
        prev.map((s) => s.stickerId === stickerId ? { ...s, repeatedCount: data.repeatedCount } : s)
      );
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  }, []);

  const totalRepetidas = stickers.reduce((a, s) => a + (s.repeatedCount ?? 0), 0);
  const comRepetidas   = stickers.filter((s) => (s.repeatedCount ?? 0) > 0).length;

  const filtered = stickers.filter((s) =>
    search === '' ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.team.toLowerCase().includes(search.toLowerCase()) ||
    String(s.albumNumber).includes(search)
  );

  const grouped = groupBy(filtered, 'team');

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="rounded-2xl p-5 mb-5 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#C4A135' }}>
                <RefreshCw className="text-galo-black" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Minhas Repetidas</h1>
                <p className="text-white/40 text-xs">Use + e − para controlar as cópias extras</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl py-2.5 text-center">
                <p className="text-xl font-black text-yellow-400">{totalRepetidas}</p>
                <p className="text-white/40 text-xs">Total repetidas</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl py-2.5 text-center">
                <p className="text-xl font-black text-orange-400">{comRepetidas}</p>
                <p className="text-white/40 text-xs">Tipos diferentes</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl py-2.5 text-center">
                <p className="text-xl font-black text-green-400">{stickers.length}</p>
                <p className="text-white/40 text-xs">Que tenho</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="text" placeholder="Buscar figurinha..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 text-xs">
              <button onClick={() => setExpanded((p) => Object.fromEntries(Object.keys(p).map((k) => [k, true])))}
                className="font-medium hover:underline" style={{ color: '#C4A135' }}>Expandir tudo</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setExpanded((p) => Object.fromEntries(Object.keys(p).map((k) => [k, false])))}
                className="text-gray-500 font-medium hover:underline">Recolher tudo</button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
<<<<<<< HEAD
              <div className="w-14 h-14 rounded-xl flex items-center justify-center animate-pulse" style={{ backgroundColor: '#C4A135' }}>
                <Shield className="text-galo-black" size={28} fill="currentColor" />
=======
              <div className="w-14 h-14 rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: '#C4A135' }}>
                <img src="/logo.png" alt="FroSócios" className="w-full h-full object-cover"
                     onError={(e: any) => { e.target.style.display="none"; }} />
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
              </div>
              <p className="text-gray-400 text-sm">Carregando...</p>
            </div>
          ) : stickers.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <RefreshCw size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-bold text-gray-600">Nenhuma figurinha marcada ainda</p>
              <p className="text-sm mt-1">Vá ao Álbum e marque as que você tem!</p>
            </div>
          ) : (
            Object.entries(grouped)
              .sort(([, a], [, b]) => (a[0].albumNumber ?? 0) - (b[0].albumNumber ?? 0))
              .map(([team, items]) => {
                const open = expanded[team] ?? true;
                const teamRep = items.reduce((a, s) => a + (s.repeatedCount ?? 0), 0);
                return (
                  <div key={team} className="mb-4">
                    <button onClick={() => setExpanded((p) => ({ ...p, [team]: !p[team] }))}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white
                                 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-galo-black text-sm">{team}</span>
                        <span className="text-xs text-gray-400">{items.length} fig.</span>
                        {teamRep > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold border"
                                style={{ backgroundColor: 'rgba(196,161,53,0.15)', borderColor: 'rgba(196,161,53,0.4)', color: '#8a6f1e' }}>
                            ↺ {teamRep}
                          </span>
                        )}
                      </div>
                      {open ? <ChevronUp size={16} className="text-gray-400" />
                             : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    {open && (
                      <div className="space-y-2">
                        {items.map((s) => {
                          const busy  = updating === s.stickerId;
                          const count = s.repeatedCount ?? 0;
                          const hasR  = count > 0;
                          return (
                            <div key={s.stickerId}
                              className={`flex items-center justify-between bg-white rounded-xl border-2 px-4 py-3 transition-all ${busy ? 'opacity-50' : ''}`}
                              style={ hasR ? { borderColor: '#C4A135', backgroundColor: 'rgba(196,161,53,0.05)' } : { borderColor: '#e5e7eb' } }>
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs font-mono font-black px-2 py-1 rounded-lg shrink-0"
                                      style={ hasR ? { backgroundColor: 'rgba(196,161,53,0.2)', color: '#8a6f1e' } : { backgroundColor: '#f3f4f6', color: '#6b7280' } }>
                                  {s.code}
                                </span>
                                <p className="text-sm text-gray-500 truncate">{s.team}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                <button onClick={() => handleRepeat(s.stickerId, -1)}
                                  disabled={count === 0 || busy}
                                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-600
                                             disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                                  <Minus size={14} />
                                </button>
                                <div className="w-10 h-8 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-all"
                                     style={ hasR ? { backgroundColor: '#C4A135', borderColor: '#C4A135', color: '#0a0a0a' }
                                                  : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#9ca3af' } }>
                                  {count}
                                </div>
                                <button onClick={() => handleRepeat(s.stickerId, 1)} disabled={busy}
                                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-green-100 hover:text-green-700
                                             flex items-center justify-center transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
