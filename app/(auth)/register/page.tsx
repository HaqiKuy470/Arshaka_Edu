import { redirect } from 'next/navigation';

// Halaman register tidak digunakan — semua autentikasi via OAuth (Google/GitHub)
// Redirect ke halaman login
export default function RegisterPage() {
  redirect('/login');
}
