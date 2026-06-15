export default function StickyCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99] border-t border-[color:var(--border-soft)] bg-[var(--sticky-bg)] px-[18px] pb-[16px] pt-[12px] shadow-[0_-8px_24px_rgba(17,24,39,0.08)] backdrop-blur-[16px] min-[600px]:left-1/2 min-[600px]:right-auto min-[600px]:w-full min-[600px]:max-w-[480px] min-[600px]:-translate-x-1/2">
      <a
        href="#"
        className="block w-full rounded-[50px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] px-[24px] py-[16px] text-center text-[15.5px] font-bold text-white no-underline shadow-[0_14px_28px_rgba(95,84,240,0.22)]"
      >
        Create Resume Now For FREE
      </a>
    </div>
  );
}
