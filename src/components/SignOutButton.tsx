'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers';

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function SignOutButton({
  className = '',
  children = 'Sair',
  redirectTo = '/auth/login',
}: SignOutButtonProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign-out error:', error);
      }
      router.push(redirectTo);
    } catch (err) {
      console.error('Unexpected sign-out error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {loading ? 'Saindo...' : children}
    </button>
  );
}
