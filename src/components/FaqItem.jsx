export default function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div
      className="mb-[10px] cursor-pointer overflow-hidden rounded-[16px] border border-[color:var(--border)] bg-[var(--card-bg-soft)]"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="flex items-center justify-between gap-[12px] px-[15px] py-[15px] text-[14px] font-bold leading-[1.4] text-[var(--text-dark)] select-none">
        {question}
        <div
          className={[
            'flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[16px] font-normal text-[var(--text-mid)] transition-all duration-200',
            isOpen ? 'rotate-45 border-[color:var(--purple)] bg-[var(--purple)] text-white' : '',
          ].join(' ')}
        >
          +
        </div>
      </div>

      <div
        className={[
          'max-h-0 overflow-hidden px-[15px] text-[13.5px] leading-[1.6] text-[var(--text-mid)] transition-[max-height,padding] duration-300',
          isOpen ? 'max-h-[200px] pb-[15px]' : '',
        ].join(' ')}
      >
        {answer}
      </div>
    </div>
  );
}
