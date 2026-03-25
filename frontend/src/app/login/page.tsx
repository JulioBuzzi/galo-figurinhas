'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/contexts/authStore';
import { Shield, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div className="min-h-screen bg-galo-black flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}>

      {/* Padrão de fundo */}
      <div className="absolute inset-0 opacity-5"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4A135 0, #C4A135 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20
                          bg-galo-gold rounded-2xl mb-4 shadow-2xl shadow-galo-gold/30">
            <Shield className="text-galo-black" size={40} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">GALO</h1>
          <p className="text-galo-gold text-sm font-semibold mt-1 tracking-widest uppercase">
            Figurinhas 2026
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Entrar na conta</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm
                            rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                             text-white placeholder-white/30 text-sm
                             focus:outline-none focus:border-galo-gold focus:ring-1 focus:ring-galo-gold
                             transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  required placeholder="••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                             text-white placeholder-white/30 text-sm
                             focus:outline-none focus:border-galo-gold focus:ring-1 focus:ring-galo-gold
                             transition-all"
                />
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-galo-gold hover:bg-galo-gold2 disabled:opacity-50
                         text-galo-black font-black py-3 rounded-xl transition-all
                         flex items-center justify-center gap-2 mt-2 shadow-lg shadow-galo-gold/20
                         text-sm tracking-wide"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLoading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-5">
            Não tem conta?{' '}
            <Link href="/register" className="text-galo-gold font-semibold hover:text-galo-gold2">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
