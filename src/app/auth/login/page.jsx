'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getReturnTo = () => {
    // Priority: URL query param > sessionStorage > fallback to /
    const fromUrl = searchParams.get('returnTo');
    console.log('[LoginPage] returnTo from URL:', fromUrl);
    if (fromUrl) return fromUrl;
    try {
      const saved = window.sessionStorage.getItem('ResumeLab-return-to');
      console.log('[LoginPage] returnTo from sessionStorage:', saved);
      if (saved) return saved;
    } catch {}
    console.log('[LoginPage] no returnTo found, defaulting to /');
    return '/';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const destination = getReturnTo();
      try { window.sessionStorage.removeItem('ResumeLab-return-to'); } catch {}
      router.push(destination);
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px]">
      <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[32px] shadow-[0_10px_40px_rgba(17,24,39,0.1)]">
        <h1 className="text-center text-[24px] font-bold text-black">Welcome Back</h1>
        <p className="mt-[8px] text-center text-[14px] text-[#666]">Sign in to your account</p>

        <button onClick={handleGoogleSignIn} className="mt-[24px] flex w-full items-center justify-center gap-[10px] rounded-full border border-[#e5e7eb] bg-white py-[12px] text-[14px] font-semibold text-black hover:bg-[#f9f9f9] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="my-[20px] flex items-center gap-[12px]">
          <div className="h-[1px] flex-1 bg-[#e5e7eb]" />
          <span className="text-[12px] text-[#999]">or</span>
          <div className="h-[1px] flex-1 bg-[#e5e7eb]" />
        </div>

        <form onSubmit={handleLogin} className="grid gap-[14px]">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          <label className="flex items-center gap-[8px] text-[13px] text-[#666]"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-[16px] w-[16px] rounded accent-[#6C63FF]" /> Remember me</label>
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white disabled:opacity-70">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <p className="mt-[16px] text-center text-[13px] text-[#666]">Don't have an account? <a href="/auth/signup" className="font-semibold text-[#6C63FF]">Sign Up</a></p>
        <p className="mt-[8px] text-center text-[13px] text-[#666]"><a href="/auth/forgot-password" className="text-[#6C63FF]">Forgot password?</a></p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
