import Image from 'next/image';
import Link from 'next/link';

function DummyResume() {
  const line = 'mb-[6px] h-[4px] rounded-[3px] bg-[#e5e7eb]';
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-[16px]">
      <div className="w-full max-w-[140px] rounded-[8px] border border-[#e5e7eb] bg-white p-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mb-[8px] h-[5px] w-[60%] rounded-[3px] bg-[#d1d5db]" />
        <div className="mb-[4px] h-[3px] w-[80%] rounded-[2px] bg-[#e5e7eb]" />
        <div className="mb-[10px] h-[3px] w-[50%] rounded-[2px] bg-[#e5e7eb]" />
        <div className="mb-[6px] h-[4px] w-[40%] rounded-[3px] bg-[#d1d5db]" />
        <div className={`${line} w-full`} />
        <div className={`${line} w-[85%]`} />
        <div className={`${line} w-[70%]`} />
        <div className="mb-[6px] mt-[8px] h-[4px] w-[40%] rounded-[3px] bg-[#d1d5db]" />
        <div className={`${line} w-full`} />
        <div className={`${line} w-[60%]`} />
      </div>
      <div className="mt-[12px] rounded-full bg-[rgba(108,99,255,0.08)] px-[10px] py-[4px] text-[10px] font-semibold text-[#6C63FF]">
        Coming Soon
      </div>
    </div>
  );
}

export default function TemplateCard({ badge, title, users, variant, thumbClass = '', isPreview = false, href, templateId }) {
  const CardTag = href ? Link : 'div';
  const cardProps = href ? { href } : {};
  const isComingSoon = !isPreview;

  return (
    <div className="flex flex-col items-center gap-[12px] lg:gap-[14px]">
      {/* Label above card */}
      <span className={`text-[11px] font-bold uppercase tracking-[0.1em] lg:text-[12px] ${isComingSoon ? 'text-[var(--text-light)]' : 'text-[var(--purple)]'}`}>
        {badge}
      </span>

      {/* Card */}
      <CardTag
        {...cardProps}
        className={`group relative block w-full overflow-hidden rounded-[14px] bg-white shadow-[0_4px_20px_rgba(17,24,39,0.07)] transition-all duration-300 lg:rounded-[16px] ${
          isComingSoon
            ? 'opacity-60 cursor-default'
            : 'hover:shadow-[0_10px_36px_rgba(17,24,39,0.13)] hover:-translate-y-[2px]'
        }`}
      >
        <div className={`relative flex w-full items-center justify-center overflow-hidden ${isComingSoon ? 'bg-[#f9fafb]' : 'bg-[#f8f9fb]'} p-[8px] lg:p-[12px]`}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[6px] lg:rounded-[8px]">
            {isPreview && templateId === 1 && (
              <Image
                src="/images/template1.png"
                alt="Shakra template preview"
                fill
                sizes="(max-width: 480px) 44vw, (max-width: 1024px) 200px, 260px"
                className="object-cover object-top"
                priority
              />
            )}
            {isPreview && templateId === 2 && (
              <Image
                src="/images/template2.png"
                alt="Ashish template preview"
                fill
                sizes="(max-width: 480px) 44vw, (max-width: 1024px) 200px, 260px"
                className="object-cover object-top"
              />
            )}
            {isComingSoon && <DummyResume />}
          </div>
        </div>
      </CardTag>

      {/* Info below */}
      <div className="text-center">
        <div className="text-[13px] font-bold text-[var(--text-dark)] lg:text-[15px]">
          {title}
        </div>
        {users !== '—' && (
          <div className="mt-[3px] flex items-center justify-center gap-[4px] text-[11px] text-[var(--text-light)] lg:text-[12px]">
            <svg viewBox="0 0 24 24" className="h-[12px] w-[12px] fill-[var(--text-light)]">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            Chosen by {users}
          </div>
        )}
      </div>
    </div>
  );
}
