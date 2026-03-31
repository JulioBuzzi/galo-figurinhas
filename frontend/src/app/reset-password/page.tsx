'use client';

<<<<<<< HEAD
=======
import { Suspense } from 'react';
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Lock, Loader2, CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react';

const rules = [
  { label: 'Mínimo 6 caracteres',  check: (p: string) => p.length >= 6 },
  { label: 'Pelo menos uma letra', check: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'Pelo menos um número', check: (p: string) => /[0-9]/.test(p) },
];

<<<<<<< HEAD
export default function ResetPasswordPage() {
=======
function ResetPasswordContent() {
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  const router  = useRouter();
  const params  = useSearchParams();
  const token   = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showP,    setShowP]    = useState(false);
  const [showC,    setShowC]    = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const rulesOk   = rules.every(r => r.check(password));
  const confirmOk = password === confirm && confirm.length > 0;
  const canSubmit = rulesOk && confirmOk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true); setError('');
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Token inválido ou expirado.');
    } finally { setLoading(false); }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #0a0a0a, #1a1a1a)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-galo-gold rounded-2xl mb-4 overflow-hidden">
            <Image src="/logo.png" alt="FroSócios" width={80} height={80} className="object-cover"
                   onError={(e) => { (e.target as any).style.display='none'; }} />
          </div>
          <h1 className="text-3xl font-black text-white">FroSócios</h1>
          <p className="text-galo-gold text-sm font-semibold mt-1 tracking-widest uppercase">Figurinhas 2026</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {success ? (
            <div className="text-center">
              <CheckCircle size={40} className="mx-auto mb-4 text-green-400" />
              <h2 className="text-xl font-black text-white mb-2">Senha redefinida! ✅</h2>
              <p className="text-white/60 text-sm">Redirecionando para o login...</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Nova senha</h2>
              <p className="text-white/50 text-sm mb-6">Crie uma nova senha para sua conta.</p>
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <XCircle size={15}/> {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16}/>
                    <input type={showP ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="Nova senha"
                      className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl
                                 text-white placeholder-white/30 text-sm focus:outline-none
                                 focus:border-galo-gold focus:ring-1 focus:ring-galo-gold" />
                    <button type="button" onClick={() => setShowP(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showP ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {rules.map(r => (
                        <div key={r.label} className="flex items-center gap-1.5">
                          {r.check(password) ? <CheckCircle size={12} className="text-green-400 shrink-0"/>
                                             : <XCircle    size={12} className="text-white/30 shrink-0"/>}
                          <span className={`text-xs ${r.check(password) ? 'text-green-400' : 'text-white/40'}`}>{r.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Confirmar senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16}/>
                    <input type={showC ? 'text' : 'password'} value={confirm}
                      onChange={(e) => setConfirm(e.target.value)} placeholder="Repita a senha"
                      className={`w-full pl-10 pr-10 py-3 bg-white/10 rounded-xl text-white
                                  placeholder-white/30 text-sm focus:outline-none transition-all border
                                  ${confirm.length > 0 ? confirmOk ? 'border-green-500/60' : 'border-red-500/60'
                                    : 'border-white/20 focus:border-galo-gold'}`} />
                    <button type="button" onClick={() => setShowC(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showC ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading || !canSubmit}
                  className="w-full font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ backgroundColor: canSubmit ? '#C4A135' : '#555', color: canSubmit ? '#0a0a0a' : '#888' }}>
                  {loading ? <Loader2 size={16} className="animate-spin"/> : null}
                  {loading ? 'Salvando...' : 'SALVAR NOVA SENHA'}
                </button>
              </form>
              <div className="text-center mt-4">
                <Link href="/login" className="text-xs text-white/40 hover:text-white/60">
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
=======
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20
                        bg-galo-gold rounded-2xl mb-4 overflow-hidden">
          <Image src="/logo.png" alt="FroSócios" width={80} height={80}
                 className="object-cover w-full h-full"
                 onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <h1 className="text-3xl font-black text-white">FroSócios</h1>
        <p className="text-galo-gold text-sm font-semibold mt-1 tracking-widest uppercase">Figurinhas 2026</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        {success ? (
          <div className="text-center">
            <CheckCircle size={40} className="mx-auto mb-4 text-green-400" />
            <h2 className="text-xl font-black text-white mb-2">Senha redefinida! ✅</h2>
            <p className="text-white/60 text-sm">Redirecionando para o login...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-2">Nova senha</h2>
            <p className="text-white/50 text-sm mb-6">Crie uma nova senha para sua conta.</p>
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm
                              rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <XCircle size={15}/> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Nova senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16}/>
                  <input type={showP ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Nova senha"
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl
                               text-white placeholder-white/30 text-sm focus:outline-none
                               focus:border-galo-gold focus:ring-1 focus:ring-galo-gold" />
                  <button type="button" onClick={() => setShowP(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showP ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {rules.map(r => (
                      <div key={r.label} className="flex items-center gap-1.5">
                        {r.check(password)
                          ? <CheckCircle size={12} className="text-green-400 shrink-0"/>
                          : <XCircle    size={12} className="text-white/30 shrink-0"/>}
                        <span className={`text-xs ${r.check(password) ? 'text-green-400' : 'text-white/40'}`}>
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16}/>
                  <input type={showC ? 'text' : 'password'} value={confirm}
                    onChange={(e) => setConfirm(e.target.value)} placeholder="Repita a senha"
                    className={`w-full pl-10 pr-10 py-3 bg-white/10 rounded-xl text-white
                                placeholder-white/30 text-sm focus:outline-none transition-all border
                                ${confirm.length > 0
                                  ? confirmOk ? 'border-green-500/60' : 'border-red-500/60'
                                  : 'border-white/20 focus:border-galo-gold'}`} />
                  <button type="button" onClick={() => setShowC(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showC ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading || !canSubmit}
                className="w-full font-black py-3 rounded-xl text-sm flex items-center
                           justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: canSubmit ? '#C4A135' : '#555',
                         color: canSubmit ? '#0a0a0a' : '#888' }}>
                {loading ? <Loader2 size={16} className="animate-spin"/> : null}
                {loading ? 'Salvando...' : 'SALVAR NOVA SENHA'}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link href="/login" className="text-xs text-white/40 hover:text-white/60">
                Voltar ao login
              </Link>
            </div>
          </>
        )}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #0a0a0a, #1a1a1a)' }}>
      <Suspense fallback={
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-galo-gold mx-auto mb-3" />
          <p className="text-white/50 text-sm">Carregando...</p>
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
