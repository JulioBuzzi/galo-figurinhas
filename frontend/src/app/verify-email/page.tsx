'use client';

<<<<<<< HEAD
=======
import { Suspense } from 'react';
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
<<<<<<< HEAD
import { useAuthStore } from '@/contexts/authStore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router       = useRouter();
  const params       = useSearchParams();
  const { login: storeUser } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
=======
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const router  = useRouter();
  const params  = useSearchParams();
  const [status,  setStatus]  = useState<'loading' | 'success' | 'error'>('loading');
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); setMessage('Token inválido.'); return; }

<<<<<<< HEAD
    api.post(`/api/auth/verify-email?token=${token}`)
      .then(({ data }) => {
        // Salva sessão
=======
    api.get(`/api/auth/verify-email?token=${token}`)
      .then(({ data }) => {
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
        localStorage.setItem('copa_token', data.token);
        localStorage.setItem('copa_user', JSON.stringify(data));
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 2500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Token inválido ou já utilizado.');
      });
  }, []);

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #0a0a0a, #1a1a1a)' }}>
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-galo-gold rounded-2xl mb-6 overflow-hidden">
          <Image src="/logo.png" alt="FroSócios" width={80} height={80} className="object-cover"
                 onError={(e) => { (e.target as any).style.display='none'; }} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {status === 'loading' && (
            <>
              <Loader2 size={40} className="animate-spin mx-auto mb-4 text-galo-gold" />
              <p className="text-white font-bold">Verificando seu email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle size={40} className="mx-auto mb-4 text-green-400" />
              <h2 className="text-xl font-black text-white mb-2">Email verificado! 🎉</h2>
              <p className="text-white/60 text-sm">Redirecionando para o app...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle size={40} className="mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-black text-white mb-2">Ops!</h2>
              <p className="text-white/60 text-sm mb-4">{message}</p>
              <button onClick={() => router.push('/login')}
                className="font-black py-2.5 px-6 rounded-xl text-sm"
                style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
                Ir para o Login
              </button>
            </>
          )}
        </div>
=======
    <div className="w-full max-w-sm text-center">
      <div className="inline-flex items-center justify-center w-20 h-20
                      bg-galo-gold rounded-2xl mb-6 overflow-hidden">
        <Image src="/logo.png" alt="FroSócios" width={80} height={80}
               className="object-cover w-full h-full"
               onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        {status === 'loading' && (
          <>
            <Loader2 size={40} className="animate-spin mx-auto mb-4 text-galo-gold" />
            <p className="text-white font-bold">Verificando seu email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={40} className="mx-auto mb-4 text-green-400" />
            <h2 className="text-xl font-black text-white mb-2">Email verificado! 🎉</h2>
            <p className="text-white/60 text-sm">Redirecionando para o app...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={40} className="mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-black text-white mb-2">Ops!</h2>
            <p className="text-white/60 text-sm mb-4">{message}</p>
            <button onClick={() => router.push('/login')}
              className="font-black py-2.5 px-6 rounded-xl text-sm"
              style={{ backgroundColor: '#C4A135', color: '#0a0a0a' }}>
              Ir para o Login
            </button>
          </>
        )}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #0a0a0a, #1a1a1a)' }}>
      <Suspense fallback={
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-galo-gold mx-auto mb-3" />
          <p className="text-white/50 text-sm">Carregando...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
