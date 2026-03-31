'use client';

import { create } from 'zustand';
import { User } from '@/lib/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('copa_user');
      if (stored) set({ user: JSON.parse(stored) });
    } catch {
      localStorage.removeItem('copa_user');
    }
  },

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

  logout: () => {
    localStorage.removeItem('copa_token');
    localStorage.removeItem('copa_user');
    set({ user: null });
  },
}));