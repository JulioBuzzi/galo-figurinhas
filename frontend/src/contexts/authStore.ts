'use client';

import { create } from 'zustand';
import { User } from '@/lib/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
<<<<<<< HEAD
  register: (name: string, email: string, password: string) => Promise<void>;
=======
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

<<<<<<< HEAD
  /** Carrega sessão salva no localStorage (chamado no layout raiz) */
=======
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('copa_user');
      if (stored) set({ user: JSON.parse(stored) });
    } catch {
      localStorage.removeItem('copa_user');
    }
  },

<<<<<<< HEAD
  /** Realiza login e persiste sessão */
=======
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      const user: User = data;
      localStorage.setItem('copa_token', user.token);
      localStorage.setItem('copa_user', JSON.stringify(user));
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.error || 'Erro ao fazer login');
    }
  },

<<<<<<< HEAD
  /** Cadastra novo usuário e já faz login */
  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      const user: User = data;
      localStorage.setItem('copa_token', user.token);
      localStorage.setItem('copa_user', JSON.stringify(user));
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.error || 'Erro ao cadastrar');
    }
  },

  /** Limpa sessão */
=======
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
  logout: () => {
    localStorage.removeItem('copa_token');
    localStorage.removeItem('copa_user');
    set({ user: null });
  },
<<<<<<< HEAD
}));
=======
}));
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
