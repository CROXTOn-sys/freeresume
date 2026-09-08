'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to the console (and any analytics) for debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] py-[40px]">
      <div className="mx-auto w-full max-w-[480px] text-center">
        <div className="mx-auto mb-[20px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[rgba(239,68,68,0.1)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-black lg:text-[28px]">
          Something Went Wrong
        </h1>
        <p className="mx-auto mt-[10px] max-w-[380px] text-[14px] leading-[1.6] text-[#666]">
          We hit an unexpected error while loading this page. You can try again, or head back to the home page.
        </p>

        <div className="mt-[28px] flex flex-col items-center justify-center gap-[10px] sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="flex w-full items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[24px] py-[13px] text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(108,99,255,0.22)] transition-transform hover:-translate-y-[1px] sm:w-auto"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-[14px] border border-[#e5e7eb] bg-white px-[24px] py-[13px] text-[14px] font-bold text-black transition-colors hover:border-[#6C63FF] hover:text-[#6C63FF] sm:w-auto"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-[24px] text-[12px] text-[#999]">
          If the problem persists, please <Link href="/contact" className="text-[#6C63FF] hover:underline">contact support</Link>.
        </p>
      </div>
    </main>
  );
}
