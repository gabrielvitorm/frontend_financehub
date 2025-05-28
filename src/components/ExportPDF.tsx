// src/components/ExportPDF.tsx
import React, { useState } from 'react';
import { api } from '../services/api';

const ExportPDF: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleExport = async () => {
    if (!startDate || !endDate) {
      setError('Selecione o intervalo de datas antes de exportar.');
      return;
    }
    setError('');

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      setError('Usuário não autenticado.');
      return;
    }

    // Formata LocalDateTime ISO para o DTO
    const dataInicio = `${startDate}T00:00:00`;
    const dataFim    = `${endDate}T23:59:59`;

    try {
      // Agora POST
      const response = await api.post(
        '/exportacoes/exportar/pdf',
        { idUsuario: userId, dataInicio, dataFim },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url  = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setError('Erro ao gerar PDF. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Exportar Relatório</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Data Início</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Data Fim</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleExport}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Baixar PDF
        </button>
      </div>
    </div>
  );
};

export default ExportPDF;
