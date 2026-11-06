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

const desktopStatItems = [
  { value: '38%', label: 'more interviews', showArrow: true },
  { value: 'Recruiters', label: 'approved' },
  { value: '23%', label: 'more likely to get a job offer', showArrow: true },
  { value: 'One-click', label: 'export to PDF, DOCX' },
  { value: 'Free', label: 'to use' },
];

function StatsStripDesktop() {
  const renderItems = (copyKey) =>
    [...desktopStatItems, ...desktopStatItems].map((item, index) => (
      <div className="stat-strip-desktop-item" key={`${copyKey}-${index}`}>
        <span className="stat-strip-desktop-value">
          {item.showArrow && (
            <svg
              aria-hidden="true"
              className="stat-strip-desktop-arrow"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M8 13V3M4 7l4-4 4 4" />
            </svg>
          )}
          {item.value}
        </span>
        <span className="stat-strip-desktop-label">{item.label}</span>
      </div>
    ));

  return (
    <div className="stat-strip-desktop">
      <div className="stat-strip-desktop-track">
        <div className="stat-strip-desktop-copy">{renderItems('first')}</div>
        <div className="stat-strip-desktop-copy" aria-hidden="true">
          {renderItems('second')}
        </div>
      </div>
    </div>
  );
}

function StatsStripMobile() {
  const renderItems = (copyKey) =>
    [...desktopStatItems, ...desktopStatItems].map((item, index) => (
      <div className="hero-mobile-stats-item" key={`${copyKey}-${index}`}>
        <span className="hero-mobile-stats-value">
          {item.showArrow && (
            <svg
              aria-hidden="true"
              className="hero-mobile-stats-arrow"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M8 13V3M4 7l4-4 4 4" />
            </svg>
          )}
          {item.value}
        </span>
        <span className="hero-mobile-stats-label">{item.label}</span>
      </div>
    ));

  return (
    <div className="hero-mobile-stats lg:hidden max-lg:block max-lg:-mx-6">
      <div className="hero-mobile-stats-track">
        <div className="hero-mobile-stats-copy">{renderItems('first')}</div>
        <div className="hero-mobile-stats-copy" aria-hidden="true">
          {renderItems('second')}
        </div>
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
      className="rl-hero relative overflow-hidden border-b border-[color:var(--border-soft)] px-[22px] pb-[28px] pt-[30px] text-center shadow-[var(--shadow-sm)] lg:px-[64px] lg:pb-[64px] lg:pt-[64px] lg:text-left lg:rounded-none lg:border-x-0 lg:mx-0 max-lg:!bg-[var(--bg)] max-lg:!bg-none max-lg:!px-6 max-lg:!pt-[34px] max-lg:!pb-0 max-lg:!text-left max-lg:!shadow-none"
      style={{ background: 'var(--hero-bg)' }}
    >
      {/* Mobile background resume decoration */}
      <div className="pointer-events-none absolute inset-0 z-[0] flex items-center justify-center lg:hidden max-lg:hidden" aria-hidden="true">
        <div className="relative flex items-start gap-[-10px] mt-[20px]">
          <img src="/images/template1.png" alt="" className="w-[180px] rotate-[-5deg] rounded-[8px] border-[3px] border-white/80 opacity-[0.24] shadow-[0_8px_24px_rgba(17,24,39,0.22)] blur-[0.5px]" />
          <img src="/images/template2.png" alt="" className="w-[150px] rotate-[5deg] rounded-[8px] border-[3px] border-white/80 opacity-[0.24] shadow-[0_8px_24px_rgba(17,24,39,0.22)] blur-[0.5px] ml-[-20px] mt-[10px]" />
        </div>
      </div>

      {/* Desktop two-column layout */}
      <div className="rl-hero-layout relative z-[1] lg:flex lg:items-center lg:gap-[56px] lg:max-w-[1120px] xl:max-w-[1280px] 2xl:max-w-[1400px] lg:mx-auto max-lg:mx-auto max-lg:max-w-[560px]">
        {/* Left: Resume mockup (desktop only) */}
        <div className="rl-hero-preview hidden lg:block lg:flex-shrink-0 lg:relative lg:z-[2] max-lg:hidden">
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
        <div className="rl-hero-content lg:flex-1 lg:overflow-hidden">
          <div className="mb-[16px] inline-flex items-center gap-[8px] rounded-full border border-[color:rgba(95,84,240,0.08)] bg-[var(--purple-bg)] px-[12px] py-[7px] text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--purple-dark)] lg:hidden max-lg:hidden">
            ATS resume builder
          </div>

          <p className="hero-mobile-eyebrow lg:hidden max-lg:block max-lg:!mb-[14px] max-lg:!font-serif-display max-lg:!text-[18px] max-lg:!font-normal max-lg:!italic max-lg:!tracking-normal max-lg:!normal-case max-lg:!text-[var(--hero-accent)]">An ATS resume builder</p>

          <p className="hero-desktop-eyebrow hidden lg:block">An ATS resume builder</p>

          <h1 className="mb-[12px] text-[29px] font-black leading-[1.1] tracking-[-0.04em] text-[var(--text-dark)] lg:font-serif-display lg:font-normal lg:text-[clamp(40px,4vw,60px)] lg:mb-[16px] lg:leading-[1.02] lg:tracking-[-0.028em] max-lg:!mb-[18px] max-lg:!font-serif-display max-lg:!text-[clamp(38px,11vw,44px)] max-lg:!font-normal max-lg:!leading-[1.02] max-lg:!tracking-[-0.028em] max-lg:!text-[var(--hero-ink)]">
            <span className="lg:whitespace-nowrap max-lg:block max-lg:!text-[var(--hero-ink)] max-lg:!font-normal max-lg:!not-italic">Build your ATS Resume</span>
            <br className="max-lg:hidden" />
            <span className="text-[var(--purple)] lg:whitespace-nowrap lg:text-[var(--hero-muted)] lg:italic max-lg:block max-lg:!text-[var(--hero-muted)] max-lg:!font-normal max-lg:!italic">in just 2 minutes for FREE!</span>
          </h1>

          <div className="hero-desktop-summary max-lg:block">
            <p className="mb-[8px] text-[14px] leading-[1.5] text-[var(--text-mid)] lg:text-[17px] xl:text-[18px] lg:mb-[12px] max-lg:!mb-[18px] max-lg:!max-w-[34ch] max-lg:!text-[16.5px] max-lg:!leading-[1.5] max-lg:!text-[var(--hero-muted)]">
              Easily create a resume from any device with our ATS-friendly templates trusted by recruiters.
            </p>
            <div className="hero-desktop-interviews hidden lg:block">
              <span>8x</span>
              <span>more interviews</span>
            </div>
          </div>

          <div className="hero-mobile-interviews-row lg:hidden max-lg:flex max-lg:items-baseline max-lg:gap-3 max-lg:mb-[26px]">
            <span className="max-lg:font-serif-display max-lg:text-[64px] max-lg:font-normal max-lg:italic max-lg:leading-[0.9] max-lg:tracking-[-0.04em] max-lg:text-[var(--hero-accent)]">8x</span>
            <span className="max-lg:text-[15px] max-lg:leading-[1.3] max-lg:text-[var(--hero-muted)]">more interviews</span>
          </div>

          <p className="mb-[18px] text-[14.5px] font-semibold text-[var(--text-dark)] lg:hidden max-lg:hidden">
            Land <span className="font-extrabold text-[var(--purple)]">{count}x</span> more interviews
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-[10px] sm:flex-row sm:items-center lg:gap-[14px] max-lg:!flex-col max-lg:!items-stretch max-lg:!gap-[10px]">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCreateResume?.();
              }}
              className="block w-full rounded-[50px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] px-[24px] py-[16px] text-[15.5px] font-bold text-white no-underline shadow-[0_16px_30px_rgba(95,84,240,0.22)] transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-[0_18px_34px_rgba(95,84,240,0.26)] sm:w-auto sm:inline-block lg:px-[36px] lg:py-[16px] lg:text-[16px] xl:px-[40px] xl:py-[18px] xl:text-[17px] text-center max-lg:!block max-lg:!w-full max-lg:!h-[50px] max-lg:!min-h-[50px] max-lg:!rounded-[10px] max-lg:!px-4 max-lg:!py-0 max-lg:!text-[15.5px] max-lg:!font-medium max-lg:!text-[var(--bg)] max-lg:!shadow-none max-lg:!transform-none max-lg:!bg-[var(--hero-ink)] max-lg:!bg-none max-lg:hover:!shadow-none max-lg:!flex max-lg:!items-center max-lg:!justify-center max-lg:!px-5 max-lg:!text-center max-lg:!leading-none"
            >
              Build Resume
            </a>
            <a
              href="/interview-prep"
              className="block w-full rounded-[50px] border-2 border-[color:var(--text-dark)] bg-[var(--card-bg)] px-[24px] py-[14px] text-[15px] font-bold text-[var(--text-dark)] no-underline transition-colors hover:border-[var(--purple)] hover:text-[var(--purple)] sm:w-auto sm:inline-block lg:px-[36px] lg:py-[14px] lg:text-[16px] text-center max-lg:!block max-lg:!w-full max-lg:!h-[50px] max-lg:!min-h-[50px] max-lg:!rounded-[10px] max-lg:!border max-lg:!border-[var(--hero-line)] max-lg:!bg-transparent max-lg:!px-4 max-lg:!py-0 max-lg:!text-[15.5px] max-lg:!font-medium max-lg:!text-[var(--hero-ink)] max-lg:!flex max-lg:!items-center max-lg:!justify-center max-lg:!px-5 max-lg:!text-center max-lg:!leading-none"
            >
              Interview Prep <span className="max-lg:hidden">🎯</span>
            </a>
          </div>
          <a href="/ats-checker" className="hero-ats-check-link mt-[12px] inline-block text-[13px] font-medium text-[var(--text-light)] transition-colors hover:text-[var(--purple)] lg:text-[var(--hero-muted)] max-lg:!mx-auto max-lg:!mt-4 max-lg:!block max-lg:!w-fit max-lg:!text-center max-lg:!text-[14px] max-lg:!text-[var(--hero-muted)] max-lg:!py-[14px]">or check your resume&apos;s <span className="hero-ats-score-link">ATS score</span> <span className="hero-ats-arrow max-lg:hidden">→</span></a>

          {/* Desktop marquee — constrained to right column, goes behind left resume */}
          <div className="rl-hero-desktop-stats mt-[24px] hidden lg:block">
            <StatsStripDesktop />
            <p className="mt-[14px] text-[13px] text-[var(--text-light)]">Your first resume download is free. Upgrade to a plan for unlimited downloads.</p>
          </div>
        </div>
      </div>

      {/* Mobile marquee — full width */}
      <div className="relative z-[1] mt-[16px] lg:hidden max-lg:!mt-0">
        <div className="hidden">
          <MarqueeStrip />
        </div>
        <StatsStripMobile />
        <p className="mt-[10px] text-center text-[11px] text-[var(--text-light)] max-lg:!-mx-6 max-lg:!mt-0 max-lg:!px-6 max-lg:!pb-[22px] max-lg:!text-[12px] max-lg:!text-[var(--hero-muted)]">Your first resume download is free. Upgrade to a plan for unlimited downloads.</p>
      </div>
    </section>
  );
}
