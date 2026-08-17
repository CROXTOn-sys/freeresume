'use client';

import { useEffect, useState } from 'react';

const marqueeCards = [
  { bold: '↑ 38%', sub: 'more interviews' },
  { bold: 'Recruiters', sub: 'Approved' },
  { bold: '↑ 23%', sub: 'more likely to get a job offer' },
  { bold: 'one-click', sub: 'Export PDF,DOCX' },
  { bold: 'Free', sub: 'to use' },
];

function MarqueeStrip() {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee gap-[12px] hover:[animation-play-state:paused]">
        {[...marqueeCards, ...marqueeCards].map((card, i) => (
          <div key={i} className="flex-shrink-0 flex items-center justify-center gap-[6px] rounded-[14px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] px-[16px] py-[10px] shadow-[0_4px_12px_rgba(17,24,39,0.04)]">
            <span className="text-[18px] font-black text-[#059669] whitespace-nowrap">{card.bold}</span>
            <span className="text-[11px] leading-[1.3] text-[var(--text-light)] whitespace-nowrap">{card.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      className="relative overflow-hidden border-b border-[color:var(--border-soft)] px-[22px] pb-[28px] pt-[30px] text-center shadow-[var(--shadow-sm)] lg:px-[64px] lg:pb-[64px] lg:pt-[64px] lg:text-left lg:rounded-none lg:border-x-0 lg:mx-0"
      style={{ background: 'var(--hero-bg)' }}
    >
      {/* Mobile background resume decoration */}
      <div className="pointer-events-none absolute inset-0 z-[0] flex items-center justify-center lg:hidden" aria-hidden="true">
        <div className="relative flex items-start gap-[-10px] mt-[20px]">
          <img src="/images/template1.png" alt="" className="w-[180px] rotate-[-5deg] rounded-[8px] border-[3px] border-white/80 opacity-[0.24] shadow-[0_8px_24px_rgba(17,24,39,0.22)] blur-[0.5px]" />
          <img src="/images/template2.png" alt="" className="w-[150px] rotate-[5deg] rounded-[8px] border-[3px] border-white/80 opacity-[0.24] shadow-[0_8px_24px_rgba(17,24,39,0.22)] blur-[0.5px] ml-[-20px] mt-[10px]" />
        </div>
      </div>

      {/* Desktop two-column layout */}
      <div className="relative z-[1] lg:flex lg:items-center lg:gap-[56px] lg:max-w-[1120px] xl:max-w-[1280px] 2xl:max-w-[1400px] lg:mx-auto">
        {/* Left: Resume mockup (desktop only) */}
        <div className="hidden lg:block lg:flex-shrink-0 lg:relative lg:z-[2]">
          <div className="relative">
            <div className="w-[340px] xl:w-[380px] 2xl:w-[420px] rounded-[16px] border border-[color:var(--border-soft)] bg-white p-[8px] shadow-[0_20px_50px_rgba(17,24,39,0.12)] rotate-[-2deg]">
              <img src="/images/template1.png" alt="Resume template preview" className="w-full rounded-[8px] border border-[#d1d5db]" />
            </div>
            <div className="absolute -right-[40px] top-[30px] w-[180px] rounded-[12px] border border-[color:var(--border-soft)] bg-white p-[6px] shadow-[0_14px_36px_rgba(17,24,39,0.14)] rotate-[3deg]">
              <img src="/images/template2.png" alt="Resume template 2 preview" className="w-full rounded-[6px] border border-[#d1d5db]" />
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:flex-1 lg:overflow-hidden">
          <div className="mb-[16px] inline-flex items-center gap-[8px] rounded-full border border-[color:rgba(95,84,240,0.08)] bg-[var(--purple-bg)] px-[12px] py-[7px] text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--purple-dark)] lg:text-[13px] lg:px-[16px] lg:py-[8px]">
            ATS resume builder
          </div>

          <h1 className="mb-[12px] text-[29px] font-black leading-[1.1] tracking-[-0.04em] text-[var(--text-dark)] lg:text-[42px] xl:text-[48px] 2xl:text-[54px] lg:mb-[16px] lg:leading-[1.15]">
            Build your ATS Resume
            <br />
            <span className="text-[var(--purple)]">in just 2 minutes for FREE!</span>
          </h1>

          <p className="mb-[8px] text-[14px] leading-[1.5] text-[var(--text-mid)] lg:text-[17px] xl:text-[18px] lg:mb-[12px]">
            Easily create a resume from any device with our ATS-friendly templates trusted by recruiters.
          </p>

          <p className="mb-[18px] text-[14.5px] font-semibold text-[var(--text-dark)] lg:text-[16px] lg:mb-[28px]">
            Land <span className="font-extrabold text-[var(--purple)]">{count}x</span> more interviews
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-[10px] sm:flex-row sm:items-center lg:gap-[14px]">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCreateResume?.();
              }}
              className="block w-full rounded-[50px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] px-[24px] py-[16px] text-[15.5px] font-bold text-white no-underline shadow-[0_16px_30px_rgba(95,84,240,0.22)] transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-[0_18px_34px_rgba(95,84,240,0.26)] sm:w-auto sm:inline-block lg:px-[36px] lg:py-[16px] lg:text-[16px] xl:px-[40px] xl:py-[18px] xl:text-[17px] text-center"
            >
              Build Resume
            </a>
            <a
              href="/interview-prep"
              className="block w-full rounded-[50px] border-2 border-[color:var(--text-dark)] bg-[var(--card-bg)] px-[24px] py-[14px] text-[15px] font-bold text-[var(--text-dark)] no-underline transition-colors hover:border-[var(--purple)] hover:text-[var(--purple)] sm:w-auto sm:inline-block lg:px-[36px] lg:py-[14px] lg:text-[16px] text-center"
            >
              Interview Prep 🎯
            </a>
          </div>
          <a href="/ats-checker" className="mt-[12px] inline-block text-[13px] font-medium text-[var(--text-light)] transition-colors hover:text-[var(--purple)]">or check your resume&apos;s <span className="text-[var(--purple)] underline">ATS score</span> →</a>

          {/* Desktop marquee — constrained to right column, goes behind left resume */}
          <div className="mt-[24px] hidden lg:block">
            <MarqueeStrip />
            <p className="mt-[14px] text-[13px] text-[var(--text-light)]">Your first resume download is free. Upgrade to a plan for unlimited downloads.</p>
          </div>
        </div>
      </div>

      {/* Mobile marquee — full width */}
      <div className="relative z-[1] mt-[16px] lg:hidden">
        <MarqueeStrip />
        <p className="mt-[10px] text-center text-[11px] text-[var(--text-light)]">Your first resume download is free. Upgrade to a plan for unlimited downloads.</p>
      </div>
    </section>
  );
}
