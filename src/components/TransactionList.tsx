// src/components/TransactionList.tsx
import React, { useEffect, useState } from 'react';
import { Transacao } from '../types';
import { getTransacoes, deleteTransacao } from '../services/TransacaoService';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaEdit,
  FaSearch
} from 'react-icons/fa';

const categorias = [
  'ALIMENTACAO','TRANSPORTE','MORADIA','SAUDE',
  'EDUCACAO','LAZER','INVESTIMENTOS','OUTROS','FIXO','FREELANCER'
];

const TransactionList: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>(''); // YYYY-MM
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getTransacoes();
      setTransacoes(data);
    })();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTransacao(id);
    setTransacoes(ts => ts.filter(t => t.idTransacao !== id));
  };

  // Filtra por busca, categoria e mês
  const filtered = transacoes.filter(t => {
    const term = search.toLowerCase();
    const okSearch =
      t.nomeTransaca.toLowerCase().includes(term) ||
      t.descricaoTransacao.toLowerCase().includes(term);
    const okCat = categoryFilter === 'ALL' || t.tipoCategoria === categoryFilter;
    const okMonth = monthFilter
      ? new Date(t.dataCriacao).toISOString().slice(0,7) === monthFilter
      : true;
    return okSearch && okCat && okMonth;
  });

  // Separa receitas e despesas
  const receitas = filtered
    .filter(t => t.tipoTransacao === 'RECEITA')
    .sort((a, b) => Date.parse(b.dataCriacao) - Date.parse(a.dataCriacao));
  const despesas = filtered
    .filter(t => t.tipoTransacao === 'DESPESA')
    .sort((a, b) => Date.parse(b.dataCriacao) - Date.parse(a.dataCriacao));

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR');

  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-16">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Transações</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute top-2 left-2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 border rounded focus:ring focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:ring focus:outline-none"
          >
            <option value="ALL">Todas Categorias</option>
            {categorias.map(c => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:ring focus:outline-none"
            title="Filtrar por mês"
          />
          <button
            onClick={() => navigate('/transactions/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Nova Transação
          </button>
        </div>
      </div>

      {/* Receitas */}
      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          <FaArrowUp /> Receitas ({receitas.length})
        </h2>
        {receitas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {receitas.map(t => (
              <div
                key={t.idTransacao}
                className="bg-green-50 border border-green-200 rounded-lg p-4 shadow hover:shadow-md transition relative"
              >
                {/* Edit/Delete */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/transactions/edit/${t.idTransacao}`)}
                    className="text-gray-600 hover:text-yellow-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(t.idTransacao!)}
                    className="text-gray-600 hover:text-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
                {/* Categoria badge acima do nome */}
                <span className="inline-block mb-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {t.tipoCategoria.charAt(0) + t.tipoCategoria.slice(1).toLowerCase()}
                </span>
                <div className="flex justify-between items-start">
                  <span className="text-lg font-medium">{t.nomeTransaca}</span>
                </div>
                <p className="mt-1 text-gray-700 truncate">{t.descricaoTransacao}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-green-700">
                    {t.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(t.dataCriacao)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma receita encontrada.</p>
        )}
      </section>

      {/* Despesas */}
      <section>
        <h2 className="text-2xl font-semibold text-red-700 mb-4 flex items-center gap-2">
          <FaArrowDown /> Despesas ({despesas.length})
        </h2>
        {despesas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {despesas.map(t => (
              <div
                key={t.idTransacao}
                className="bg-red-50 border border-red-200 rounded-lg p-4 shadow hover:shadow-md transition relative"
              >
                {/* Edit/Delete */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/transactions/edit/${t.idTransacao}`)}
                    className="text-gray-600 hover:text-yellow-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(t.idTransacao!)}
                    className="text-gray-600 hover:text-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
                {/* Categoria badge acima do nome */}
                <span className="inline-block mb-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {t.tipoCategoria.charAt(0) + t.tipoCategoria.slice(1).toLowerCase()}
                </span>
                <div className="flex justify-between items-start">
                  <span className="text-lg font-medium">{t.nomeTransaca}</span>
                </div>
                <p className="mt-1 text-gray-700 truncate">{t.descricaoTransacao}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-red-700">
                    {t.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(t.dataCriacao)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma despesa encontrada.</p>
        )}
      </section>

      {/* Listagem Geral */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Todas Transações</h2>
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.idTransacao} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{t.idTransacao}</td>
                  <td className="p-3">{t.nomeTransaca}</td>
                  <td className="p-3 truncate">{t.descricaoTransacao}</td>
                  <td className="p-3">
                    {t.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td className="p-3">{t.tipoTransacao}</td>
                  <td className="p-3">{t.tipoCategoria}</td>
                  <td className="p-3">{formatDate(t.dataCriacao)}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/transactions/edit/${t.idTransacao}`)}
                      className="text-yellow-500 hover:text-yellow-700 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(t.idTransacao!)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    Nenhuma transação cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TransactionList;
