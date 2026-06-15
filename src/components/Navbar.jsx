import ThemeToggle from './ThemeToggle';

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] mx-auto flex w-full max-w-[480px] items-center justify-between border-b border-[color:var(--border-soft)] bg-[var(--nav-bg)] px-[18px] py-[14px] shadow-[var(--nav-shadow)] backdrop-blur-[18px]">
      <a href="#" className="flex items-center gap-[8px] text-[17px] font-bold text-[var(--text-dark)] no-underline">
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] shadow-[0_8px_18px_rgba(95,84,240,0.25)]">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] fill-white">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
          </svg>
        </div>
        ResumeLab
      </a>

      <div className="flex items-center gap-[10px]">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <a
          href="#"
          className="flex items-center gap-[6px] rounded-[22px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] px-[16px] py-[8px] text-[13.5px] font-semibold text-white no-underline shadow-[0_10px_20px_rgba(95,84,240,0.2)]"
        >
          <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] fill-white">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          Sign Up
        </a>

        <button
          type="button"
          aria-label="Menu"
          className="flex h-[36px] w-[36px] flex-col items-center justify-center gap-[4px] rounded-full border border-[color:var(--border)] bg-[linear-gradient(180deg,var(--control-bg-start),var(--control-bg-end))] p-[10px] shadow-[0_4px_12px_rgba(17,24,39,0.04)]"
        >
          <span className="block h-[2px] w-[16px] rounded-[2px] bg-[var(--text-dark)]" />
          <span className="block h-[2px] w-[16px] rounded-[2px] bg-[var(--text-dark)]" />
          <span className="block h-[2px] w-[16px] rounded-[2px] bg-[var(--text-dark)]" />
        </button>
      </div>
    </nav>
  );
}
