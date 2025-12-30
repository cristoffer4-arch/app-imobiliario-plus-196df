import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const hasSession = Boolean(cookies().get('sb-access-token'));
  if (hasSession) {
    redirect('/dashboard');
  }

  redirect('/auth/login');
}
