// src/components/TransactionForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Transacao, Orcamento } from '../types';
import {
  getTransacaoById,
  createTransacao,
  updateTransacao
} from '../services/TransacaoService';
import { getOrcamentosByUsuario } from '../services/OrcamentoService';

const tipos = ['RECEITA', 'DESPESA'];
const categorias = [
  'ALIMENTACAO',
  'TRANSPORTE',
  'MORADIA',
  'SAUDE',
  'EDUCACAO',
  'LAZER',
  'INVESTIMENTOS',
  'OUTROS',
  'FIXO',
  'FREELANCER'
];

const TransactionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));

  const [form, setForm] = useState<Partial<Transacao>>({
    nomeTransaca: '',
    descricaoTransacao: '',
    tipoTransacao: '',
    tipoCategoria: '',
    valor: 0
  });
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [selectedOrc, setSelectedOrc] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // 1) Carrega orçamentos do usuário
    getOrcamentosByUsuario(userId)
      .then(list => setOrcamentos(list))
      .catch(() => setError('Erro ao buscar orçamentos'));

    // 2) Se for edição, carrega dados da transação
    if (isEdit) {
      getTransacaoById(Number(id)).then(t => {
        setForm({
          nomeTransaca: t.nomeTransaca,
          descricaoTransacao: t.descricaoTransacao,
          tipoTransacao: t.tipoTransacao,
          tipoCategoria: t.tipoCategoria,
          valor: t.valor
        });
        const orc = (t as any).orcamento as Orcamento;
        if (orc?.idOrcamento) {
          setSelectedOrc(orc.idOrcamento);
        }
      });
    }
  }, [id, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrc) {
      setError('Selecione um orçamento');
      return;
    }
    if (!form.tipoCategoria) {
      setError('Selecione uma categoria');
      return;
    }
    try {
      const payload = {
        ...form,
        usuario: { idUsuario: userId },
        orcamento: { idOrcamento: selectedOrc }
      };
      if (isEdit) {
        await updateTransacao(Number(id), payload);
      } else {
        await createTransacao(payload);
      }
      navigate('/transactions');
    } catch {
      setError('Falha ao salvar a transação');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? 'Editar' : 'Nova'} Transação
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome da Transação */}
        <div>
          <label className="block mb-1">Nome da Transação</label>
          <input
            type="text"
            name="nomeTransaca"
            value={form.nomeTransaca || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block mb-1">Descrição</label>
          <input
            type="text"
            name="descricaoTransacao"
            value={form.descricaoTransacao || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block mb-1">Valor</label>
          <input
            type="number"
            name="valor"
            value={form.valor ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block mb-1">Tipo</label>
          <select
            name="tipoTransacao"
            value={form.tipoTransacao || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">--Selecione--</option>
            {tipos.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block mb-1">Categoria</label>
          <select
            name="tipoCategoria"
            value={form.tipoCategoria || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">--Selecione--</option>
            {categorias.map(c => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Orçamento */}
        <div>
          <label className="block mb-1">Orçamento</label>
          <select
            value={selectedOrc}
            onChange={e => setSelectedOrc(Number(e.target.value))}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">--Selecione--</option>
            {orcamentos.map(o => (
              <option key={o.idOrcamento} value={o.idOrcamento}>
                {o.mesReferencia} –{' '}
                {o.limiteOrcamento.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </option>
            ))}
          </select>
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

export default TransactionForm;
