import React, { useState, useEffect } from 'react';
import { Usuario } from '../types';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const idUsuario = Number(localStorage.getItem('userId'));

  useEffect(() => {
    api.get<Usuario>(`/usuarios/${idUsuario}`).then(res => setUser(res.data));
  }, []);

  const handlePasswordChange = async () => {
    await api.put('/usuarios/atualizar/', { idUsuario, senha: password });
    alert('Senha atualizada com sucesso');
    setPassword('');
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-4">Meu Perfil</h2>
      {user && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Nome</label>
            <input readOnly value={user.nomeUsuario} className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input readOnly value={user.emailUsuario} className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div>
            <label className="block mb-1">Nova Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handlePasswordChange} className="bg-blue-600 text-white px-4 py-2 rounded">
              Atualizar Senha
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;