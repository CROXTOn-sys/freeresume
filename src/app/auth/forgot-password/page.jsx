'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px]">
        <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[32px] shadow-[0_10px_40px_rgba(17,24,39,0.1)] text-center">
          <div className="mx-auto mb-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#10b981]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-[20px] font-bold text-black">Check your email</h2>
          <p className="mt-[8px] text-[14px] text-[#666]">We sent a password reset link to <strong>{email}</strong>.</p>
          <a href="/auth/login" className="mt-[20px] inline-block w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-center text-[14px] font-semibold text-white no-underline">Back to Sign In</a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px]">
      <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[32px] shadow-[0_10px_40px_rgba(17,24,39,0.1)]">
        <h1 className="text-center text-[24px] font-bold text-black">Forgot Password</h1>
        <p className="mt-[8px] text-center text-[14px] text-[#666]">Enter your email and we'll send you a reset link</p>
        <form onSubmit={handleSubmit} className="mt-[24px] grid gap-[14px]">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white disabled:opacity-70">{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
        <p className="mt-[16px] text-center text-[13px] text-[#666]"><a href="/auth/login" className="font-semibold text-[#6C63FF]">Back to Sign In</a></p>
      </div>
    </main>
  );
}
