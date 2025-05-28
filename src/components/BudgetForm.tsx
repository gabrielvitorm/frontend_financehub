// src/components/BudgetForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Orcamento } from '../types';
import {
  getOrcamentosByUsuario,
  createOrcamento,
  updateOrcamento
} from '../services/OrcamentoService';

const BudgetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));

  // Estado isolado para cada campo
  const [limite, setLimite] = useState<number | ''>('');
  const [mes, setMes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Se for edição, busca o orçamento existente
  useEffect(() => {
    if (isEdit) {
      getOrcamentosByUsuario(userId).then(list => {
        const orc = list.find(o => o.idOrcamento === Number(id));
        if (orc) {
          setLimite(Number(orc.limiteOrcamento));
          // converte "2025-04-01" → "2025-04" para o <input type="month">
          setMes(orc.mesReferencia.substring(0, 7));
        }
      });
    }
  }, [id, isEdit, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (limite === '' || limite <= 0) {
      setError('Informe um limite válido');
      return;
    }
    if (!mes) {
      setError('Informe o mês de referência');
      return;
    }

    // monta o DTO esperado pela API
    const dto = {
      limiteOrcamento: limite,
      idUsuario: userId,
      mesReferencia: `${mes}-01`,   // converte "YYYY-MM" → "YYYY-MM-01"
    };

    try {
      if (isEdit) {
        await updateOrcamento(Number(id), dto);
      } else {
        await createOrcamento(dto);
      }
      navigate('/budgets');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar orçamento. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? 'Editar' : 'Novo'} Orçamento
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Limite */}
        <div>
          <label className="block mb-1">Limite</label>
          <input
            type="number"
            value={limite}
            onChange={e => setLimite(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full border p-2 rounded"
            placeholder="Ex: 1500.00"
            required
          />
        </div>

        {/* Mês Referência */}
        <div>
          <label className="block mb-1">Mês Referência</label>
          <input
            type="month"
            value={mes}
            onChange={e => setMes(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
