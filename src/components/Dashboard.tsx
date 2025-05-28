// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { getTransacoes } from '../services/TransacaoService';
import { Transacao } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

const COLORS = ['#4ade80', '#f87171'];

interface MonthlyData {
  month: string;
  receita: number;
  despesa: number;
}

// Helpers
const getMonthsArray = (start: Date, end: Date): string[] => {
  const arr: string[] = [];
  const curr = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);
  while (curr <= last) {
    arr.push(curr.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }));
    curr.setMonth(curr.getMonth() + 1);
  }
  return arr;
};
const defaultMonths = (() => {
  const now = new Date();
  const arr: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }));
  }
  return arr;
})();

const Dashboard: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [startMonth, setStartMonth] = useState<string>('');
  const [endMonth, setEndMonth] = useState<string>('');
  const [filtered, setFiltered] = useState<Transacao[]>([]);
  const [totalReceita, setTotalReceita] = useState(0);
  const [totalDespesa, setTotalDespesa] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    getTransacoes().then(setTransacoes);
  }, []);

  useEffect(() => {
    let data = [...transacoes];

    if (startMonth) {
      const start = new Date(`${startMonth}-01T00:00:00`);
      data = data.filter(t => new Date(t.dataCriacao) >= start);
    }
    if (endMonth) {
      const [y, m] = endMonth.split('-').map(Number);
      const end = new Date(y, m, 1);
      data = data.filter(t => new Date(t.dataCriacao) < end);
    }

    setFiltered(data);

    // Totais
    const sumRec = data.filter(t => t.tipoTransacao === 'RECEITA')
                       .reduce((s, t) => s + t.valor, 0);
    const sumDesp = data.filter(t => t.tipoTransacao === 'DESPESA')
                        .reduce((s, t) => s + t.valor, 0);
    setTotalReceita(sumRec);
    setTotalDespesa(sumDesp);

    // Monta meses e agrupamento
    const months = startMonth && endMonth
      ? getMonthsArray(new Date(`${startMonth}-01`), new Date(`${endMonth}-01`))
      : defaultMonths;

    const mData = months.map(m => ({ month: m, receita: 0, despesa: 0 }));
    data.forEach(t => {
      const key = new Date(t.dataCriacao)
        .toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
      const entry = mData.find(x => x.month === key);
      if (entry) {
        t.tipoTransacao === 'RECEITA'
          ? (entry.receita += t.valor)
          : (entry.despesa += t.valor);
      }
    });
    setMonthlyData(mData);
  }, [transacoes, startMonth, endMonth]);

  const pieData = [
    { name: 'Receita', value: totalReceita },
    { name: 'Despesa', value: totalDespesa }
  ];

  // Últimas 5 de cada tipo (após filtro)
  const ultimasReceitas = filtered
    .filter(t => t.tipoTransacao === 'RECEITA')
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
    .slice(0, 5);
  const ultimasDespesas = filtered
    .filter(t => t.tipoTransacao === 'DESPESA')
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-16">
      {/* Filtros de mês */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Mês Início</label>
          <input
            type="month"
            value={startMonth}
            onChange={e => setStartMonth(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mês Fim</label>
          <input
            type="month"
            value={endMonth}
            onChange={e => setEndMonth(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
          />
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg text-green-800 font-medium">Total de Receitas</h3>
          <p className="mt-2 text-4xl font-bold text-green-700">
            {totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg text-red-800 font-medium">Total de Despesas</h3>
          <p className="mt-2 text-4xl font-bold text-red-700">
            {totalDespesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col">
          <h3 className="text-lg font-medium mb-4">Proporção Receitas vs Despesas</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="50%"
                  outerRadius="80%"
                  paddingAngle={4}
                  label
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(v: number) =>
                  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col">
          <h3 className="text-lg font-medium mb-4">Evolução Mensal</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip formatter={(v: number) =>
                  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill={COLORS[0]} />
                <Bar dataKey="despesa" name="Despesa" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Últimas Receitas</h3>
          <ul className="space-y-3">
            {ultimasReceitas.length > 0 ? (
              ultimasReceitas.map(t => (
                <li key={t.idTransacao} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="font-medium">{t.nomeTransaca}</span>
                  <span className="text-green-600 font-semibold">
                    {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Nenhuma receita recente.</li>
            )}
          </ul>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Últimas Despesas</h3>
          <ul className="space-y-3">
            {ultimasDespesas.length > 0 ? (
              ultimasDespesas.map(t => (
                <li key={t.idTransacao} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="font-medium">{t.nomeTransaca}</span>
                  <span className="text-red-600 font-semibold">
                    {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Nenhuma despesa recente.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
