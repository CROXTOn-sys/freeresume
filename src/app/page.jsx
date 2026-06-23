'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TemplatesSection from '../components/TemplatesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FaqSection from '../components/FaqSection';
import StickyCta from '../components/StickyCta';

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
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [highlightTemplates, setHighlightTemplates] = useState(false);
  const [importing, setImporting] = useState(false);
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

  const onToggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const onToggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const promptTemplateSelection = () => {
    setShowBuildModal(false);
    setShowTemplatePrompt(true);
    setHighlightTemplates(true);

    window.setTimeout(() => {
      document.getElementById('templates-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 140);

    window.setTimeout(() => {
      setShowTemplatePrompt(false);
    }, 1000);

    window.setTimeout(() => {
      setHighlightTemplates(false);
    }, 1300);
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
      className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,var(--overlay-1),transparent_26%),radial-gradient(circle_at_top_right,var(--overlay-2),transparent_22%),linear-gradient(180deg,var(--page-bg-start)_0%,var(--page-bg-mid)_42%,var(--page-bg-end)_100%)] pb-[96px] pt-[68px] text-[var(--text-dark)] transition-colors duration-200"
    >
      <input
        ref={uploadInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleHomepageFileChange}
      />

      <div className="mx-auto w-full max-w-[480px]">
        <Navbar theme={theme} onToggleTheme={onToggleTheme} />
        <Hero onCreateResume={promptTemplateSelection} />
        <TemplatesSection highlight={highlightTemplates} />
        <TestimonialsSection />
        <FaqSection openIndex={openIndex} onToggle={onToggleFaq} />
      </div>
      <StickyCta onCreateResume={promptTemplateSelection} />

      {showTemplatePrompt ? (
        <div className="fixed inset-0 z-[120] flex items-start justify-center bg-[rgba(17,24,39,0.18)] px-[12px] pt-[96px] backdrop-blur-[2px]">
          <div className="rounded-[18px] border border-[color:rgba(95,84,240,0.18)] bg-white px-[14px] py-[10px] text-center shadow-[0_18px_40px_rgba(17,24,39,0.18)]">
            <div className="text-[13px] font-bold text-[var(--purple)]">Please choose a template first</div>
            <div className="mt-[3px] text-[11px] text-[#6b7280]">We&apos;re taking you there now</div>
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
                          PDF, DOCX, or image (.png, .jpeg, .jpg)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-[color:#d9d9e3] bg-white p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                    <div className="flex justify-center text-[34px] font-bold text-[#0a66c2]">in</div>
                    <div className="mt-[10px] text-center">
                      <h2 className="text-[15px] font-bold text-black">Import LinkedIn</h2>
                      <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">Auto-fill from profile</p>
                    </div>
                  </div>
                </div>

                <div className="mt-[14px] rounded-[16px] border border-[color:#d9d9e3] bg-white p-[16px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[18px] font-bold text-white">
                      ✦
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-black">Create with AI Assistance</h2>
                      <p className="mt-[4px] text-[12px] text-[#666]">Speak or type - we&apos;ll build your resume</p>
                    </div>
                    <span className="ml-auto rounded-full bg-[rgba(108,99,255,0.12)] px-[10px] py-[4px] text-[11px] font-bold text-[color:var(--purple)]">
                      New
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
