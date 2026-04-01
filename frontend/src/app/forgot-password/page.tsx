'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/contexts/authStore';
import { Mail, Copy, Check, ArrowLeft, Clock, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'galofigurinhas@gmail.com';

export default function ForgotPasswordPage() {
  const user = useAuthStore((s) => s.user);
  const [copied, setCopied] = useState(false);

  const accountEmail = user?.email ?? '(faça login para ver seu email)';

  const emailTemplate = `ASSUNTO: ESQUECI MINHA SENHA

Nome (que está no site): ${user?.name ?? 'Seu nome no site'}
Email da conta: ${accountEmail}
Senha nova: (coloque aqui a senha que deseja)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=ESQUECI%20MINHA%20SENHA&body=Nome%20(que%20est%C3%A1%20no%20site)%3A%20${encodeURIComponent(user?.name ?? '')}%0AEmail%20da%20conta%3A%20${encodeURIComponent(accountEmail)}%0ASenha%20nova%3A%20`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}>
      <div className="absolute inset-0 opacity-5"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4A135 0, #C4A135 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-galo-gold rounded-2xl mb-4 overflow-hidden">
            <Image src="/logo.png" alt="FroSócios" width={80} height={80}
                   className="object-cover w-full h-full"
                   onError={(e) => {
                     const t = e.target as HTMLImageElement;
                     t.style.display = 'none';
                     t.parentElement!.innerHTML = '<span style="font-size:40px">🐓</span>';
                   }} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">FroSócios</h1>
          <p className="text-galo-gold text-sm font-semibold mt-1 tracking-widest uppercase">Figurinhas 2026</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

          <div>
            <h2 className="text-xl font-black text-white mb-1">Esqueci minha senha</h2>
            <p className="text-white/50 text-sm">
              A redefinição de senha é feita manualmente pelo administrador.
            </p>
          </div>

          {/* Aviso de prazo */}
          <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30
                          rounded-xl p-4">
            <Clock size={18} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-yellow-200 text-sm leading-relaxed">
              Envie um email para o administrador com o modelo abaixo.
              O processo pode levar <strong>até 24 horas</strong>.
            </p>
          </div>

          {/* Email da conta */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">
              ⚠️ Importante
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              O email deve ser enviado <strong className="text-white">pelo mesmo email cadastrado na sua conta</strong>:
            </p>
            <div className="mt-2 bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
              <Shield size={14} style={{ color: '#C4A135' }} />
              <span className="text-galo-gold font-bold text-sm font-mono">{accountEmail}</span>
            </div>
          </div>

          {/* Template */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">
              Modelo do email
            </p>
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm
                            text-white/80 whitespace-pre-line leading-relaxed">
              {emailTemplate}
            </div>

            <div className="flex gap-2 mt-3">
              {/* Copiar */}
              <button onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                           font-bold text-sm transition-all border"
                style={copied
                  ? { backgroundColor: 'rgba(34,197,94,0.2)', borderColor: '#22c55e', color: '#22c55e' }
                  : { backgroundColor: 'rgba(196,161,53,0.15)', borderColor: 'rgba(196,161,53,0.5)', color: '#C4A135' }}>
                {copied ? <><Check size={14}/> Copiado!</> : <><Copy size={14}/> Copiar modelo</>}
              </button>

              {/* Abrir email */}
              <a href={mailtoLink}
                 className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                            font-bold text-sm transition-all"
                 style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                <Mail size={14}/> Abrir email
              </a>
            </div>
          </div>

          {/* Destino */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-white/40 text-xs mb-1 uppercase tracking-widest">Enviar para</p>
            <p className="text-galo-gold font-black text-lg">{ADMIN_EMAIL}</p>
          </div>

          <div className="text-center">
            <Link href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft size={14}/> Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}