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
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px]">
        <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[32px] shadow-[0_10px_40px_rgba(17,24,39,0.1)] text-center">
          <div className="mx-auto mb-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#10b981]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-[20px] font-bold text-black">Password Updated</h2>
          <p className="mt-[8px] text-[14px] text-[#666]">Your password has been reset successfully. Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px]">
      <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[32px] shadow-[0_10px_40px_rgba(17,24,39,0.1)]">
        <h1 className="text-center text-[24px] font-bold text-black">Reset Password</h1>
        <p className="mt-[8px] text-center text-[14px] text-[#666]">Enter your new password</p>
        <form onSubmit={handleSubmit} className="mt-[24px] grid gap-[14px]">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (min 6 characters)" required minLength={6} className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="h-[44px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[#6C63FF]" />
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white disabled:opacity-70">{loading ? 'Updating...' : 'Reset Password'}</button>
        </form>
      </div>
    </main>
  );
}
