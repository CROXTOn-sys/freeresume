export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={onToggle}
      className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[color:var(--border)] bg-[linear-gradient(180deg,var(--control-bg-start),var(--control-bg-end))] text-[var(--text-mid)] shadow-[0_4px_12px_rgba(17,24,39,0.04)]"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M21 13.2A8.5 8.5 0 0 1 10.8 3a1 1 0 0 0-1.2 1.2A9.5 9.5 0 1 0 19.8 14.4a1 1 0 0 0 1.2-1.2Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-8.5a1 1 0 0 1-1-1V3.5a1 1 0 1 1 2 0V5a1 1 0 0 1-1 1Zm0 13a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1Zm8.5-8a1 1 0 0 1-1 1H18a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1Zm-13 0a1 1 0 0 1-1 1H4.5a1 1 0 1 1 0-2H6a1 1 0 0 1 1 1Zm11.1-5.6a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 1 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0Zm-9.2 9.2a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0Zm0-9.2a1 1 0 0 1-1.4 0L6.9 5.9a1 1 0 0 1 1.4-1.4l1.1 1.1a1 1 0 0 1 0 1.4Zm9.2 9.2a1 1 0 0 1-1.4 0l-1.1-1.1a1 1 0 0 1 1.4-1.4l1.1 1.1a1 1 0 0 1 0 1.4Z" />
        </svg>
      )}
    </button>
  );
}
