import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cadastro = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [cpfUsuario, setCpfUsuario] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/usuarios', {
        nomeUsuario,
        emailUsuario,
        senhaUsuario,
        cpfUsuario,
      });
      alert('Usuário cadastrado com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleCadastro} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nomeUsuario}
          onChange={(e) => setNomeUsuario(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={emailUsuario}
          onChange={(e) => setEmailUsuario(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senhaUsuario}
          onChange={(e) => setSenhaUsuario(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpfUsuario}
          onChange={(e) => setCpfUsuario(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Cadastro;
