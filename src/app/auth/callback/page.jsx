'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' && !hasRedirected.current) {
        hasRedirected.current = true;
        let returnTo = '/';
        try {
          const saved = window.sessionStorage.getItem('ResumeLab-return-to');
          if (saved && saved.startsWith('/') && !saved.includes('://')) { returnTo = saved; }
          window.sessionStorage.removeItem('ResumeLab-return-to');
        } catch {}
        listener?.subscription?.unsubscribe();
        router.push(returnTo);
      }
    });
    return () => listener?.subscription?.unsubscribe();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)]">
      <div className="flex flex-col items-center">
        <img src="/images/loading-star.png" alt="" className="h-[60px] w-[60px] animate-spin" />
        <p className="mt-[16px] text-[15px] font-semibold text-black">Signing you in...</p>
      </div>
    </main>
  );
}
