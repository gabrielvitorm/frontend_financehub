import { api } from './api';
import { Transacao } from '../types';

export const getTransacoes = async (): Promise<Transacao[]> => {
  const response = await api.get<Transacao[]>('/transacoes');
  return response.data;
};

export const getTransacaoById = async (id: number): Promise<Transacao> => {
  const response = await api.get<Transacao>(`/transacoes/id/${id}`);
  return response.data;
};

export const createTransacao = async (t: Partial<Transacao>): Promise<void> => {
  await api.post('/transacoes', t);
};

export const updateTransacao = async (id: number, t: Partial<Transacao>): Promise<void> => {
  await api.put(`/transacoes/id/${id}`, t);
};

export const deleteTransacao = async (id: number): Promise<void> => {
  await api.delete(`/transacoes/id/${id}`);
};