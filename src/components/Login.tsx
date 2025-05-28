// src/components/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Usuario } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Se já estiver autenticado, redireciona na carga
    if (localStorage.getItem('authenticated') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1) login
      await api.post('/usuarios/login', { emailUsuario: email, senhaUsuario: senha });

      // 2) busca ID do usuário
      const userRes = await api.get<Usuario>(`/usuarios/emails/${email}`);
      const idUsuario = userRes.data.idUsuario;

      // 3) grava flag e ID
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userId', String(idUsuario));

-     // 4) redireciona via React Router
-     navigate('/dashboard', { replace: true });
+     // 4) redireciona forçando recarga para atualizar App.tsx
+     navigate('/dashboard', { replace: true });
+     window.location.reload();
    } catch {
      setError('E-mail ou senha inválidos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/register" className="text-blue-600 hover:underline">
            Criar conta
          </Link>
          <Link to="/recover" className="text-blue-600 hover:underline">
            Recuperar senha
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
