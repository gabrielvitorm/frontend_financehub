import { api } from './api';
import { Orcamento } from '../types';


export const getOrcamentosByUsuario = async (idUsuario: number): Promise<Orcamento[]> => {
  const response = await api.get<Orcamento[]>(`/orcamentos/usuario/${idUsuario}`);
  return response.data;
};

export const createOrcamento = async (o: Partial<Orcamento>): Promise<Orcamento> => {
  const response = await api.post<Orcamento>('/orcamentos', o);
  return response.data;
};

export const updateOrcamento = async (id: number, o: Partial<Orcamento>): Promise<void> => {
  await api.put(`/orcamentos/atualizar/${id}`, o);
};

export const deleteOrcamento = async (id: number): Promise<void> => {
  await api.delete(`/orcamentos/${id}`);
};