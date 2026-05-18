import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import OnboardingClient from './OnboardingClient';

export default async function OnboardingPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Jika user sudah onboarded, langsung redirect ke dashboard
  const isOnboarded = (session.user as { isOnboarded?: boolean }).isOnboarded ?? false;
  if (isOnboarded) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#050505] px-4 py-16">
      {/* Background Auras */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] bg-purple-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <OnboardingClient user={session.user} />
      </div>
    </div>
  );
}
