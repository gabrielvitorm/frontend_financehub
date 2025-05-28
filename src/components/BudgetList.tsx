import React, { useEffect, useState } from 'react';
import { Orcamento } from '../types';
import { getOrcamentosByUsuario, deleteOrcamento } from '../services/OrcamentoService';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const BudgetList: React.FC = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));

  const load = async () => {
    const data = await getOrcamentosByUsuario(userId);
    setOrcamentos(data);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const formatMonth = (m: string) => {
    const [year, month] = m.split('-').map(Number);
    return new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <button
          onClick={() => navigate('/budgets/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <FaPlus /> Novo Orçamento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orcamentos.map(o => (
          <div
            key={o.idOrcamento}
            className="relative bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition p-6"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">
                {formatMonth(o.mesReferencia)}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/budgets/edit/${o.idOrcamento}`)}
                  className="text-gray-600 hover:text-yellow-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={async () => {
                    await deleteOrcamento(o.idOrcamento);
                    load();
                  }}
                  className="text-gray-600 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="mt-4 text-gray-700">
              Limite mensal:
              <span className="ml-2 font-bold text-gray-900">
                {o.limiteOrcamento.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </p>
          </div>
        ))}
      </div>

      {orcamentos.length === 0 && (
        <p className="text-center text-gray-500">
          Você ainda não tem orçamentos. Clique em “Novo Orçamento” para começar.
        </p>
      )}
    </div>
  );
};

export default BudgetList;