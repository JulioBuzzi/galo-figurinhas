import axios from 'axios';

// Cliente HTTP configurado com a URL base da API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Injeta o token JWT em toda requisição autenticada
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('copa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redireciona para login se o token expirar (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('copa_token');
      localStorage.removeItem('copa_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
