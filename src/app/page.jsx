'use client';

import { useEffect, useState } from 'react';
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
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

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

  return (
    <main
      style={themeVars[theme]}
      className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,var(--overlay-1),transparent_26%),radial-gradient(circle_at_top_right,var(--overlay-2),transparent_22%),linear-gradient(180deg,var(--page-bg-start)_0%,var(--page-bg-mid)_42%,var(--page-bg-end)_100%)] pb-[96px] pt-[68px] text-[var(--text-dark)] transition-colors duration-200"
    >
      <div className="mx-auto w-full max-w-[480px]">
        <Navbar theme={theme} onToggleTheme={onToggleTheme} />
        <Hero />
        <TemplatesSection />
        <TestimonialsSection />
        <FaqSection openIndex={openIndex} onToggle={onToggleFaq} />
      </div>
      <StickyCta />
    </main>
  );
}
