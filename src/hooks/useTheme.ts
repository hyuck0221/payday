import { useState, useEffect } from 'react';
import { Theme } from '../types/settings';

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: Theme): void {
  const isDark = theme === 'dark' || (theme === 'system' && getSystemDark());
  document.documentElement.classList.toggle('dark', isDark);
}

export function useTheme(initial: Theme = 'system') {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('payday-theme') as Theme | null;
    return stored ?? initial;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('payday-theme', theme);
  }, [theme]);

  // Listen to system preference changes when theme === 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return { theme, setTheme };
}
