// Shared theme definitions and constants.
// Single source of truth for the app's light/dark CSS variable maps.

export const THEME_STORAGE_KEY = 'ResumeLab-theme';

// Tailwind `lg` breakpoint. At or above this width we treat it as "desktop"
// and force dark mode (no toggle). Below it is "mobile" (light/dark toggle).
export const DESKTOP_BREAKPOINT = 1024;

export const themeVars = {
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

// Convert a themeVars entry into a CSS text block for a given selector.
// Used by the anti-flash inline script in the root layout.
export function themeVarsToCssText(theme) {
  const vars = themeVars[theme] || themeVars.light;
  return Object.entries(vars)
    .filter(([key]) => key.startsWith('--'))
    .map(([key, value]) => `${key}:${value};`)
    .join('');
}
