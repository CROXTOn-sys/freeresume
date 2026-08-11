'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { supabase } from '../lib/supabase';

export default function Navbar({ theme, onToggleTheme }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[100] mx-auto flex w-full max-w-[480px] items-center justify-between border-b border-[color:var(--border-soft)] bg-[var(--nav-bg)] px-[18px] py-[14px] shadow-[var(--nav-shadow)] backdrop-blur-[18px] lg:max-w-none lg:px-[64px] lg:py-[16px] lg:rounded-none">
        <a href="#" className="flex items-center gap-[8px] text-[17px] font-bold text-[var(--text-dark)] no-underline lg:text-[19px]">
          <img src="/images/logo.png" alt="ResumeLab" className="h-[32px] w-[32px] rounded-[10px]" />
          ResumeLab
        </a>

        {/* Desktop inline nav links */}
        <div className="hidden lg:flex items-center gap-[32px]">
          <button type="button" onClick={() => scrollTo('templates-section')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Templates</button>
          <button type="button" onClick={() => router.push('/my-resumes')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">My Resumes</button>
          <button type="button" onClick={() => router.push('/interview-prep')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Interview Prep</button>
          <button type="button" onClick={() => scrollTo('reviews-section')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Reviews</button>
          <button type="button" onClick={() => router.push('/about')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">About</button>
        </div>

        <div className="flex items-center gap-[10px]">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {user ? (
            <>
              <span className="hidden lg:inline-flex items-center gap-[6px] rounded-[22px] bg-[rgba(108,99,255,0.08)] px-[14px] py-[8px] text-[13px] font-semibold text-[color:var(--purple)]">
                {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
              </span>
              <button type="button" onClick={handleSignOut} className="hidden lg:inline-flex items-center gap-[5px] rounded-[22px] border border-[color:#d8d2ff] bg-[rgba(108,99,255,0.04)] px-[14px] py-[8px] text-[13px] font-semibold text-[color:var(--purple)] hover:bg-[rgba(108,99,255,0.1)] transition-colors">
                Sign Out
              </button>
              <span className="lg:hidden flex items-center gap-[6px] rounded-[22px] bg-[rgba(108,99,255,0.08)] px-[14px] py-[8px] text-[13px] font-semibold text-[color:var(--purple)]">
                {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
              </span>
            </>
          ) : (
            <a
              href="/auth/signup"
              className="flex items-center gap-[6px] rounded-[22px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] px-[16px] py-[8px] text-[13.5px] font-semibold text-white no-underline shadow-[0_10px_20px_rgba(95,84,240,0.2)]"
            >
              <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] fill-white">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
              Sign Up
            </a>
          )}

          <a href="https://www.croxton.in/" target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex text-[12px] font-medium text-[var(--text-light)] hover:text-[var(--purple)] transition-colors">Croxton.in</a>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-[36px] w-[36px] flex-col items-center justify-center gap-[4px] rounded-full border border-[color:var(--border)] bg-[linear-gradient(180deg,var(--control-bg-start),var(--control-bg-end))] p-[10px] shadow-[0_4px_12px_rgba(17,24,39,0.04)] lg:hidden"
          >
            <span className="block h-[2px] w-[16px] rounded-[2px] bg-[var(--text-dark)]" />
            <span className="block h-[2px] w-[16px] rounded-[2px] bg-[var(--text-dark)]" />
            <span className="block h-[2px] w-[16px] rounded-[2px] bg-[var(--text-dark)]" />
          </button>
        </div>
      </nav>

      {/* Menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[4px]" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 flex h-full w-[280px] flex-col bg-white shadow-[-10px_0_40px_rgba(17,24,39,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[color:#eceef2] px-[20px] py-[16px]">
              <span className="text-[15px] font-bold text-black">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[16px] font-semibold text-black"
              >
                ×
              </button>
            </div>

            {/* Menu items */}
            <div className="flex flex-col px-[20px] py-[16px] gap-[4px]">
              <button
                type="button"
                onClick={() => scrollTo('templates-section')}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-black hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Templates
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); router.push('/my-resumes'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-black hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                My Resumes
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); router.push('/interview-prep'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-black hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Interview Prep
              </button>
              <button
                type="button"
                onClick={() => scrollTo('reviews-section')}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-black hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Reviews
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); router.push('/about'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-black hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                About
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); window.open('https://www.croxton.in/#products', '_blank'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-black hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Explore More Apps
              </button>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-[color:#eceef2] px-[20px] py-[16px]">
              <p className="mb-[12px] text-center text-[12px] text-[#999]">
                powered by <a href="https://croxton.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--purple)] no-underline">Croxton.in</a>
              </p>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); user ? handleSignOut() : router.push('/auth/login'); }}
                className="flex w-full items-center justify-center gap-[8px] rounded-[12px] border border-[color:#d8d2ff] bg-[rgba(108,99,255,0.04)] px-[16px] py-[10px] text-[13px] font-semibold text-[color:var(--purple)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                {user ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
