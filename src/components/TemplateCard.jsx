import Image from 'next/image';
import Link from 'next/link';

function MiniResumeShakra() {
  const line = 'mb-[2px] h-[2.5px] rounded-[2px] bg-[var(--mini-line)]';
  return (
    <div className="w-[86px] rounded-[6px] bg-[var(--mini-bg)] p-[7px_6px] shadow-[var(--mini-shadow)]">
      <div className="mb-[4px] flex items-center gap-[4px]">
        <div className="h-[14px] w-[14px] shrink-0 rounded-full bg-[linear-gradient(135deg,var(--purple),var(--purple-light))]" />
        <div className="h-[4px] w-[40px] rounded-[2px] bg-[var(--mini-name)]" />
      </div>
      <div className="mb-[3px] h-[2px] w-[30px] rounded-[2px] bg-[var(--purple)]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-[80%]`} />
      <div className={`${line} w-[60%]`} />
      <div className="my-[4px] h-[3px] w-[45px] rounded-[2px] bg-[var(--mini-section)]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-[80%]`} />
      <div className={`${line} w-full`} />
      <div className="my-[4px] h-[3px] w-[45px] rounded-[2px] bg-[var(--mini-section)]" />
      <div className={`${line} w-[80%]`} />
      <div className={`${line} w-[60%]`} />
      <div className={`${line} w-full`} />
    </div>
  );
}

function MiniResumeAshish() {
  return (
    <div className="flex w-[86px] gap-[4px] rounded-[6px] bg-[var(--mini-bg)] p-[5px] shadow-[var(--mini-shadow)]">
      <div className="w-[28px] rounded-[2px] bg-[var(--purple)] p-[3px_2px]">
        <div className="mx-auto mb-[4px] h-[18px] w-[18px] rounded-full bg-[rgba(255,255,255,0.3)]" />
        <div className="mb-[2px] h-[2px] w-full rounded-[1px] bg-[rgba(255,255,255,0.6)]" />
        <div className="mb-[2px] h-[2px] w-[60%] rounded-[1px] bg-[rgba(255,255,255,0.6)]" />
        <div className="my-[4px] h-[1px] bg-[rgba(255,255,255,0.2)]" />
        <div className="mb-[2px] h-[2px] w-full rounded-[1px] bg-[rgba(255,255,255,0.6)]" />
        <div className="mb-[2px] h-[2px] w-[60%] rounded-[1px] bg-[rgba(255,255,255,0.6)]" />
        <div className="mb-[2px] h-[2px] w-full rounded-[1px] bg-[rgba(255,255,255,0.6)]" />
        <div className="my-[4px] h-[1px] bg-[rgba(255,255,255,0.2)]" />
        <div className="mb-[2px] h-[2px] w-[60%] rounded-[1px] bg-[rgba(255,255,255,0.6)]" />
        <div className="h-[2px] w-full rounded-[1px] bg-[rgba(255,255,255,0.6)]" />
      </div>
      <div className="flex-1 pt-[2px]">
        <div className="mb-[2px] h-[3px] w-full rounded-[1px] bg-[#444]" />
        <div className="mb-[2px] h-[2px] w-[65%] rounded-[1px] bg-[#888]" />
        <div className="my-[3px] h-[2.5px] w-[50%] rounded-[1px] bg-[var(--mini-section)]" />
        <div className="mb-[2px] h-[2px] w-full rounded-[1px] bg-[var(--mini-line)]" />
        <div className="mb-[2px] h-[2px] w-full rounded-[1px] bg-[var(--mini-line)]" />
        <div className="mb-[2px] h-[2px] w-[65%] rounded-[1px] bg-[var(--mini-line)]" />
        <div className="my-[3px] h-[2.5px] w-[50%] rounded-[1px] bg-[var(--mini-section)]" />
        <div className="mb-[2px] h-[2px] w-full rounded-[1px] bg-[var(--mini-line)]" />
        <div className="mb-[2px] h-[2px] w-[65%] rounded-[1px] bg-[var(--mini-line)]" />
        <div className="h-[2px] w-full rounded-[1px] bg-[var(--mini-line)]" />
      </div>
    </div>
  );
}

function MiniResumeHenna() {
  const line = 'mb-[2px] h-[2.5px] rounded-[2px] bg-[var(--mini-line)]';
  return (
    <div className="w-[75px] rounded-[6px] bg-[var(--mini-bg)] p-[7px_6px] shadow-[var(--mini-shadow)]">
      <div className="sara-top -mx-[5px] mb-[4px] mt-[-6px] flex h-[22px] items-center gap-[3px] rounded-t-[2px] bg-[#2d2d2d] px-[4px]">
        <div className="h-[6px] w-[6px] rounded-full bg-[rgba(255,255,255,0.4)]" />
        <div className="h-[6px] w-[6px] rounded-full bg-[rgba(255,255,255,0.4)]" />
      </div>
      <div className={`${line} w-full`} />
      <div className={`${line} w-[80%]`} />
      <div className="my-[4px] h-[3px] w-[45px] rounded-[2px] bg-[var(--mini-section)]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-[80%]`} />
      <div className={`${line} w-[60%]`} />
      <div className="my-[4px] h-[3px] w-[45px] rounded-[2px] bg-[var(--mini-section)]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-[80%]`} />
    </div>
  );
}

function MiniResumeNova() {
  const line = 'mb-[2px] h-[2.5px] rounded-[2px] bg-[var(--mini-line)]';
  return (
    <div className="w-[86px] rounded-[6px] bg-[var(--mini-bg)] p-[7px_6px] shadow-[var(--mini-shadow)]">
      <div className="mb-[4px] flex items-center gap-[4px]">
        <div className="h-[14px] w-[14px] shrink-0 rounded-full bg-[#22c55e]" />
        <div className="h-[4px] w-[40px] rounded-[2px] bg-[var(--mini-name)]" />
      </div>
      <div className="mb-[3px] h-[2px] w-[30px] rounded-[2px] bg-[#22c55e]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-[80%]`} />
      <div className={`${line} w-[60%]`} />
      <div className="my-[4px] h-[3px] w-[45px] rounded-[2px] bg-[#22c55e]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-[80%]`} />
      <div className="my-[4px] h-[3px] w-[45px] rounded-[2px] bg-[#22c55e]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-[60%]`} />
    </div>
  );
}

export default function TemplateCard({ badge, title, users, variant, thumbClass = '', isPreview = false, href, templateId }) {
  const CardTag = href ? Link : 'div';
  const cardProps = href ? { href } : {};

  return (
    <CardTag
      {...cardProps}
      className="relative block flex-[0_0_clamp(118px,38vw,130px)] overflow-hidden rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] shadow-[0_10px_24px_rgba(17,24,39,0.05)]"
    >
      <div className="absolute left-[10px] top-[10px] z-[2] rounded-full border border-[color:var(--badge-border)] bg-[var(--badge-bg)] px-[7px] py-[4px] text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--badge-text)] shadow-[0_8px_18px_rgba(17,24,39,0.06)]">
        {badge}
      </div>

      <div className={`relative flex h-[174px] w-full items-center justify-center overflow-hidden ${thumbClass}`}>
        {isPreview && templateId === 1 && (
          <div className="flex h-full w-full items-center justify-center bg-white px-[8px] py-[8px]">
            <div className="relative h-full w-full overflow-hidden rounded-[6px]">
              <Image
                src="/images/template1.png"
                alt="Resume template preview"
                fill
                sizes="(max-width: 480px) 38vw, 130px"
                className="object-contain object-center"
                priority
              />
            </div>
          </div>
        )}
        {isPreview && templateId === 2 && (
          <div className="flex h-full w-full items-center justify-center bg-white px-[8px] py-[8px]">
            <div className="relative h-full w-full overflow-hidden rounded-[6px]">
              <Image
                src="/images/template2.png"
                alt="Resume template preview"
                fill
                sizes="(max-width: 480px) 38vw, 130px"
                className="object-contain object-center"
              />
            </div>
          </div>
        )}
        {!isPreview && templateId === 1 && <MiniResumeShakra />}
        {!isPreview && templateId === 2 && <MiniResumeAshish />}
        {variant === 'henna' && <MiniResumeHenna />}
        {variant === 'nova' && <MiniResumeNova />}
      </div>

      <div className="px-[11px] pb-[12px] pt-[11px]">
        <div className="mb-[4px] text-[13.5px] font-extrabold tracking-[-0.01em] text-[var(--text-dark)]">
          {title}
        </div>
        <div className="flex items-center gap-[4px] text-[11px] leading-[1.25] text-[var(--text-light)]">
          <svg viewBox="0 0 24 24" className="h-[12px] w-[12px] fill-[var(--text-light)]">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          Chosen by {users}
        </div>
      </div>
    </CardTag>
  );
}
