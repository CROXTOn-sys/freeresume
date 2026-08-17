function StarRating() {
  return (
    <div className="flex gap-[2px]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-[#00b67a]">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({ text, name, role, avatar, avatarClass = '', title, timeAgo }) {
  return (
    <div className="flex w-[280px] flex-none flex-col rounded-[16px] bg-[var(--card-bg)] px-[20px] pb-[20px] pt-[22px] shadow-[0_2px_12px_rgba(17,24,39,0.05)] lg:w-auto lg:flex-1 lg:rounded-[18px] lg:px-[24px] lg:pb-[24px] lg:pt-[26px] transition-all duration-200 lg:hover:shadow-[0_8px_28px_rgba(17,24,39,0.09)] lg:hover:-translate-y-[1px]">
      {/* Stars */}
      <StarRating />

      {/* Title */}
      <h3 className="mt-[14px] text-[15px] font-bold leading-[1.3] text-[var(--text-dark)] lg:text-[16px]">
        {title || text.split(' ').slice(0, 5).join(' ') + '...'}
      </h3>

      {/* Review text */}
      <p className="mt-[10px] flex-1 text-[13px] leading-[1.6] text-[var(--text-mid)] lg:text-[14px]">
        {text}
      </p>

      {/* Reviewer */}
      <div className="mt-[16px] text-[12px] text-[var(--text-light)] lg:text-[13px]">
        <span className="font-medium text-[var(--text-mid)]">{name}</span> · {timeAgo || role}
      </div>
    </div>
  );
}
