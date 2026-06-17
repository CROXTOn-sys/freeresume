'use client';

import { useEffect, useState } from 'react';

export default function Hero({ onCreateResume }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let current = 1;
    const duration = 1000;
    const steps = 7;
    const interval = duration / steps;

    const timer = window.setInterval(() => {
      current += 1;
      if (current > 8) {
        window.clearInterval(timer);
        return;
      }
      setCount(current);
      if (current === 8) window.clearInterval(timer);
    }, interval);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="border-b border-[color:var(--border-soft)] px-[22px] pb-[28px] pt-[30px] text-center shadow-[var(--shadow-sm)]"
      style={{ background: 'var(--hero-bg)' }}
    >
      <div className="mb-[16px] inline-flex items-center gap-[8px] rounded-full border border-[color:rgba(95,84,240,0.08)] bg-[var(--purple-bg)] px-[12px] py-[7px] text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--purple-dark)]">
        ATS resume builder
      </div>

      <h1 className="mb-[12px] text-[29px] font-black leading-[1.1] tracking-[-0.04em] text-[var(--text-dark)]">
        Build your ATS Resume
        <br />
        <span className="text-[var(--purple)]">in just 2 minutes for FREE!</span>
      </h1>

      <p className="mb-[8px] text-[14px] leading-[1.5] text-[var(--text-mid)]">
        80+ ATS-friendly templates trusted by recruiters
      </p>

      <p className="mb-[18px] text-[14.5px] font-semibold text-[var(--text-dark)]">
        Land <span className="font-extrabold text-[var(--purple)]">{count}x</span> more interviews
      </p>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onCreateResume?.();
        }}
        className="mb-0 block w-full rounded-[50px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] px-[24px] py-[16px] text-[15.5px] font-bold text-white no-underline shadow-[0_16px_30px_rgba(95,84,240,0.22)] transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-[0_18px_34px_rgba(95,84,240,0.26)]"
      >
        Create My Free Resume
      </a>

      <div className="mt-[16px] grid grid-cols-3 gap-[10px]">
        <div className="min-w-0 rounded-[14px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] px-[8px] py-[10px] text-center shadow-[0_8px_18px_rgba(17,24,39,0.04)]">
          <strong className="mb-[2px] block text-[14px] tracking-[-0.02em] text-[var(--text-dark)]">Recruiters</strong>
          <span className="block text-[11px] text-[var(--text-light)]">Approved</span>
        </div>
        <div className="min-w-0 rounded-[14px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] px-[8px] py-[10px] text-center shadow-[0_8px_18px_rgba(17,24,39,0.04)]">
          <strong className="mb-[2px] block text-[14px] tracking-[-0.02em] text-[var(--text-dark)]">one-click</strong>
          <span className="block text-[11px] text-[var(--text-light)]">Export PDF</span>
        </div>
        <div className="min-w-0 rounded-[14px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] px-[8px] py-[10px] text-center shadow-[0_8px_18px_rgba(17,24,39,0.04)]">
          <strong className="mb-[2px] block text-[14px] tracking-[-0.02em] text-[var(--text-dark)]">Free</strong>
          <span className="block text-[11px] text-[var(--text-light)]">to use</span>
        </div>
      </div>
    </section>
  );
}
