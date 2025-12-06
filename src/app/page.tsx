'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('joao@teste.pt');
  const [senha, setSenha] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'joao@teste.pt' && senha === '123456') {
      router.push('/imoveis');
    } else {
      alert('Credenciais inválidas!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
              <div className="text-6xl">🏠</div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Coach Imobiliário</h1>
            <p className="text-gray-600">Acelere suas vendas com IA</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="joao@teste.pt"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition shadow-lg"
            >
              Entrar
            </button>

            <button
              type="button"
              className="w-full text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition"
            >
              Criar Conta
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Credenciais de teste: joao@teste.pt / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
