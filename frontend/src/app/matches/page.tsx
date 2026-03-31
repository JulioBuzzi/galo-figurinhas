'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Match } from '@/lib/types';
import api from '@/lib/api';
import {
<<<<<<< HEAD
  Users, Loader2, Phone, Shield, Search,
=======
  Users, Loader2, Phone, Search,
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  Copy, Check, ChevronDown, ChevronUp,
  Pencil, Eye, EyeOff, CheckCircle, ArrowLeftRight, X
} from 'lucide-react';

interface UserProfile {
  id: number; name: string; email: string;
  phone: string | null; showPhone: boolean; userCode: string;
}

function fmtPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2)  return d;
  if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

export default function MatchesPage() {
  const [profile,    setProfile]    = useState<UserProfile | null>(null);
  const [targetCode, setTargetCode] = useState('');
  const [match,      setMatch]      = useState<Match | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState(false);
  const [expanded,   setExpanded]   = useState(false);
  const [showTrade,  setShowTrade]  = useState(false);

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput,   setPhoneInput]   = useState('');
  const [showPhone,    setShowPhone]    = useState(false);
  const [savingPhone,  setSavingPhone]  = useState(false);
  const [phoneSaved,   setPhoneSaved]   = useState(false);

  const [selReceived,  setSelReceived]  = useState<Set<number>>(new Set());
  const [selGiven,     setSelGiven]     = useState<Set<number>>(new Set());
  const [confirming,   setConfirming]   = useState(false);
  const [tradeDone,    setTradeDone]    = useState(false);

  useEffect(() => {
    api.get('/api/users/me').then((r) => {
      setProfile(r.data);
      setShowPhone(r.data.showPhone);
      if (r.data.phone) setPhoneInput(fmtPhone(r.data.phone));
    }).catch(console.error);
  }, []);

  const copyCode = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.userCode);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const savePhone = async () => {
    setSavingPhone(true);
    try {
      const digits = phoneInput.replace(/\D/g, '');
      const { data } = await api.patch('/api/users/me/phone', { phone: digits || null, showPhone });
      setProfile(data); setPhoneSaved(true); setEditingPhone(false);
      setTimeout(() => setPhoneSaved(false), 2500);
    } catch (e: any) { alert(e.response?.data?.error || 'Erro ao salvar'); }
    finally { setSavingPhone(false); }
  };

  const toggleShowPhone = async () => {
    const nv = !showPhone; setShowPhone(nv);
    try { const { data } = await api.patch('/api/users/me/phone', { showPhone: nv }); setProfile(data); }
    catch { setShowPhone(!nv); }
  };

  const search = async () => {
    const code = targetCode.trim();
    if (code.length !== 6) { setError('O código deve ter exatamente 6 dígitos'); return; }
    if (profile && code === profile.userCode) { setError('Este é o seu próprio código!'); return; }
    setLoading(true); setError(''); setMatch(null);
    setExpanded(false); setShowTrade(false); setTradeDone(false);
    setSelReceived(new Set()); setSelGiven(new Set());
    try {
      const { data } = await api.get(`/api/matches/search?targetCode=${code}`);
      setMatch({ ...data, theyHaveWhatINeed: data.theyHaveWhatINeed ?? [], iHaveWhatTheyNeed: data.iHaveWhatTheyNeed ?? [] });
    } catch (e: any) { setError(e.response?.data?.error || 'Colecionador não encontrado.'); }
    finally { setLoading(false); }
  };

  const confirmTrade = async () => {
    if (!match || (selReceived.size === 0 && selGiven.size === 0)) {
      alert('Selecione pelo menos uma figurinha.'); return;
    }
    setConfirming(true);
    try {
      await api.post('/api/matches/confirm-trade', {
        targetUserId: match.userId,
        receivedStickerIds: Array.from(selReceived),
        givenStickerIds: Array.from(selGiven),
      });
      setTradeDone(true); setShowTrade(false);
      const { data } = await api.get(`/api/matches/search?targetCode=${targetCode.trim()}`);
      setMatch({ ...data, theyHaveWhatINeed: data.theyHaveWhatINeed ?? [], iHaveWhatTheyNeed: data.iHaveWhatTheyNeed ?? [] });
      setSelReceived(new Set()); setSelGiven(new Set());
    } catch (e: any) { alert(e.response?.data?.error || 'Erro ao registrar troca'); }
    finally { setConfirming(false); }
  };

  const toggle = (set: Set<number>, setFn: (s: Set<number>) => void, id: number) => {
    const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); setFn(n);
  };

  const canReceive = match?.theyHaveWhatINeed?.length ?? 0;
  const canOffer   = match?.iHaveWhatTheyNeed?.length ?? 0;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

          {/* ── SEU CÓDIGO + TELEFONE ── */}
          <div className="rounded-2xl p-5 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)' }}>
            <div className="flex items-center gap-3 mb-4">
<<<<<<< HEAD
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#C4A135' }}>
                <Shield className="text-galo-black" size={20} fill="currentColor" />
=======
              <div className="w-10 h-10 rounded-xl overflow-hidden"
                   style={{ backgroundColor: '#C4A135' }}>
                <img src="/logo.png" alt="FroSócios" className="w-full h-full object-cover"
                     onError={(e: any) => { e.target.style.display="none"; }} />
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Matches de Troca</h1>
                <p className="text-white/40 text-xs">Busque outro colecionador pelo código</p>
              </div>
            </div>

            {/* Código */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
              <p className="text-white/50 text-xs mb-2 uppercase tracking-widest font-semibold">Seu código único</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-4xl font-black text-galo-gold tracking-[0.25em]">
                  {profile?.userCode ?? '------'}
                </p>
                <button onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border shrink-0"
                  style={copied
                    ? { backgroundColor: 'rgba(34,197,94,0.2)', borderColor: '#22c55e', color: '#22c55e' }
                    : { backgroundColor: 'rgba(196,161,53,0.15)', borderColor: 'rgba(196,161,53,0.5)', color: '#C4A135' }}>
                  {copied ? <><Check size={14}/> Copiado!</> : <><Copy size={14}/> Copiar</>}
                </button>
              </div>
              <p className="text-white/25 text-xs mt-2">Compartilhe com outros colecionadores</p>
            </div>

            {/* Telefone */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Telefone (WhatsApp)</p>
                {!editingPhone && (
                  <button onClick={() => setEditingPhone(true)}
                    className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ color: '#C4A135', backgroundColor: 'rgba(196,161,53,0.1)' }}>
                    <Pencil size={11}/> {profile?.phone ? 'Editar' : 'Adicionar'}
                  </button>
                )}
              </div>
              {!editingPhone && (
                <div>
                  {profile?.phone
                    ? <>
                        <p className="text-white font-bold text-lg">{fmtPhone(profile.phone)}</p>
                        <button onClick={toggleShowPhone}
                          className="flex items-center gap-2 mt-1.5 text-xs font-medium"
                          style={{ color: showPhone ? '#22c55e' : 'rgba(255,255,255,0.3)' }}>
                          {showPhone ? <><Eye size={13}/> Visível para outros</> : <><EyeOff size={13}/> Oculto</>}
                        </button>
                      </>
                    : <p className="text-white/30 text-sm">Nenhum telefone adicionado.</p>}
                  {phoneSaved && <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1"><CheckCircle size={12}/> Salvo!</p>}
                </div>
              )}
              {editingPhone && (
                <div className="space-y-2.5 mt-2">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15}/>
                    <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(fmtPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl
                                 text-white placeholder-white/25 text-sm focus:outline-none focus:border-galo-gold" />
                  </div>
                  <button onClick={() => setShowPhone(v => !v)}
                    className="flex items-center gap-2 text-xs font-medium w-full py-2 px-3 rounded-xl border"
                    style={showPhone
                      ? { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.4)', color: '#22c55e' }
                      : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                    {showPhone ? <><Eye size={13}/> Visível</> : <><EyeOff size={13}/> Oculto</>}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={savePhone} disabled={savingPhone}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm disabled:opacity-50"
                      style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                      {savingPhone ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Salvar
                    </button>
                    <button onClick={() => setEditingPhone(false)}
                      className="px-4 py-2.5 rounded-xl font-bold text-sm border border-white/10 text-white/40">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── BUSCA ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <p className="font-black text-gray-900 mb-1">Buscar colecionador</p>
            <p className="text-gray-400 text-xs mb-4">Digite o código de 6 dígitos de outro colecionador.</p>
            <div className="flex gap-2">
              <input type="text" value={targetCode}
                onChange={(e) => setTargetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="000000" maxLength={6}
                className="flex-1 text-center text-2xl font-black tracking-[0.3em] py-3 px-4
                           border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <button onClick={search} disabled={loading || targetCode.length < 6}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-40 shrink-0"
                style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                {loading ? <Loader2 size={16} className="animate-spin"/> : <Search size={16}/>}
                {loading ? '' : 'Buscar'}
              </button>
            </div>
            {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: '#C4A135' }}/>
              <p className="font-bold text-gray-700">Calculando trocas possíveis...</p>
              <p className="text-xs text-gray-400 mt-1">Comparando álbuns e repetidas</p>
            </div>
          )}

          {/* ── RESULTADO ── */}
          {!loading && match && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden fade-in">
              <div className="p-5" style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl"
                       style={{ background: '#2a2a2a', border: '2px solid #C4A135' }}>
                    {match.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-white text-lg">{match.userName}</p>
                    <p className="text-white/40 text-xs">Código {(match as any).userCode}</p>
                    {(match as any).userPhone && (
                      <a href={`https://wa.me/55${(match as any).userPhone.replace(/\D/g,'')}`}
                         target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1.5 mt-1 text-xs font-bold"
                         style={{ color: '#25d366' }}>
                        <Phone size={12}/> {(match as any).userPhone} · WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {tradeDone && (
                <div className="mx-5 mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <CheckCircle size={16}/> Troca registrada! Álbum atualizado.
                </div>
              )}

              <div className="p-5">
                {canReceive === 0 && canOffer === 0 ? (
                  <div className="text-center py-8">
                    <Users size={40} className="mx-auto mb-3 text-gray-300"/>
                    <p className="font-bold text-gray-600">Nenhuma troca possível agora</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Adicione repetidas no álbum e tente novamente.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* ─ Contadores ─ */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Pode receber */}
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                        <p className="text-5xl font-black text-green-600 leading-none">{canReceive}</p>
                        <p className="text-sm font-black text-green-700 mt-2">
                          {canReceive === 1 ? 'figurinha' : 'figurinhas'}
                        </p>
                        <p className="text-xs text-green-600 mt-0.5 font-medium">que você pode RECEBER</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          ele tem repetida e você não tem
                        </p>
                      </div>
                      {/* Pode oferecer */}
                      <div className="border-2 rounded-xl p-4 text-center"
                           style={{ backgroundColor: 'rgba(196,161,53,0.08)', borderColor: '#C4A135' }}>
                        <p className="text-5xl font-black leading-none" style={{ color: '#C4A135' }}>{canOffer}</p>
                        <p className="text-sm font-black mt-2" style={{ color: '#8a6f1e' }}>
                          {canOffer === 1 ? 'figurinha' : 'figurinhas'}
                        </p>
                        <p className="text-xs mt-0.5 font-medium" style={{ color: '#8a6f1e' }}>
                          que você pode OFERECER
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          você tem repetida e ele não tem
                        </p>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-2 mb-3">
                      <button onClick={() => setExpanded(v => !v)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                                   border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
                        {expanded ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
                        {expanded ? 'Ocultar lista' : 'Ver quais figurinhas'}
                      </button>
                      {(canReceive > 0 || canOffer > 0) && (
                        <button onClick={() => { setShowTrade(true); setExpanded(false); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                                     border text-sm font-black transition-all"
                          style={{ backgroundColor: '#0a0a0a', borderColor: '#C4A135', color: '#C4A135' }}>
                          <ArrowLeftRight size={14}/> Registrar Troca
                        </button>
                      )}
                    </div>

                    {/* Lista expandida */}
                    {expanded && (
                      <div className="space-y-4 fade-in">
                        {canReceive > 0 && (
                          <div>
                            <p className="text-xs font-black text-green-700 mb-2 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>
                              Você pode RECEBER ({canReceive}) — ele tem repetida, você não tem
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {match.theyHaveWhatINeed.map((s) => (
                                <span key={s.id}
                                  className="bg-green-100 border border-green-300 text-green-800 text-xs px-2.5 py-1 rounded-full font-mono font-bold">
                                  {s.code}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {canOffer > 0 && (
                          <div>
                            <p className="text-xs font-black mb-2 flex items-center gap-1.5"
                               style={{ color: '#8a6f1e' }}>
                              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#C4A135' }}/>
                              Você pode OFERECER ({canOffer}) — você tem repetida, ele não tem
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

          {/* Estado vazio */}
          {!loading && !match && !error && (
            <div className="text-center py-10 text-gray-400">
              <Users size={44} className="mx-auto mb-3 opacity-20"/>
              <p className="font-bold text-gray-500">Pesquise um colecionador</p>
              <p className="text-sm mt-1">Digite o código de 6 dígitos para ver as trocas possíveis.</p>
            </div>
          )}
        </main>

        {/* ── MODAL REGISTRAR TROCA ── */}
        {showTrade && match && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
               onClick={() => setShowTrade(false)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                 onClick={(e) => e.stopPropagation()}>

              <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-black text-gray-900 flex items-center gap-2">
                    <ArrowLeftRight size={18} style={{ color: '#C4A135' }}/>
                    Registrar Troca com {match.userName}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Selecione as figurinhas que serão trocadas</p>
                </div>
                <button onClick={() => setShowTrade(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={18}/>
                </button>
              </div>

              <div className="p-5 space-y-6">

                {/* Vou RECEBER */}
                {canReceive > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-black text-green-700 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"/>
                          Vou receber
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {selReceived.size} de {canReceive} selecionadas
                        </p>
                      </div>
                      <button onClick={() => selReceived.size === canReceive
                          ? setSelReceived(new Set())
                          : setSelReceived(new Set(match.theyHaveWhatINeed.map(s => s.id)))}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' }}>
                        {selReceived.size === canReceive ? 'Desmarcar tudo' : 'Marcar tudo'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match.theyHaveWhatINeed.map((s) => {
                        const sel = selReceived.has(s.id);
                        return (
                          <button key={s.id} onClick={() => toggle(selReceived, setSelReceived, s.id)}
                            className="text-xs px-3 py-1.5 rounded-full font-mono font-bold border-2 transition-all"
                            style={sel
                              ? { backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white' }
                              : { backgroundColor: '#f0fdf4', borderColor: '#86efac', color: '#166534' }}>
                            {sel && '✓ '}{s.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {canReceive > 0 && canOffer > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200"/>
                    <ArrowLeftRight size={14} className="text-gray-400"/>
                    <div className="flex-1 h-px bg-gray-200"/>
                  </div>
                )}

                {/* Vou OFERECER */}
                {canOffer > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-black flex items-center gap-1.5"
                           style={{ color: '#8a6f1e' }}>
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#C4A135' }}/>
                          Vou oferecer (dar)
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {selGiven.size} de {canOffer} selecionadas
                        </p>
                      </div>
                      <button onClick={() => selGiven.size === canOffer
                          ? setSelGiven(new Set())
                          : setSelGiven(new Set(match.iHaveWhatTheyNeed.map(s => s.id)))}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ color: '#C4A135', backgroundColor: 'rgba(196,161,53,0.1)' }}>
                        {selGiven.size === canOffer ? 'Desmarcar tudo' : 'Marcar tudo'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match.iHaveWhatTheyNeed.map((s) => {
                        const sel = selGiven.has(s.id);
                        return (
                          <button key={s.id} onClick={() => toggle(selGiven, setSelGiven, s.id)}
                            className="text-xs px-3 py-1.5 rounded-full font-mono font-bold border-2 transition-all"
                            style={sel
                              ? { backgroundColor: '#C4A135', borderColor: '#C4A135', color: '#0a0a0a' }
                              : { backgroundColor: 'rgba(196,161,53,0.08)', borderColor: 'rgba(196,161,53,0.4)', color: '#8a6f1e' }}>
                            {sel && '✓ '}{s.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Resumo */}
                {(selReceived.size > 0 || selGiven.size > 0) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1 text-xs text-gray-600">
                    {selReceived.size > 0 && (
                      <p>✅ <strong>{selReceived.size}</strong> figurinha(s) serão adicionadas ao seu álbum</p>
                    )}
                    {selGiven.size > 0 && (
                      <p>📤 <strong>{selGiven.size}</strong> repetida(s) serão removidas do seu álbum</p>
                    )}
                  </div>
                )}

                <button onClick={confirmTrade}
                  disabled={confirming || (selReceived.size === 0 && selGiven.size === 0)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                             font-black text-sm transition-all disabled:opacity-40"
                  style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                  {confirming
                    ? <><Loader2 size={16} className="animate-spin"/> Registrando...</>
                    : <><Check size={16}/> Confirmar Troca ({selReceived.size + selGiven.size} figurinha{selReceived.size + selGiven.size !== 1 ? 's' : ''})</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
