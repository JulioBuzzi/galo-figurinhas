'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setError('Digite um email válido'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao enviar email');
    } finally { setLoading(false); }
  };

  return (
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
          {sent ? (
            <div className="text-center">
              <CheckCircle size={40} className="mx-auto mb-4 text-green-400" />
              <h2 className="text-xl font-black text-white mb-3">Email enviado!</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Se o email <strong className="text-white">{email}</strong> estiver cadastrado,
                você receberá um link para redefinir sua senha em breve.
              </p>
              <p className="text-white/30 text-xs mb-4">Verifique também a pasta de spam.</p>
              <Link href="/login"
                className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-5 rounded-xl"
                style={{ color: '#C4A135', border: '1px solid rgba(196,161,53,0.3)' }}>
                <ArrowLeft size={14}/> Voltar ao login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Esqueci a senha</h2>
              <p className="text-white/50 text-sm mb-6">
                Digite seu email e enviaremos um link para criar uma nova senha.
              </p>
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16}/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      required placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                                 text-white placeholder-white/30 text-sm focus:outline-none
                                 focus:border-galo-gold focus:ring-1 focus:ring-galo-gold" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                  {loading ? <Loader2 size={16} className="animate-spin"/> : <Mail size={16}/>}
                  {loading ? 'Enviando...' : 'ENVIAR LINK'}
                </button>
              </form>
              <div className="text-center mt-4">
                <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-white/60">
                  <ArrowLeft size={12}/> Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
