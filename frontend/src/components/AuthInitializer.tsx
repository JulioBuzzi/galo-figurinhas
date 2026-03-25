'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/contexts/authStore';

/**
 * Componente invisível que inicializa o estado de autenticação
 * a partir do localStorage assim que o cliente carrega.
 */
export default function AuthInitializer() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);
  return null;
}
