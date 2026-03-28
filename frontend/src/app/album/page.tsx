'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import StickerCard from '@/components/StickerCard';
import { UserSticker } from '@/lib/types';
import { groupBy } from '@/lib/utils';
import api from '@/lib/api';
import { Search, Loader2, BookOpen, ChevronDown, ChevronUp, Shield } from 'lucide-react';

type Filter = 'TODOS' | 'TENHO' | 'NAO_TENHO';

export default function AlbumPage() {
  const [stickers, setStickers] = useState<UserSticker[]>([]);
  const [filter,   setFilter]   = useState<Filter>('TODOS');
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.get('/api/album').then((r) => {
      setStickers(r.data);
      const teams = Array.from(new Set((r.data as UserSticker[]).map((s) => s.team)));
      const init: Record<string, boolean> = {};
      teams.forEach((t) => { init[t] = true; });
      setExpanded(init);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Toggle: clique → alterna owned no backend (cria ou deleta registro)
  const handleToggle = useCallback(async (stickerId: number) => {
    setToggling(stickerId);
    try {
      const { data } = await api.post(`/api/album/stickers/${stickerId}/toggle`);
      setStickers((prev) => prev.map((s) =>
        s.stickerId === stickerId
          ? { ...s, owned: data.owned, repeatedCount: data.repeatedCount }
          : s
      ));
    } catch (err) { console.error(err); }
    finally { setToggling(null); }
  }, []);

  const tenho  = stickers.filter((s) => s.owned).length;
  const faltam = stickers.filter((s) => !s.owned).length;
  const pct    = stickers.length > 0
    ? Math.round(tenho / stickers.length * 1000) / 10 : 0;

  const filtered = stickers.filter((s) => {
    const flt = filter === 'TODOS'
      ? true
      : filter === 'TENHO'
        ? s.owned
        : !s.owned;
    const src = search === '' ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.team.toLowerCase().includes(search.toLowerCase()) ||
      String(s.albumNumber).includes(search);
    return flt && src;
  });

  const grouped = groupBy(filtered, 'team');

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="rounded-2xl p-5 mb-5 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-galo-gold rounded-xl flex items-center justify-center">
                  <BookOpen className="text-galo-black" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-white">Meu Álbum</h1>
                  <p className="text-white/40 text-xs">Clique para marcar / desmarcar</p>
                </div>
              </div>
              <span className="text-3xl font-black text-galo-gold">{pct}%</span>
            </div>

            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full transition-all duration-700"
                   style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C4A135, #e8bf4a)', boxShadow: '0 0 10px rgba(196,161,53,0.5)' }} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl py-2.5 text-center">
                <p className="text-xl font-black text-green-400">{tenho}</p>
                <p className="text-white/40 text-xs">✓ Tenho</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl py-2.5 text-center">
                <p className="text-xl font-black text-red-400">{faltam}</p>
                <p className="text-white/40 text-xs">✗ Faltam</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl py-2.5 text-center">
                <p className="text-xl font-black text-white">{stickers.length}</p>
                <p className="text-white/40 text-xs">Total</p>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex items-center gap-5 mb-4 px-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-red-400 bg-red-50 inline-block"/>
              Não tenho
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-green-500 bg-green-50 inline-block"/>
              Tenho
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 inline-block"
                    style={{ borderColor:'#C4A135', backgroundColor:'rgba(196,161,53,0.1)' }}/>
              Tenho + repetidas
            </span>
          </div>

          {/* Filtros + busca */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="text" placeholder="Buscar código, número ou seção..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div className="flex gap-1.5">
                {([
                  { key: 'TODOS',     label: `Todos (${stickers.length})`,  active: 'bg-galo-black text-white' },
                  { key: 'TENHO',     label: `✓ Tenho (${tenho})`,          active: 'bg-green-600 text-white' },
                  { key: 'NAO_TENHO', label: `✗ Faltam (${faltam})`,        active: 'bg-red-500 text-white' },
                ] as const).map(({ key, label, active }) => (
                  <button key={key} onClick={() => setFilter(key as Filter)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border
                      ${filter === key
                        ? `${active} border-transparent shadow-sm`
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 text-xs">
              <button
                onClick={() => setExpanded((p) => Object.fromEntries(Object.keys(p).map((k) => [k, true])))}
                className="font-medium hover:underline" style={{ color: '#C4A135' }}>
                Expandir tudo
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setExpanded((p) => Object.fromEntries(Object.keys(p).map((k) => [k, false])))}
                className="text-gray-500 font-medium hover:underline">
                Recolher tudo
              </button>
              <span className="ml-auto text-gray-400">{filtered.length} figurinhas</span>
            </div>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 bg-galo-gold rounded-xl flex items-center justify-center animate-pulse">
                <Shield className="text-galo-black" size={28} fill="currentColor" />
              </div>
              <p className="text-gray-400 text-sm">Carregando 980 figurinhas...</p>
            </div>
          ) : (
            Object.entries(grouped)
              .sort(([, a], [, b]) => (a[0].albumNumber ?? 0) - (b[0].albumNumber ?? 0))
              .map(([team, items]) => {
                const open   = expanded[team] ?? true;
                const tTenho = items.filter((s) => s.owned).length;
                const tFalt  = items.filter((s) => !s.owned).length;

                return (
                  <div key={team} className="mb-4">
                    <button
                      onClick={() => setExpanded((p) => ({ ...p, [team]: !p[team] }))}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white
                                 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50
                                 transition-colors mb-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-black text-galo-black text-sm">{team}</span>
                        <span className="text-xs text-gray-400">{items.length} fig.</span>
                        {tTenho > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            ✓ {tTenho}
                          </span>
                        )}
                        {tFalt > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                            ✗ {tFalt}
                          </span>
                        )}
                      </div>
                      {open
                        ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                        : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                    </button>

                    {open && (
                      <div className="grid gap-1.5"
                           style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(58px, 1fr))' }}>
                        {items.map((s) => (
                          <StickerCard
                            key={s.stickerId}
                            sticker={s}
                            onToggle={handleToggle}
                            loading={toggling === s.stickerId}
                          />
                        ))}
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
}
