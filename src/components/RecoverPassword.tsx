import React, { useState } from 'react';

const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // aqui você chamaria seu endpoint de recuperação
    // ex: api.post('/usuarios/forgot', { emailUsuario: email });
    setSent(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h2>

        {sent ? (
          <p className="text-green-600 text-center">
            Se o e-mail existir, você receberá instruções para recuperar a senha.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Informe seu e-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Enviar instruções
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecoverPassword;
