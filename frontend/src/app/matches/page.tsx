'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Match } from '@/lib/types';
import { useAuthStore } from '@/contexts/authStore';
import api from '@/lib/api';
import { Users, Loader2, Mail, Shield, Search, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function MatchesPage() {
  const user = useAuthStore((s) => s.user);

  const [targetId, setTargetId]   = useState('');
  const [match,    setMatch]      = useState<Match | null>(null);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState('');
  const [copied,   setCopied]     = useState(false);
  const [expanded, setExpanded]   = useState(false);

  const handleCopyId = () => {
    if (!user) return;
    navigator.clipboard.writeText(String(user.userId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = async () => {
    if (!targetId.trim()) return;
    const id = Number(targetId.trim());
    if (isNaN(id) || id <= 0) {
      setError('Digite um ID válido (número inteiro positivo)');
      return;
    }
    setLoading(true);
    setError('');
    setMatch(null);
    setExpanded(false);
    try {
      const { data } = await api.get(`/api/matches/search?targetUserId=${id}`);
      setMatch(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Usuário não encontrado. Verifique o ID.');
    } finally {
      setLoading(false);
    }
  };

  const theyGiveMe = match?.theyHaveWhatINeed.length ?? 0;
  const iGiveThem  = match?.iHaveWhatTheyNeed.length ?? 0;
  const score      = match?.matchScore ?? 0;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6">

          {/* SEU ID */}
          <div className="rounded-2xl p-5 mb-5 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#C4A135' }}>
                <Shield className="text-galo-black" size={20} fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Matches de Troca</h1>
                <p className="text-white/40 text-xs">Pesquise outro colecionador pelo ID</p>
              </div>
            </div>

            {/* Card do ID */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/50 text-xs mb-2 uppercase tracking-widest font-semibold">
                Seu ID para compartilhar
              </p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-4xl font-black text-galo-gold tracking-widest">
                    #{user?.userId}
                  </p>
                  <p className="text-white/30 text-xs mt-1">
                    Compartilhe este código com outros colecionadores
                  </p>
                </div>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                             transition-all border shrink-0"
                  style={copied
                    ? { backgroundColor: 'rgba(34,197,94,0.2)', borderColor: '#22c55e', color: '#22c55e' }
                    : { backgroundColor: 'rgba(196,161,53,0.15)', borderColor: 'rgba(196,161,53,0.5)', color: '#C4A135' }
                  }>
                  {copied
                    ? <><Check size={14} /> Copiado!</>
                    : <><Copy size={14} /> Copiar ID</>}
                </button>
              </div>
            </div>
          </div>

          {/* BUSCA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">
            <p className="font-black text-gray-900 mb-1">Buscar colecionador</p>
            <p className="text-gray-400 text-xs mb-4">
              Digite o ID de outro colecionador para ver quantas figurinhas vocês podem trocar.
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">#</span>
                <input
                  type="number"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Digite o ID do colecionador"
                  min={1}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-yellow-400
                             [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                             [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !targetId.trim()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm
                           transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Search size={16} />}
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700
                              text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
          </div>

          {/* RESULTADO */}
          {match && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden fade-in">

              {/* Header do resultado */}
              <div className="p-5 border-b border-gray-100"
                   style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center
                                  text-white font-black text-xl"
                       style={{ background: '#2a2a2a', border: '2px solid #C4A135' }}>
                    {match.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-white text-lg">{match.userName}</p>
                    <p className="text-white/40 text-xs">ID #{match.userId} · {match.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Resumo de trocas */}
              <div className="p-5">
                {score === 0 ? (
                  <div className="text-center py-6">
                    <Users size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-bold text-gray-600">Nenhuma troca possível</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Vocês não têm repetidas que o outro precisa no momento.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Cards de contagem */}
                    <div className="grid grid-cols-2 gap-3 mb-4">

                      {/* Eles dão para mim */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-4xl font-black text-green-600">{theyGiveMe}</p>
                        <p className="text-xs font-bold text-green-700 mt-1">Eles podem te dar</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          repetidas deles que você precisa
                        </p>
                      </div>

                      {/* Eu dou para eles */}
                      <div className="border rounded-xl p-4 text-center"
                           style={{ backgroundColor: 'rgba(196,161,53,0.08)', borderColor: 'rgba(196,161,53,0.35)' }}>
                        <p className="text-4xl font-black" style={{ color: '#C4A135' }}>{iGiveThem}</p>
                        <p className="text-xs font-bold mt-1" style={{ color: '#8a6f1e' }}>Você pode dar</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          repetidas suas que eles precisam
                        </p>
                      </div>
                    </div>

                    {/* Score total */}
                    <div className="flex items-center justify-center gap-2 mb-4
                                    py-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-gray-500 text-sm">Score total:</span>
                      <span className="text-xl font-black text-gray-900">★ {score} trocas possíveis</span>
                    </div>

                    {/* Detalhe das figurinhas */}
                    <button
                      onClick={() => setExpanded(v => !v)}
                      className="w-full flex items-center justify-center gap-2 py-2.5
                                 rounded-xl border border-gray-200 text-sm font-bold
                                 text-gray-600 hover:bg-gray-50 transition-colors mb-4">
                      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {expanded ? 'Ocultar detalhes' : 'Ver quais figurinhas'}
                    </button>

                    {expanded && (
                      <div className="space-y-4 fade-in">

                        {/* Figurinhas que eles dão */}
                        {theyGiveMe > 0 && (
                          <div>
                            <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-500"/>
                              Eles têm repetida e você precisa ({theyGiveMe})
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

                        {/* Figurinhas que eu dou */}
                        {iGiveThem > 0 && (
                          <div>
                            <p className="text-xs font-bold mb-2 flex items-center gap-1.5"
                               style={{ color: '#8a6f1e' }}>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C4A135' }}/>
                              Você tem repetida e eles precisam ({iGiveThem})
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
                      </div>
                    )}

                    {/* Botão de contato */}
                    <a href={`mailto:${match.userEmail}?subject=Troca de figurinhas - Galo 2026&body=Olá ${match.userName}! Encontrei seu perfil no Galo Figurinhas (ID #${match.userId}). Podemos trocar: você tem ${theyGiveMe} figurinha(s) que preciso e eu tenho ${iGiveThem} que você precisa!`}
                       className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                                  font-black text-sm transition-all border"
                       style={{ backgroundColor: '#0a0a0a', borderColor: '#C4A135', color: '#C4A135' }}>
                      <Mail size={16} />
                      Combinar troca por email
                    </a>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Instrução inicial */}
          {!match && !loading && !error && (
            <div className="text-center py-12 text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-bold text-gray-500">Pesquise um colecionador</p>
              <p className="text-sm mt-1">
                Digite o ID de outro usuário para ver quantas<br/>figurinhas vocês podem trocar entre si.
              </p>
            </div>
          )}

        </main>
      </div>
    </ProtectedLayout>
  );
}