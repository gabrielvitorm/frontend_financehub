// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1) remove flags e dados do usuário
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userId');
    // 2) redireciona para login
    navigate('/login', { replace: true });
    // 3) força recarregar App e limpar estado
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow p-4 mb-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">FinanceHub</div>
      <div className="space-x-4 flex items-center">
        <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/transactions" className="hover:text-blue-600">Transações</Link>
        <Link to="/budgets" className="hover:text-blue-600">Orçamentos</Link>
        <Link to="/export" className="hover:text-blue-600">Exportar PDF</Link>
        <Link to="/profile" className="hover:text-blue-600">Perfil</Link>
        <button
          onClick={handleLogout}
          className="ml-4 text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
