import { redirect } from 'next/navigation';

// A raiz redireciona para o dashboard
export default function Home() {
  redirect('/dashboard');
}
