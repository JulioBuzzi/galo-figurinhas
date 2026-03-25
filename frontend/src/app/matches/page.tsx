'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Match } from '@/lib/types';
import api from '@/lib/api';
import { Users, Loader2, Search, RefreshCw, Mail, ChevronDown, ChevronUp, Shield } from 'lucide-react';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/matches').then((r) => setMatches(r.data))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-6">

          <div className="rounded-2xl p-5 mb-6 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#C4A135' }}>
                <Users className="text-galo-black" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Matches de Troca</h1>
                <p className="text-white/40 text-xs">Colecionadores compatíveis com seu álbum</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 mb-6 border text-sm"
               style={{ backgroundColor: 'rgba(196,161,53,0.07)', borderColor: 'rgba(196,161,53,0.3)' }}>
            <p className="font-bold mb-1" style={{ color: '#8a6f1e' }}>Como funciona?</p>
            <p className="text-gray-600">
              O sistema compara seu álbum com outros colecionadores.
              Aparece quem tem o que você precisa — e precisa do que você tem repetido.
              Quanto maior o score, melhor a troca!
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center animate-pulse"
                   style={{ backgroundColor: '#C4A135' }}>
                <Shield className="text-galo-black" size={28} fill="currentColor" />
              </div>
              <p className="text-gray-400 text-sm">Calculando matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-bold text-gray-600">Nenhum match encontrado</p>
              <p className="text-sm mt-1">Marque figurinhas no álbum para começar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((m) => <MatchCard key={m.userId} match={m} />)}
            </div>
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}

function MatchCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false);
  const score = match.matchScore;
  const scoreColor = score >= 5 ? '#22c55e' : score >= 2 ? '#C4A135' : '#6b7280';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-5 cursor-pointer"
           onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shadow"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)', border: '2px solid #C4A135' }}>
            {match.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-galo-black">{match.userName}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={11} />{match.userEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl border text-sm font-black"
               style={{ color: scoreColor, borderColor: scoreColor, backgroundColor: `${scoreColor}15` }}>
            ★ {score} trocas
          </div>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {!expanded && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {match.theyHaveWhatINeed.length > 0 && (
            <span className="text-xs text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Search size={11} /> {match.theyHaveWhatINeed.length} que você precisa
            </span>
          )}
          {match.iHaveWhatTheyNeed.length > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border"
                  style={{ color: '#8a6f1e', backgroundColor: 'rgba(196,161,53,0.1)', borderColor: 'rgba(196,161,53,0.3)' }}>
              <RefreshCw size={11} /> {match.iHaveWhatTheyNeed.length} que eles precisam
            </span>
          )}
        </div>
      )}

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50/50">
          {match.theyHaveWhatINeed.length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1.5">
                <Search size={12} /> Eles TÊM — você PRECISA ({match.theyHaveWhatINeed.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.theyHaveWhatINeed.map((s) => (
                  <span key={s.id} className="bg-red-50 border border-red-200 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {s.code}
                  </span>
                ))}
              </div>
            </div>
          )}
          {match.iHaveWhatTheyNeed.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: '#8a6f1e' }}>
                <RefreshCw size={12} /> Você TEM — eles PRECISAM ({match.iHaveWhatTheyNeed.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.iHaveWhatTheyNeed.map((s) => (
                  <span key={s.id} className="text-xs px-2.5 py-1 rounded-full font-medium border"
                        style={{ backgroundColor: 'rgba(196,161,53,0.1)', borderColor: 'rgba(196,161,53,0.4)', color: '#8a6f1e' }}>
                    {s.code}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="pt-2 border-t border-gray-200">
            <a href={`mailto:${match.userEmail}?subject=Troca de figurinhas Copa 2026`}
               className="inline-flex items-center gap-2 text-white font-black text-sm px-4 py-2.5 rounded-xl transition-all"
               style={{ backgroundColor: '#0a0a0a', border: '1px solid #C4A135' }}>
              <Mail size={14} /> Entrar em contato
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
