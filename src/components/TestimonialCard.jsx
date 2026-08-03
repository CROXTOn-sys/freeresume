export default function TestimonialCard({ text, name, role, avatar, avatarClass = '' }) {
  return (
    <div className="flex h-[228px] w-[228px] flex-none flex-col rounded-[20px] border border-[color:var(--border)] bg-[var(--card-bg)] px-[15px] pb-[16px] pt-[18px] shadow-[0_12px_30px_rgba(17,24,39,0.05)] lg:w-auto lg:flex-1 lg:h-auto lg:min-h-[220px] lg:px-[20px] lg:py-[22px] transition-all duration-200 lg:hover:shadow-[0_16px_36px_rgba(17,24,39,0.1)] lg:hover:-translate-y-[2px]">
      <div className="text-[12px] font-bold leading-[1] text-[#f59e0b]">5.0</div>
      <div className="pt-[2px] text-[13px] leading-[1.5] text-[var(--text-mid)]">
        <div className="mb-[10px] block text-[30px] font-black leading-[1] text-[var(--purple)]">"</div>
        {text}
      </div>
      <div className="mt-auto flex items-center gap-[10px]">
        <div className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[var(--purple-bg)] text-[14px] font-bold text-[var(--purple)] shadow-[inset_0_0_0_1px_rgba(95,84,240,0.06)] ${avatarClass}`}>
          {avatar}
        </div>
        <div>
          <div className="text-[13px] font-bold leading-[1.2] text-[var(--text-dark)]">{name}</div>
          <div className="mt-[1px] text-[11.5px] text-[var(--text-light)]">{role}</div>
        </div>
      </div>
    </div>
  );
}
