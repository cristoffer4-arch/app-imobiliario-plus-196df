import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white space-y-8 p-8">
        <h1 className="text-6xl font-bold">Imobiliário GO</h1>
        <p className="text-2xl">Gestão Imobiliária Inteligente com IA</p>
        <p className="text-lg opacity-90">Portugal &amp; Brasil</p>
        <div className="space-x-4 mt-8">
          <Link
            href="/auth/login"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
          >
            Fazer Login
          </Link>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </div>
  );
}
