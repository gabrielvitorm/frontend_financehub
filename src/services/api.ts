// src/services/api.ts
import axios from 'axios';

// No Vite, as env vars só entram em build se começarem com VITE_
const API_HOST = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL          // em produção (Vercel)
  : import.meta.env.VITE_API_URL || 'http://localhost:8080';  // dev ou fallback

export const api = axios.create({
  baseURL: API_HOST,
  headers: { 'Content-Type': 'application/json' },
});
