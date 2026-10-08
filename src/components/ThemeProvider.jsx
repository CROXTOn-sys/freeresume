'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themeVars, desktopThemeVars, THEME_STORAGE_KEY, DESKTOP_THEME_STORAGE_KEY, DESKTOP_BREAKPOINT } from '../lib/theme';

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
  // Mobile preserves its existing saved/system preference; desktop defaults to light.
  const [userTheme, setUserTheme] = useState('light');
  const [desktopTheme, setDesktopTheme] = useState('light');
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // On mount: restore preferences and measure viewport.
  useEffect(() => {
    setUserTheme(readStoredTheme());
    try {
      const savedDesktopTheme = window.localStorage.getItem(DESKTOP_THEME_STORAGE_KEY);
      if (savedDesktopTheme === 'light' || savedDesktopTheme === 'dark') {
        setDesktopTheme(savedDesktopTheme);
      }
    } catch {
      // Keep the desktop default when storage is unavailable.
    }
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

  useEffect(() => {
    if (!mounted || !isDesktop) return;
    try {
      window.localStorage.setItem(DESKTOP_THEME_STORAGE_KEY, desktopTheme);
    } catch {
      // The selected desktop theme remains active for this session.
    }
  }, [desktopTheme, isDesktop, mounted]);

  const theme = isDesktop ? desktopTheme : userTheme;
  const canToggle = true;

  // Apply the CSS variables + colorScheme to the document root so every page inherits them.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const vars = (isDesktop ? desktopThemeVars : themeVars)[theme] || themeVars.light;
    Object.entries(vars).forEach(([key, value]) => {
      if (key === 'colorScheme') {
        root.style.colorScheme = value;
      } else {
        root.style.setProperty(key, value);
      }
    });
  }, [isDesktop, mounted, theme]);

  const toggleTheme = useCallback(() => {
    if (isDesktop) {
      setDesktopTheme((current) => (current === 'dark' ? 'light' : 'dark'));
      return;
    }
    setUserTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, [isDesktop]);

  return (
    <ThemeContext.Provider value={{ theme, isDesktop, canToggle, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
