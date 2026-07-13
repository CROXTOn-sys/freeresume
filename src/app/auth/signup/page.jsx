'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Sign up failed');
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

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px]">
        <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[32px] shadow-[0_10px_40px_rgba(17,24,39,0.1)]">
          <div className="text-center">
            <div className="mx-auto mb-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#10b981]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-[20px] font-bold text-black">Check your email</h2>
            <p className="mt-[8px] text-[14px] text-[#666]">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
            <button onClick={() => { let dest = '/'; try { const saved = window.sessionStorage.getItem('ResumeLab-return-to'); if (saved) dest = saved; } catch {} router.push(dest); }} className="mt-[20px] w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white">Continue</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px]">
      <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[32px] shadow-[0_10px_40px_rgba(17,24,39,0.1)]">
        <h1 className="text-center text-[24px] font-bold text-black">Create Account</h1>
        <p className="mt-[8px] text-center text-[14px] text-[#666]">Sign up to save and manage your resumes</p>

        <button onClick={handleGoogleSignIn} className="mt-[24px] flex w-full items-center justify-center gap-[10px] rounded-full border border-[#e5e7eb] bg-white py-[12px] text-[14px] font-semibold text-black hover:bg-[#f9f9f9] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="my-[20px] flex items-center gap-[12px]">
          <div className="h-[1px] flex-1 bg-[#e5e7eb]" />
          <span className="text-[12px] text-[#999]">or</span>
          <div className="h-[1px] flex-1 bg-[#e5e7eb]" />
        </div>

        <form onSubmit={handleSignUp} className="grid gap-[14px]">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required maxLength={50} className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" required minLength={6} className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white disabled:opacity-70">{loading ? 'Creating account...' : 'Sign Up'}</button>
        </form>

        <p className="mt-[16px] text-center text-[13px] text-[#666]">Already have an account? <a href="/auth/login" className="font-semibold text-[#6C63FF]">Sign In</a></p>
      </div>
    </main>
  );
}
