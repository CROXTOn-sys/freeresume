'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TemplatesSection from '../components/TemplatesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FaqSection from '../components/FaqSection';
import ReviewUs from '../components/ReviewUs';
import BugReport from '../components/BugReport';

const themeVars = {
  light: {
    '--purple': '#5f54f0',
    '--purple-light': '#7b73ff',
    '--purple-dark': '#4a41c8',
    '--overlay-1': 'rgba(95, 84, 240, 0.1)',
    '--overlay-2': 'rgba(59, 130, 246, 0.08)',
    '--page-bg-start': '#f8faff',
    '--page-bg-mid': '#f4f6fb',
    '--page-bg-end': '#eef2f8',
    '--nav-bg': 'rgba(255, 255, 255, 0.88)',
    '--nav-shadow': '0 1px 0 rgba(255, 255, 255, 0.7), 0 8px 24px rgba(17, 24, 39, 0.03)',
    '--control-bg-start': '#ffffff',
    '--control-bg-end': '#f7f8fc',
    '--hero-bg': 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.92) 100%)',
    '--section-bg': 'rgba(255, 255, 255, 0.92)',
    '--section-bg-soft': 'rgba(255, 255, 255, 0.88)',
    '--card-bg': '#ffffff',
    '--card-bg-soft': '#fbfcfe',
    '--badge-bg': 'rgba(255, 255, 255, 0.92)',
    '--badge-border': 'rgba(95, 84, 240, 0.12)',
    '--badge-text': '#4a41c8',
    '--surface-soft': 'rgba(255, 255, 255, 0.75)',
    '--sticky-bg': 'rgba(255, 255, 255, 0.94)',
    '--text-dark': '#111827',
    '--text-mid': '#4b5563',
    '--text-light': '#6b7280',
    '--border': '#e5e7eb',
    '--border-soft': 'rgba(229, 231, 235, 0.75)',
    '--purple-bg': '#eef0ff',
    '--mini-bg': '#ffffff',
    '--mini-name': '#333333',
    '--mini-line': '#ddd',
    '--mini-section': '#555555',
    '--mini-shadow': '0 10px 24px rgba(17, 24, 39, 0.13)',
    '--shadow-sm': '0 8px 24px rgba(17, 24, 39, 0.06)',
    '--shadow-md': '0 14px 40px rgba(17, 24, 39, 0.1)',
    colorScheme: 'light',
  },
  dark: {
    '--purple': '#5f54f0',
    '--purple-light': '#7b73ff',
    '--purple-dark': '#4a41c8',
    '--overlay-1': 'rgba(95, 84, 240, 0.14)',
    '--overlay-2': 'rgba(59, 130, 246, 0.1)',
    '--page-bg-start': '#0f131a',
    '--page-bg-mid': '#090b10',
    '--page-bg-end': '#07090d',
    '--nav-bg': 'rgba(10, 12, 16, 0.88)',
    '--nav-shadow': '0 1px 0 rgba(255, 255, 255, 0.02), 0 8px 24px rgba(0, 0, 0, 0.35)',
    '--control-bg-start': '#141922',
    '--control-bg-end': '#0f141b',
    '--hero-bg': 'linear-gradient(180deg, rgba(11, 13, 18, 0.98) 0%, rgba(11, 13, 18, 0.94) 100%)',
    '--section-bg': 'rgba(11, 13, 18, 0.94)',
    '--section-bg-soft': 'rgba(11, 13, 18, 0.94)',
    '--card-bg': '#0f141c',
    '--card-bg-soft': '#0f141c',
    '--badge-bg': 'rgba(10, 12, 16, 0.94)',
    '--badge-border': 'rgba(255, 255, 255, 0.08)',
    '--badge-text': '#f8fafc',
    '--surface-soft': 'rgba(17, 20, 26, 0.86)',
    '--sticky-bg': 'rgba(10, 12, 16, 0.94)',
    '--text-dark': '#f8fafc',
    '--text-mid': '#c3cad6',
    '--text-light': '#94a3b8',
    '--border': '#232833',
    '--border-soft': 'rgba(255, 255, 255, 0.06)',
    '--purple-bg': 'rgba(95, 84, 240, 0.16)',
    '--mini-bg': '#0f141c',
    '--mini-name': '#e5e7eb',
    '--mini-line': '#cbd5e1',
    '--mini-section': '#f8fafc',
    '--mini-shadow': '0 10px 24px rgba(0, 0, 0, 0.35)',
    '--shadow-sm': '0 8px 24px rgba(0, 0, 0, 0.25)',
    '--shadow-md': '0 14px 40px rgba(0, 0, 0, 0.3)',
    colorScheme: 'dark',
  },
};

export default function Page() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [highlightTemplates, setHighlightTemplates] = useState(false);
  const [importing, setImporting] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const uploadInputRef = useRef(null);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('ResumeLab-theme');
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
      setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    } catch {
      setTheme('light');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem('ResumeLab-theme', theme);
    } catch {
      // no-op
    }
  }, [mounted, theme]);

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  const onToggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const onToggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const openBuildModal = () => {
    setBuildStep(0);
    // Pre-fill from sessionStorage if available
    try {
      const saved = window.sessionStorage.getItem('ResumeLab-target-job');
      if (saved) {
        const parsed = JSON.parse(saved);
        const title = parsed?.title || parsed?.targetJobTitle || '';
        const desc = parsed?.description || parsed?.targetJobDescription || '';
        if (title.trim()) {
          setTargetJobTitle(title);
          setTargetJobDescription(desc);
        }
      }
    } catch {}
    setShowJobModal(true);
  };

  const closeBuildModal = () => {
    setShowBuildModal(false);
    setShowJobModal(false);
    setBuildStep(0);
    setTargetJobTitle('');
    setTargetJobDescription('');
  };

  const saveTargetJob = () => {
    try {
      window.sessionStorage.setItem(
        'ResumeLab-target-job',
        JSON.stringify({
          title: targetJobTitle.trim(),
          description: targetJobDescription.trim(),
          targetJobTitle: targetJobTitle.trim(),
          targetJobDescription: targetJobDescription.trim(),
        })
      );
    } catch {
      // ignore storage issues
    }
  };

  const handleBuildNext = () => {
    if (!targetJobTitle.trim() || !targetJobDescription.trim()) return;
    saveTargetJob();
    setBuildStep(1);
  };

  const promptTemplateSelection = () => {
    setShowBuildModal(false);
    setShowTemplatePrompt(true);
  };

  const handleHomepageFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import-resume', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || 'Import failed');
      }

      try {
        window.sessionStorage.setItem(
          'ResumeLab-imported-resume',
          JSON.stringify({
            data: payload.data || {},
            rawText: payload.rawText || '',
            sourceType: payload.sourceType || '',
          })
        );
        if (payload.rawText) {
          window.sessionStorage.setItem('ResumeLab-imported-raw-text', payload.rawText);
        }
      } catch {
        // ignore storage issues
      }

      router.push('/resume-builder/editor?template=1');
    } catch (error) {
      window.alert(error?.message || 'Unable to import resume right now.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <main
      style={themeVars[theme]}
      className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,var(--overlay-1),transparent_26%),radial-gradient(circle_at_top_right,var(--overlay-2),transparent_22%),linear-gradient(180deg,var(--page-bg-start)_0%,var(--page-bg-mid)_42%,var(--page-bg-end)_100%)] pb-0 pt-[68px] text-[var(--text-dark)] transition-colors duration-200"
    >
      <input
        ref={uploadInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleHomepageFileChange}
      />

      <div className="mx-auto w-full max-w-[480px] lg:max-w-none">
        <Navbar theme={theme} onToggleTheme={onToggleTheme} />
        <Hero onCreateResume={promptTemplateSelection} />
        <div data-animate>
          <TemplatesSection highlight={highlightTemplates} />
        </div>
        <div data-animate>
          <TestimonialsSection />
        </div>
        <div data-animate>
          <FaqSection openIndex={openIndex} onToggle={onToggleFaq} />
        </div>
        <div data-animate>
          <ReviewUs />
        </div>

        {/* Footer - Mobile: simple links, Desktop: rich columns */}
        <div className="lg:hidden mt-[16px] flex items-center justify-center gap-[12px] pb-[8px] text-[11px] text-[#999]">
          <a href="/privacy" className="hover:text-[#6C63FF] transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href="/terms" className="hover:text-[#6C63FF] transition-colors">Terms of Service</a>
          <span>|</span>
          <a href="/refund" className="hover:text-[#6C63FF] transition-colors">Refund Policy</a>
        </div>

        <footer className="hidden lg:block lg:mt-[48px] lg:border-t lg:border-[color:var(--border-soft)] lg:pt-[40px] lg:pb-[32px] lg:px-[64px]">
          <div className="lg:max-w-[1120px] lg:mx-auto lg:grid lg:grid-cols-3 lg:gap-[48px]">
            <div>
              <h4 className="text-[14px] font-bold text-[var(--text-dark)] mb-[14px]">Product</h4>
              <ul className="list-none p-0 m-0 space-y-[10px]">
                <li><a href="/resume-builder" className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Templates</a></li>
                <li><a href="/my-resumes" className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">My Resumes</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); promptTemplateSelection(); }} className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Create Resume</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[var(--text-dark)] mb-[14px]">Company</h4>
              <ul className="list-none p-0 m-0 space-y-[10px]">
                <li><a href="/about" className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">About</a></li>
                <li><a href="/privacy" className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Terms of Service</a></li>
                <li><a href="/refund" className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[var(--text-dark)] mb-[14px]">Connect</h4>
              <ul className="list-none p-0 m-0 space-y-[10px]">
                <li><a href="/api/reviews" className="text-[13px] text-[var(--text-mid)] hover:text-[var(--purple)] transition-colors">Review Us</a></li>
              </ul>
            </div>
          </div>
          <div className="lg:max-w-[1120px] lg:mx-auto lg:mt-[32px] lg:pt-[20px] lg:border-t lg:border-[color:var(--border-soft)] lg:text-center">
            <p className="text-[12px] text-[var(--text-light)]">© 2024 ResumeLab. All rights reserved. Powered by Croxton.in</p>
          </div>
        </footer>
      </div>
      <BugReport />
      {/* My Resumes shortcut button */}
      <button type="button" onClick={() => router.push('/my-resumes')} className="fixed bottom-[80px] right-[16px] z-[95] flex h-[46px] w-[46px] items-center justify-center rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)]" aria-label="My Resumes">
        <img src="/images/download.png" alt="My Resumes" className="h-[46px] w-[46px] rounded-full" />
      </button>

      {showTemplatePrompt ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(17,24,39,0.35)] px-[12px] backdrop-blur-[3px]" onClick={() => setShowTemplatePrompt(false)}>
          <div className="w-full max-w-[400px] rounded-[22px] bg-white p-[24px] shadow-[0_24px_60px_rgba(17,24,39,0.22)] lg:max-w-[560px] lg:p-[32px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-[18px] text-center text-[18px] font-bold text-black lg:text-[22px] lg:mb-[24px]">Choose a template</h3>
            <div className="grid grid-cols-2 gap-[14px] lg:gap-[20px]">
              <a href="/template-details?template=1" className="group block overflow-hidden rounded-[16px] border-2 border-[#e5e7eb] transition-all hover:border-[var(--purple)] hover:shadow-[0_8px_20px_rgba(99,91,255,0.15)]">
                <img src="/images/template1.png" alt="Template 1" className="w-full aspect-[3/4] object-cover object-top" />
                <div className="px-[10px] py-[8px] text-center text-[13px] font-semibold text-[#333] group-hover:text-[var(--purple)] lg:text-[15px] lg:py-[10px]">Classic</div>
              </a>
              <a href="/template-details?template=2" className="group block overflow-hidden rounded-[16px] border-2 border-[#e5e7eb] transition-all hover:border-[var(--purple)] hover:shadow-[0_8px_20px_rgba(99,91,255,0.15)]">
                <img src="/images/template2.png" alt="Template 2" className="w-full aspect-[3/4] object-cover object-top" />
                <div className="px-[10px] py-[8px] text-center text-[13px] font-semibold text-[#333] group-hover:text-[var(--purple)] lg:text-[15px] lg:py-[10px]">Modern</div>
              </a>
            </div>
            <p className="mt-[14px] text-center text-[11px] text-[#9ca3af] lg:mt-[18px] lg:text-[12px]">Tap a template to get started</p>
          </div>
        </div>
      ) : null}

      {showJobModal ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[rgba(17,24,39,0.42)] px-[10px] py-[10px] backdrop-blur-[6px] md:items-center">
          <div className="relative w-full max-w-[520px] rounded-[24px] bg-white p-[14px] shadow-[0_24px_60px_rgba(17,24,39,0.24)] md:p-[18px]">
            <button
              type="button"
              aria-label="Close"
              onClick={closeBuildModal}
              className="absolute right-[14px] top-[14px] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[20px] font-light leading-none text-black shadow-[0_8px_18px_rgba(17,24,39,0.08)]"
            >
              x
            </button>

            <main className="bg-white px-[4px] py-[8px] text-black">
              <div className="mx-auto flex w-full max-w-[520px] flex-col">
                {buildStep === 0 ? (
                  <>
                    <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">What are you applying for?</h1>
                    <p className="mt-[8px] text-[15px] leading-[1.45] text-[#7a7a86]">Tell us the target role first. We&apos;ll use it for ATS scoring and AI suggestions.</p>
                    <div className="mt-[18px] grid gap-[12px]">
                      <label className="block">
                        <span className="mb-[6px] block text-[12px] font-semibold text-black">Target Job Title</span>
                        <input
                          value={targetJobTitle}
                          onChange={(e) => setTargetJobTitle(e.target.value)}
                          placeholder="Frontend Developer"
                          className="h-[44px] w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[color:var(--purple)]"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-[6px] block text-[12px] font-semibold text-black">Job Description / ATS Keywords</span>
                        <textarea
                          value={targetJobDescription}
                          onChange={(e) => setTargetJobDescription(e.target.value)}
                          placeholder="Paste the job description here..."
                          rows={6}
                          className="w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] py-[12px] text-[14px] text-black outline-none focus:border-[color:var(--purple)]"
                        />
                      </label>
                    </div>
                    <div className="mt-[18px] flex gap-[10px]">
                      <button type="button" onClick={closeBuildModal} className="h-[52px] flex-1 rounded-[16px] border border-[color:#e5e7eb] bg-white text-[15px] font-bold text-black">Cancel</button>
                      <button type="button" onClick={handleBuildNext} disabled={!targetJobTitle.trim() || !targetJobDescription.trim()} className="h-[52px] flex-1 rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white disabled:opacity-50">Next</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">How would you like to build your resume?</h1>
                    <p className="mt-[8px] text-[15px] leading-[1.45] text-[#7a7a86]">Upload an existing one or start fresh - we&apos;ll make it easy either way!</p>
                    <div className="mt-[8px] rounded-[14px] bg-[rgba(95,84,240,0.06)] px-[12px] py-[10px] text-[12px] text-[#4a41c8]">Optimizing for: <span className="font-bold">{targetJobTitle}</span></div>
                    <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
                      <div className="relative cursor-pointer text-left">
                        <input
                          ref={uploadInputRef}
                          type="file"
                          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="absolute inset-0 z-[2] h-full w-full cursor-pointer opacity-0"
                          onChange={handleHomepageFileChange}
                        />
                        <div className="rounded-[16px] border border-[color:#222] bg-[rgba(255,255,255,0.92)] p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                          <div className="flex justify-center text-[30px] text-[#666]">☁</div>
                          <div className="mt-[10px] text-center">
                            <h2 className="text-[15px] font-bold text-black">{importing ? 'Importing...' : 'Upload resume'}</h2>
                            <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">PDF, DOCX . Max file size: 10 MB</p>
                          </div>
                        </div>
                      </div>
                      <div className="relative rounded-[16px] border border-[color:#d9d9e3] bg-white p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)] opacity-60">
                        <div className="absolute top-[10px] right-[10px]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        </div>
                        <div className="flex justify-center text-[34px] font-bold text-[#0a66c2]">in</div>
                        <div className="mt-[10px] text-center">
                          <h2 className="text-[15px] font-bold text-black">Import LinkedIn</h2>
                          <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">Coming soon</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-[14px] rounded-[16px] border border-[color:#d9d9e3] bg-white p-[16px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                      <div className="flex items-center gap-[12px]">
                        <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[18px] font-bold text-white">✦</div>
                        <div>
                          <h2 className="text-[15px] font-bold text-black">AI Enhancement</h2>
                          <p className="mt-[4px] text-[12px] text-[#666]">Enhance your bullet points and descriptions with AI</p>
                        </div>
                        <span className="ml-auto rounded-full bg-[rgba(108,99,255,0.12)] px-[10px] py-[4px] text-[11px] font-bold text-[color:var(--purple)]">Free</span>
                      </div>
                    </div>
                    <div className="my-[18px] flex items-center gap-[12px] text-[#a0a0ad]">
                      <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                      <span className="text-[13px]">or</span>
                      <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                    </div>
                    <Link
                      href="/resume-builder/editor?template=1"
                      onClick={() => {
                        saveTargetJob();
                        closeBuildModal();
                      }}
                      className="flex h-[52px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(108,99,255,0.22)]"
                    >
                      + Start from scratch
                    </Link>
                    <button type="button" onClick={closeBuildModal} className="mt-[10px] h-[48px] w-full rounded-[16px] border border-[color:#e5e7eb] bg-white text-[14px] font-semibold text-black">Cancel</button>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      ) : null}

      {showBuildModal ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[rgba(17,24,39,0.42)] px-[10px] py-[10px] backdrop-blur-[6px] md:items-center">
          <div className="relative w-full max-w-[520px] rounded-[24px] bg-white p-[14px] shadow-[0_24px_60px_rgba(17,24,39,0.24)] md:p-[18px]">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowBuildModal(false)}
              className="absolute right-[14px] top-[14px] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[20px] font-light leading-none text-black shadow-[0_8px_18px_rgba(17,24,39,0.08)]"
            >
              ×
            </button>

            <main className="bg-white px-[4px] py-[8px] text-black">
              <div className="mx-auto flex w-full max-w-[520px] flex-col">
                <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">
                  How would you like to build your resume?
                </h1>
                <p className="mt-[8px] text-[15px] leading-[1.45] text-[#7a7a86]">
                  Upload an existing one or start fresh - we&apos;ll make it easy either way!
                </p>

                <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
                  <div className="relative cursor-pointer text-left">
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="absolute inset-0 z-[2] h-full w-full cursor-pointer opacity-0"
                      onChange={handleHomepageFileChange}
                    />
                    <div className="rounded-[16px] border border-[color:#222] bg-[rgba(255,255,255,0.92)] p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                      <div className="flex justify-center text-[30px] text-[#666]">☁</div>
                      <div className="mt-[10px] text-center">
                        <h2 className="text-[15px] font-bold text-black">
                          {importing ? 'Importing...' : 'Upload resume'}
                        </h2>
                        <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">
                          PDF, DOCX . Max file size: 10 MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative rounded-[16px] border border-[color:#d9d9e3] bg-white p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)] opacity-60">
                    <div className="absolute top-[10px] right-[10px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </div>
                    <div className="flex justify-center text-[34px] font-bold text-[#0a66c2]">in</div>
                    <div className="mt-[10px] text-center">
                      <h2 className="text-[15px] font-bold text-black">Import LinkedIn</h2>
                      <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">Coming soon</p>
                    </div>
                  </div>
                </div>

                <div className="mt-[14px] rounded-[16px] border border-[color:#d9d9e3] bg-white p-[16px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[18px] font-bold text-white">
                      ✦
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-black">AI Enhancement</h2>
                      <p className="mt-[4px] text-[12px] text-[#666]">Enhance your bullet points and descriptions with AI</p>
                    </div>
                    <span className="ml-auto rounded-full bg-[rgba(108,99,255,0.12)] px-[10px] py-[4px] text-[11px] font-bold text-[color:var(--purple)]">
                      Free
                    </span>
                  </div>
                </div>

                <div className="my-[18px] flex items-center gap-[12px] text-[#a0a0ad]">
                  <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                  <span className="text-[13px]">or</span>
                  <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                </div>

                <Link
                  href="/resume-builder/editor?template=1"
                  onClick={() => setShowBuildModal(false)}
                  className="flex h-[52px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(108,99,255,0.22)]"
                >
                  + Start from scratch
                </Link>
              </div>
            </main>
          </div>
        </div>
      ) : null}
    </main>
  );
}
