import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

function readInitialTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('themePref', next);
      return next;
    });
  }, []);

  return {
    theme,
    toggleTheme,
    isLight: theme === 'light',
  };
}
