'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Match } from '@/lib/types';
import api from '@/lib/api';
import { Users, Loader2, Mail, ChevronDown, ChevronUp, Shield, ArrowLeftRight } from 'lucide-react';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/matches')
      .then((r) => setMatches(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="rounded-2xl p-5 mb-5 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#C4A135' }}>
                <Users className="text-galo-black" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Matches de Troca</h1>
                <p className="text-white/40 text-xs">
                  Colecionadores com quem você pode trocar figurinhas
                </p>
              </div>
            </div>

            {/* Legenda */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-white/50 mb-1">Você PRECISA e eles TÊM repetida</p>
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-400"/>
                  <span className="text-green-400 text-xs font-bold">Eles podem te dar</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-white/50 mb-1">Você TEM repetida e eles PRECISAM</p>
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C4A135' }}/>
                  <span className="text-xs font-bold" style={{ color: '#C4A135' }}>Você pode dar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Como funciona */}
          <div className="rounded-2xl p-4 mb-5 border text-sm"
               style={{ backgroundColor: 'rgba(196,161,53,0.07)', borderColor: 'rgba(196,161,53,0.3)' }}>
            <p className="font-bold mb-1" style={{ color: '#8a6f1e' }}>Como funciona?</p>
            <p className="text-gray-600 text-xs leading-relaxed">
              O sistema analisa seu álbum e encontra pessoas que têm figurinhas que você precisa
              <strong> E</strong> precisam das suas repetidas. Quanto maior o <strong>Score</strong>,
              mais trocas são possíveis entre vocês!
            </p>
          </div>

          {/* Lista */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center animate-pulse"
                   style={{ backgroundColor: '#C4A135' }}>
                <Shield className="text-galo-black" size={28} fill="currentColor" />
              </div>
              <p className="text-gray-400 text-sm">Calculando matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20">
              <Users size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-bold text-gray-600">Nenhum match encontrado</p>
              <p className="text-sm mt-1 text-gray-400">
                Marque suas figurinhas no Álbum e adicione repetidas para encontrar matches!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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

  const theyGiveMe = match.theyHaveWhatINeed.length;   // repetidas deles que eu preciso
  const iGiveThem  = match.iHaveWhatTheyNeed.length;   // minhas repetidas que eles precisam
  const score      = match.matchScore;

  // Cor do score
  const scoreColor = score >= 8 ? '#22c55e'
                   : score >= 4 ? '#C4A135'
                   : '#6b7280';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

      {/* Header do card */}
      <div className="flex items-center justify-between p-4 cursor-pointer"
           onClick={() => setExpanded(v => !v)}>

        {/* Avatar + nome */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center
                          text-white font-black text-lg shadow"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)', border: '2px solid #C4A135' }}>
            {match.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-gray-900">{match.userName}</p>
            <p className="text-xs text-gray-400">{match.userEmail}</p>
          </div>
        </div>

        {/* Score + seta */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl border text-sm font-black"
               style={{ color: scoreColor, borderColor: scoreColor, backgroundColor: `${scoreColor}15` }}>
            ★ {score} trocas
          </div>
          {expanded
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Resumo sempre visível */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        {/* Eles têm o que eu preciso */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-green-600">{theyGiveMe}</p>
          <p className="text-xs text-green-700 font-medium mt-0.5">Eles podem te dar</p>
          <p className="text-[10px] text-gray-400 mt-0.5">figurinhas que você precisa</p>
        </div>

        {/* Eu tenho o que eles precisam */}
        <div className="border rounded-xl p-3 text-center"
             style={{ backgroundColor: 'rgba(196,161,53,0.08)', borderColor: 'rgba(196,161,53,0.3)' }}>
          <p className="text-2xl font-black" style={{ color: '#C4A135' }}>{iGiveThem}</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#8a6f1e' }}>Você pode dar</p>
          <p className="text-[10px] text-gray-400 mt-0.5">das suas repetidas que eles precisam</p>
        </div>
      </div>

      {/* Detalhes expandidos */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4 space-y-4">

          {/* Figurinhas que eles têm que eu preciso */}
          {theyGiveMe > 0 && (
            <div>
              <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                Figurinhas que ELES TÊM repetidas e você PRECISA ({theyGiveMe})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.theyHaveWhatINeed.map((s) => (
                  <span key={s.id}
                    className="bg-green-100 border border-green-300 text-green-800
                               text-xs px-2.5 py-1 rounded-full font-mono font-bold">
                    {s.code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Minhas repetidas que eles precisam */}
          {iGiveThem > 0 && (
            <div>
              <p className="text-xs font-bold mb-2 flex items-center gap-1.5"
                 style={{ color: '#8a6f1e' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C4A135' }}/>
                Suas REPETIDAS que ELES PRECISAM ({iGiveThem})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.iHaveWhatTheyNeed.map((s) => (
                  <span key={s.id}
                    className="text-xs px-2.5 py-1 rounded-full font-mono font-bold border"
                    style={{ backgroundColor: 'rgba(196,161,53,0.15)', borderColor: 'rgba(196,161,53,0.5)', color: '#8a6f1e' }}>
                    {s.code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botão de contato */}
          <div className="pt-2 border-t border-gray-200">
            <a href={`mailto:${match.userEmail}?subject=Troca de figurinhas - Galo 2026&body=Olá ${match.userName}! Vi que podemos fazer uma troca de figurinhas. Você tem ${theyGiveMe} que preciso e eu tenho ${iGiveThem} que você precisa!`}
              className="inline-flex items-center gap-2 text-white font-black text-sm
                         px-4 py-2.5 rounded-xl transition-all"
              style={{ backgroundColor: '#0a0a0a', border: '1px solid #C4A135' }}>
              <Mail size={14} />
              Combinar troca por email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
