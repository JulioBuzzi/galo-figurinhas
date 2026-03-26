'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Match } from '@/lib/types';
import api from '@/lib/api';
import {
  Users, Loader2, Phone, Shield, Search,
  Copy, Check, ChevronDown, ChevronUp,
  Pencil, Eye, EyeOff, CheckCircle
} from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  showPhone: boolean;
  userCode: string;
}

// Formata número BR enquanto digita
function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2)  return digits;
  if (digits.length <= 6)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}

export default function MatchesPage() {
  const [profile,    setProfile]    = useState<UserProfile | null>(null);
  const [targetCode, setTargetCode] = useState('');
  const [match,      setMatch]      = useState<Match | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState(false);
  const [expanded,   setExpanded]   = useState(false);

  // Estado do telefone
  const [editingPhone,  setEditingPhone]  = useState(false);
  const [phoneInput,    setPhoneInput]    = useState('');
  const [showPhone,     setShowPhone]     = useState(false);
  const [savingPhone,   setSavingPhone]   = useState(false);
  const [phoneSaved,    setPhoneSaved]    = useState(false);

  // Carrega perfil
  useEffect(() => {
    api.get('/api/users/me').then((r) => {
      setProfile(r.data);
      setShowPhone(r.data.showPhone);
      if (r.data.phone) {
        setPhoneInput(formatPhoneInput(r.data.phone));
      }
    }).catch(console.error);
  }, []);

  const handleCopyCode = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePhone = async () => {
    setSavingPhone(true);
    try {
      const digits = phoneInput.replace(/\D/g, '');
      const { data } = await api.patch('/api/users/me/phone', {
        phone: digits || null,
        showPhone,
      });
      setProfile(data);
      setPhoneSaved(true);
      setEditingPhone(false);
      setTimeout(() => setPhoneSaved(false), 2500);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao salvar telefone');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleToggleShow = async () => {
    const newVal = !showPhone;
    setShowPhone(newVal);
    try {
      const { data } = await api.patch('/api/users/me/phone', { showPhone: newVal });
      setProfile(data);
    } catch (err) {
      setShowPhone(!newVal); // reverte
    }
  };

  const handleSearch = async () => {
    const code = targetCode.trim().replace(/\D/g, '');
    if (!code) { setError('Digite o código do colecionador'); return; }
    if (profile && code === profile.userCode) {
      setError('Este é o seu próprio código!'); return;
    }
    setLoading(true);
    setError('');
    setMatch(null);
    setExpanded(false);
    try {
      const { data } = await api.get(`/api/matches/search?targetCode=${code}`);
      setMatch({
        ...data,
        theyHaveWhatINeed: data.theyHaveWhatINeed ?? [],
        iHaveWhatTheyNeed: data.iHaveWhatTheyNeed ?? [],
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Colecionador não encontrado. Verifique o código.');
    } finally {
      setLoading(false);
    }
  };

  const theyGiveMe = match?.theyHaveWhatINeed?.length ?? 0;
  const iGiveThem  = match?.iHaveWhatTheyNeed?.length ?? 0;
  const score      = match?.matchScore ?? 0;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

          {/* ───── SEU CÓDIGO ───── */}
          <div className="rounded-2xl p-5 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#C4A135' }}>
                <Shield className="text-galo-black" size={20} fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Matches de Troca</h1>
                <p className="text-white/40 text-xs">Busque outro colecionador pelo código</p>
              </div>
            </div>

            {/* Código */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
              <p className="text-white/50 text-xs mb-2 uppercase tracking-widest font-semibold">
                Seu código
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-4xl font-black text-galo-gold tracking-[0.2em]">
                  {profile?.userCode ?? '------'}
                </p>
                <button onClick={handleCopyCode}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                             transition-all border shrink-0"
                  style={copied
                    ? { backgroundColor: 'rgba(34,197,94,0.2)', borderColor: '#22c55e', color: '#22c55e' }
                    : { backgroundColor: 'rgba(196,161,53,0.15)', borderColor: 'rgba(196,161,53,0.5)', color: '#C4A135' }}>
                  {copied ? <><Check size={14}/> Copiado!</> : <><Copy size={14}/> Copiar</>}
                </button>
              </div>
              <p className="text-white/25 text-xs mt-2">Compartilhe este código para outros te encontrarem</p>
            </div>

            {/* Telefone */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                  Telefone (WhatsApp)
                </p>
                {!editingPhone && (
                  <button onClick={() => setEditingPhone(true)}
                    className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
                    style={{ color: '#C4A135', backgroundColor: 'rgba(196,161,53,0.1)' }}>
                    <Pencil size={11} />
                    {profile?.phone ? 'Editar' : 'Adicionar'}
                  </button>
                )}
              </div>

              {/* Exibe telefone salvo */}
              {!editingPhone && (
                <div>
                  {profile?.phone ? (
                    <div>
                      <p className="text-white font-bold text-lg">
                        {formatPhoneInput(profile.phone)}
                      </p>
                      {/* Toggle visibilidade */}
                      <button onClick={handleToggleShow}
                        className="flex items-center gap-2 mt-2 text-xs font-medium transition-all"
                        style={{ color: showPhone ? '#22c55e' : 'rgba(255,255,255,0.3)' }}>
                        {showPhone
                          ? <><Eye size={13}/> Visível para outros colecionadores</>
                          : <><EyeOff size={13}/> Oculto para outros colecionadores</>}
                      </button>
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm">
                      Nenhum telefone adicionado ainda.
                    </p>
                  )}
                  {phoneSaved && (
                    <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                      <CheckCircle size={12}/> Salvo com sucesso!
                    </p>
                  )}
                </div>
              )}

              {/* Formulário de edição */}
              {editingPhone && (
                <div className="space-y-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15}/>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(formatPhoneInput(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl
                                 text-white placeholder-white/25 text-sm focus:outline-none
                                 focus:border-galo-gold focus:ring-1 focus:ring-galo-gold"
                    />
                  </div>

                  {/* Toggle mostrar */}
                  <button type="button" onClick={() => setShowPhone(v => !v)}
                    className="flex items-center gap-2 text-xs font-medium w-full py-2 px-3
                               rounded-xl border transition-all"
                    style={showPhone
                      ? { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.4)', color: '#22c55e' }
                      : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                    {showPhone ? <Eye size={13}/> : <EyeOff size={13}/>}
                    {showPhone ? 'Visível para outros colecionadores' : 'Oculto para outros colecionadores'}
                  </button>

                  <div className="flex gap-2">
                    <button onClick={handleSavePhone} disabled={savingPhone}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                                 font-black text-sm transition-all disabled:opacity-50"
                      style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                      {savingPhone ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>}
                      Salvar
                    </button>
                    <button onClick={() => { setEditingPhone(false); setPhoneInput(profile?.phone ? formatPhoneInput(profile.phone) : ''); }}
                      className="px-4 py-2.5 rounded-xl font-bold text-sm border border-white/10
                                 text-white/40 hover:bg-white/5 transition-all">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ───── BUSCA ───── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <p className="font-black text-gray-900 mb-1">Buscar colecionador</p>
            <p className="text-gray-400 text-xs mb-4">
              Digite o código de 6 dígitos de outro colecionador.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetCode}
                onChange={(e) => setTargetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="000000"
                maxLength={6}
                className="flex-1 text-center text-2xl font-black tracking-[0.3em] py-3 px-4
                           border border-gray-200 rounded-xl focus:outline-none
                           focus:ring-2 focus:ring-yellow-400"
              />
              <button onClick={handleSearch} disabled={loading || targetCode.length < 1}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm
                           transition-all disabled:opacity-40 shrink-0"
                style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                {loading ? <Loader2 size={16} className="animate-spin"/> : <Search size={16}/>}
                {loading ? '' : 'Buscar'}
              </button>
            </div>
            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700
                              text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
          </div>

          {/* ───── RESULTADO ───── */}
          {match && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden fade-in">

              {/* Header do resultado */}
              <div className="p-5" style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center
                                  text-white font-black text-xl"
                       style={{ background: '#2a2a2a', border: '2px solid #C4A135' }}>
                    {match.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-white text-lg">{match.userName}</p>
                    <p className="text-white/40 text-xs">Código #{(match as any).userCode}</p>
                    {/* Telefone — só aparece se o usuário optou por mostrar */}
                    {(match as any).userPhone && (
                      <a href={`https://wa.me/55${(match as any).userPhone.replace(/\D/g,'')}`}
                         target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1.5 mt-1 text-xs font-bold transition-all"
                         style={{ color: '#25d366' }}>
                        <Phone size={12}/>
                        {(match as any).userPhone} · Chamar no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5">
                {score === 0 ? (
                  <div className="text-center py-8">
                    <Users size={40} className="mx-auto mb-3 text-gray-300"/>
                    <p className="font-bold text-gray-600">Nenhuma troca possível agora</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Nenhum de vocês tem repetidas que o outro precisa.
                      Continue marcando figurinhas e adicionando repetidas!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Contadores */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-4xl font-black text-green-600">{theyGiveMe}</p>
                        <p className="text-xs font-bold text-green-700 mt-1">Pode te dar</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          repetida disponível que você precisa
                        </p>
                      </div>
                      <div className="border rounded-xl p-4 text-center"
                           style={{ backgroundColor: 'rgba(196,161,53,0.08)', borderColor: 'rgba(196,161,53,0.35)' }}>
                        <p className="text-4xl font-black" style={{ color: '#C4A135' }}>{iGiveThem}</p>
                        <p className="text-xs font-bold mt-1" style={{ color: '#8a6f1e' }}>Você pode dar</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          sua repetida que esse colecionador precisa
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-center gap-2 mb-4 py-2.5
                                    rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-gray-500 text-sm">Total de trocas possíveis:</span>
                      <span className="text-xl font-black text-gray-900">★ {score}</span>
                    </div>

                    {/* Ver detalhes */}
                    <button onClick={() => setExpanded(v => !v)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                                 border border-gray-200 text-sm font-bold text-gray-600
                                 hover:bg-gray-50 transition-colors mb-4">
                      {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      {expanded ? 'Ocultar figurinhas' : 'Ver quais figurinhas'}
                    </button>

                    {expanded && (
                      <div className="space-y-4 mb-4 fade-in">
                        {theyGiveMe > 0 && (
                          <div>
                            <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-500"/>
                              Tem repetida e você precisa ({theyGiveMe})
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
                        {iGiveThem > 0 && (
                          <div>
                            <p className="text-xs font-bold mb-2 flex items-center gap-1.5"
                               style={{ color: '#8a6f1e' }}>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C4A135' }}/>
                              Você tem repetida e precisa ({iGiveThem})
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
                  </>
                )}
              </div>
            </div>
          )}

          {/* Estado inicial */}
          {!match && !loading && !error && (
            <div className="text-center py-10 text-gray-400">
              <Users size={44} className="mx-auto mb-3 opacity-20"/>
              <p className="font-bold text-gray-500">Pesquise um colecionador</p>
              <p className="text-sm mt-1">Digite o código de 6 dígitos para ver as trocas possíveis.</p>
            </div>
          )}

        </main>
      </div>
    </ProtectedLayout>
  );
}