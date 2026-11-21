 'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';

const announcementMessages = [
  'Build an ATS-friendly resume',
  'Choose from professional templates',
  'Enhance your resume with AI',
  'Unlimited Resume Downloads — Free Until December 15, 2026.',
];
const announcementLoop = [...announcementMessages, ...announcementMessages, ...announcementMessages];

function ProfileAvatar({ user }) {
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const [failedAvatarUrl, setFailedAvatarUrl] = useState(null);
  const showImage = typeof avatarUrl === 'string' && avatarUrl.length > 0 && failedAvatarUrl !== avatarUrl;

  return (
    <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--border)] bg-[rgba(108,99,255,0.08)] text-[color:var(--purple)]">
      {showImage ? (
        <img
          src={avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedAvatarUrl(avatarUrl)}
          className="h-full w-full object-cover"
        />
      ) : (
        <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      )}
    </span>
  );
}

export default function Navbar(props = {}) {
  const ctx = useTheme();
  // Fall back to context so the Navbar works on any page without explicit props.
  const theme = props.theme ?? ctx.theme;
  const onToggleTheme = props.onToggleTheme ?? ctx.toggleTheme;
  const canToggle = props.canToggle ?? ctx.canToggle;
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePinned, setProfilePinned] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert('Unable to sign out. Please try again.');
      return;
    }
    setUser(null);
    setMenuOpen(false);
    setProfileOpen(false);
    setProfilePinned(false);
  };

  const handleShare = async () => {
    const message = 'I found a free resume builder that might be useful: https://resumebuilderlab.com';

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text: message });
      } catch (error) {
        if (error?.name !== 'AbortError') {
          window.alert('Unable to share right now. Please try again.');
        }
      }
      return;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    setProfileOpen(false);
    setProfilePinned(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <>
      <nav className="rl-navbar fixed left-0 right-0 top-0 z-[100] mx-auto flex w-full max-w-[480px] items-center justify-between border-b border-[color:var(--border-soft)] bg-[var(--nav-bg)] px-[18px] py-[14px] shadow-[var(--nav-shadow)] backdrop-blur-[18px] lg:max-w-none lg:px-[64px] lg:py-[16px] lg:rounded-none">
        <a href="#" className="flex items-center gap-[8px] text-[17px] font-bold text-[var(--text-dark)] no-underline lg:text-[19px]">
          <img src="/images/logo.png" alt="ResumeLab" className="h-[32px] w-[32px] rounded-[10px]" />
          ResumeLab
        </a>

        {/* Desktop inline nav links */}
        <div className="hidden lg:flex items-center gap-[32px]">
          <button type="button" onClick={() => scrollTo('templates-section')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Templates</button>
          <button type="button" onClick={() => router.push('/my-resumes')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">My Resumes</button>
          <button type="button" onClick={() => router.push('/interview-prep')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Interview Prep</button>
          <button type="button" onClick={() => router.push('/ats-checker')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">ATS Checker</button>
          <button type="button" onClick={() => scrollTo('reviews-section')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Reviews</button>
          <button type="button" onClick={() => router.push('/about')} className="text-[14px] font-medium text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">About</button>
        </div>

        <div className="flex items-center gap-[10px]">
          {canToggle && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}

          {user ? (
            <>
              <div
                className="relative hidden lg:block"
                onMouseEnter={() => {
                  if (!profilePinned) setProfileOpen(true);
                }}
                onMouseLeave={() => {
                  if (!profilePinned) setProfileOpen(false);
                }}
              >
                <button
                  type="button"
                  aria-label={user.email ? `Account menu for ${user.email}` : 'Account menu'}
                  aria-expanded={profileOpen}
                  onClick={() => {
                    if (profilePinned) {
                      setProfileOpen(false);
                      setProfilePinned(false);
                    } else {
                      setProfileOpen(true);
                      setProfilePinned(true);
                    }
                  }}
                  className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full"
                >
                  <ProfileAvatar user={user} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full z-[110] mt-[8px] w-[240px] rounded-[14px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[12px] shadow-[var(--shadow-md)]">
                    <p className="break-all px-[4px] py-[4px] text-[12px] text-[var(--text-mid)]">{user.email}</p>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-[8px] w-full rounded-[10px] border border-[color:var(--border)] px-[12px] py-[8px] text-left text-[13px] font-semibold text-[var(--text-dark)] hover:bg-[var(--surface-soft)]"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <div className="relative lg:hidden">
                <button
                  type="button"
                  aria-label={user.email ? `Account menu for ${user.email}` : 'Account menu'}
                  aria-expanded={profileOpen}
                  onClick={() => {
                    setProfilePinned(false);
                    setProfileOpen((open) => !open);
                  }}
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
                >
                  <ProfileAvatar user={user} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full z-[110] mt-[8px] w-[240px] rounded-[14px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[12px] shadow-[var(--shadow-md)]">
                    <p className="break-all px-[4px] py-[4px] text-[12px] text-[var(--text-mid)]">{user.email}</p>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-[8px] w-full rounded-[10px] border border-[color:var(--border)] px-[12px] py-[8px] text-left text-[13px] font-semibold text-[var(--text-dark)] hover:bg-[var(--surface-soft)]"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
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
            aria-label="Share ResumeBuilderLab"
            title="Share ResumeBuilderLab"
            onClick={handleShare}
            className="inline-flex h-[40px] w-[40px] items-center justify-center gap-[7px] rounded-[22px] border border-[color:var(--border)] bg-[var(--card-bg)] text-[var(--text-mid)] transition-colors hover:border-[color:var(--purple)] hover:text-[var(--purple)] lg:w-auto lg:px-[14px]"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4" />
            </svg>
            <span className="hidden text-[13px] font-semibold lg:inline">Share</span>
          </button>
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

      <div className="rl-announcement fixed left-0 right-0 top-[69px] z-[99] flex h-[32px] items-center overflow-hidden bg-[#171525] text-[11px] font-medium text-white lg:top-[77px] lg:h-[32px] lg:text-[13px]" role="region">
        <span className="sr-only">Build an ATS-friendly resume with professional templates and AI. Unlimited Resume Downloads — Free Until December 15, 2026.</span>
        <div className="rl-announcement-track flex w-max items-center" aria-hidden="true">
          {[false, true].map((isDuplicate) => (
            <div
              key={String(isDuplicate)}
              className="rl-announcement-copy flex shrink-0 items-center"
              aria-hidden={isDuplicate ? 'true' : undefined}
            >
              {announcementLoop.map((message, index) => (
                <span key={`${index}-${message}`} className={`inline-flex items-center gap-[10px] whitespace-nowrap px-[14px] ${message === 'Unlimited Resume Downloads — Free Until December 15, 2026.' ? 'font-bold text-[#c4b5fd]' : ''}`}>
                  {message}
                  <span className="h-[4px] w-[4px] rounded-full bg-[#a99cff]" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="h-[33px] lg:h-[41px]" aria-hidden="true" />

      {/* Menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[4px]" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 flex h-full w-[280px] flex-col bg-[var(--card-bg)] shadow-[-10px_0_40px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[color:var(--border)] px-[20px] py-[16px]">
              <span className="text-[15px] font-bold text-[var(--text-dark)]">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--card-bg)] text-[16px] font-semibold text-[var(--text-dark)]"
              >
                ×
              </button>
            </div>

            {/* Menu items */}
            <div className="flex flex-col px-[20px] py-[16px] gap-[4px]">
              <button
                type="button"
                onClick={() => scrollTo('templates-section')}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Templates
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); router.push('/my-resumes'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                My Resumes
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); router.push('/interview-prep'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Interview Prep
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); router.push('/ats-checker'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                ATS Checker
              </button>
              <button
                type="button"
                onClick={() => scrollTo('reviews-section')}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Reviews
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); router.push('/about'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                About
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); window.open('https://www.croxton.in/#products', '_blank'); }}
                className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[12px] text-left text-[14px] font-semibold text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Explore More Apps
              </button>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-[color:var(--border)] px-[20px] py-[16px]">
              <p className="mb-[12px] text-center text-[12px] text-[var(--text-light)]">
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
