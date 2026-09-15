'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg-mid)] px-[16px] text-[var(--text-dark)] transition-colors duration-200">
        <div className="w-full max-w-[400px] rounded-[22px] bg-[var(--card-bg)] p-[32px] shadow-[var(--shadow-md)] text-center">
          <div className="mx-auto mb-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#10b981]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-[20px] font-bold text-[var(--text-dark)]">Password Updated</h2>
          <p className="mt-[8px] text-[14px] text-[var(--text-light)]">Your password has been reset successfully. Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg-mid)] px-[16px] text-[var(--text-dark)] transition-colors duration-200">
      <div className="w-full max-w-[400px] rounded-[22px] bg-[var(--card-bg)] p-[32px] shadow-[var(--shadow-md)]">
        <h1 className="text-center text-[24px] font-bold text-[var(--text-dark)]">Reset Password</h1>
        <p className="mt-[8px] text-center text-[14px] text-[var(--text-light)]">Enter your new password</p>
        <form onSubmit={handleSubmit} className="mt-[24px] grid gap-[14px]">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (min 6 characters)" required minLength={6} className="h-[44px] w-full rounded-[12px] border border-[color:var(--border)] bg-[var(--card-bg)] px-[14px] text-[14px] text-[var(--text-dark)] outline-none focus:border-[#6C63FF]" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="h-[44px] w-full rounded-[12px] border border-[color:var(--border)] bg-[var(--card-bg)] px-[14px] text-[14px] text-[var(--text-dark)] outline-none focus:border-[#6C63FF]" />
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white disabled:opacity-70">{loading ? 'Updating...' : 'Reset Password'}</button>
        </form>
      </div>
    </main>
  );
}
