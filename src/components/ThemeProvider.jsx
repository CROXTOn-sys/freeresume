'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themeVars, THEME_STORAGE_KEY, DESKTOP_BREAKPOINT } from '../lib/theme';

const ThemeContext = createContext({
  theme: 'light',
  isDesktop: false,
  canToggle: true,
  toggleTheme: () => {},
  mounted: false,
});

function readStoredTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function ThemeProvider({ children }) {
  // The user's chosen theme on mobile (persisted). On desktop this is overridden to 'dark'.
  const [userTheme, setUserTheme] = useState('light');
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // On mount: restore saved preference and measure viewport.
  useEffect(() => {
    setUserTheme(readStoredTheme());
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const apply = () => setIsDesktop(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    setMounted(true);
    return () => mql.removeEventListener('change', apply);
  }, []);

  // Persist the user's mobile choice whenever it changes.
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, userTheme);
    } catch {
      // ignore storage errors
    }
  }, [mounted, userTheme]);

  // Desktop is always dark. Mobile honors the user's choice.
  const theme = isDesktop ? 'dark' : userTheme;
  const canToggle = !isDesktop;

  // Apply the CSS variables + colorScheme to the document root so every page inherits them.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const vars = themeVars[theme] || themeVars.light;
    Object.entries(vars).forEach(([key, value]) => {
      if (key === 'colorScheme') {
        root.style.colorScheme = value;
      } else {
        root.style.setProperty(key, value);
      }
    });
  }, [mounted, theme]);

  const toggleTheme = useCallback(() => {
    // Only meaningful on mobile; desktop is locked to dark.
    setUserTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDesktop, canToggle, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
