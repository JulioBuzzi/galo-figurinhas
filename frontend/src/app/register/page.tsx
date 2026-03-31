'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { User, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }

const passwordRules = [
  { label: 'Mínimo 6 caracteres',  check: (p: string) => p.length >= 6 },
  { label: 'Pelo menos uma letra', check: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'Pelo menos um número', check: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [touched,  setTouched]  = useState({ email: false, password: false, confirm: false });

  const emailValid  = isValidEmail(email);
  const rulesOk     = passwordRules.every(r => r.check(password));
  const confirmOk   = password === confirm && confirm.length > 0;
  const canSubmit   = name.trim().length > 0 && emailValid && rulesOk && confirmOk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true, confirm: true });
    if (!canSubmit) return;
    setLoading(true);
    try {
      await api.post('/api/auth/register', { name, email, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}>
        <div className="w-full max-w-sm text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/40 rounded-2xl
                            flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-3">Conta criada! 🎉</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Enviamos um email de confirmação para <strong className="text-white">{email}</strong>.
              <br/><br/>
              Clique no link do email para ativar sua conta e começar a usar o FroSócios Figurinhas!
            </p>
            <p className="text-white/30 text-xs">
              Não recebeu? Verifique a pasta de spam.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}>
      <div className="absolute inset-0 opacity-5"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4A135 0, #C4A135 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20
                          bg-galo-gold rounded-2xl mb-4 shadow-2xl overflow-hidden">
            <Image src="/logo.png" alt="FroSócios" width={80} height={80}
                   className="object-cover w-full h-full"
                   onError={(e) => {
                     const img = e.target as HTMLImageElement;
                     img.style.display = 'none';
                     img.parentElement!.innerHTML = '<span style="font-size:40px">🐓</span>';
                   }} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">FroSócios</h1>
          <p className="text-galo-gold text-sm font-semibold mt-1 tracking-widest uppercase">Figurinhas 2026</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Criar conta</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              <XCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  required placeholder="Seu nome"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                             text-white placeholder-white/30 text-sm focus:outline-none
                             focus:border-galo-gold focus:ring-1 focus:ring-galo-gold" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="text" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="seu@email.com"
                  className={`w-full pl-10 pr-10 py-3 bg-white/10 rounded-xl text-white
                              placeholder-white/30 text-sm focus:outline-none transition-all border
                              ${touched.email && !emailValid && email.length > 0
                                ? 'border-red-500/60' : touched.email && emailValid
                                ? 'border-green-500/60' : 'border-white/20 focus:border-galo-gold'}`} />
                {touched.email && email.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValid ? <CheckCircle size={16} className="text-green-400" />
                                : <XCircle    size={16} className="text-red-400" />}
                  </div>
                )}
              </div>
              {touched.email && !emailValid && email.length > 0 && (
                <p className="text-red-400 text-xs mt-1.5">Email inválido</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  placeholder="Crie uma senha"
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl
                             text-white placeholder-white/30 text-sm focus:outline-none
                             focus:border-galo-gold focus:ring-1 focus:ring-galo-gold" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {(touched.password || password.length > 0) && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map(r => (
                    <div key={r.label} className="flex items-center gap-1.5">
                      {r.check(password) ? <CheckCircle size={12} className="text-green-400 shrink-0"/>
                                         : <XCircle    size={12} className="text-white/30 shrink-0"/>}
                      <span className={`text-xs ${r.check(password) ? 'text-green-400' : 'text-white/40'}`}>
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmar */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type={showConf ? 'text' : 'password'} value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                  placeholder="Repita a senha"
                  className={`w-full pl-10 pr-10 py-3 bg-white/10 rounded-xl text-white
                              placeholder-white/30 text-sm focus:outline-none transition-all border
                              ${touched.confirm && confirm.length > 0
                                ? confirmOk ? 'border-green-500/60' : 'border-red-500/60'
                                : 'border-white/20 focus:border-galo-gold'}`} />
                <button type="button" onClick={() => setShowConf(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showConf ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {touched.confirm && confirm.length > 0 && !confirmOk && (
                <p className="text-red-400 text-xs mt-1.5">As senhas não coincidem</p>
              )}
            </div>

            <button type="submit" disabled={loading || !canSubmit}
              className="w-full font-black py-3 rounded-xl transition-all text-sm tracking-wide mt-2
                         flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: canSubmit ? '#C4A135' : '#555', color: canSubmit ? '#0a0a0a' : '#888' }}>
              {loading ? <Loader2 size={18} className="animate-spin"/> : null}
              {loading ? 'Criando conta...' : 'CRIAR CONTA'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-5">
            Já tem conta?{' '}
            <Link href="/login" className="text-galo-gold font-semibold hover:text-galo-gold2">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
