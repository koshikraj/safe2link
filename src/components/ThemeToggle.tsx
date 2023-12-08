import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { IconButton, Tooltip } from '@radix-ui/themes';
import Head from 'next/head';

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();

  const handleThemeChange = useCallback(() => {
    const resolvedTheme = theme === 'system' ? systemTheme : theme;
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    const newThemeMatchesSystem = newTheme === systemTheme;
    setTheme(newThemeMatchesSystem ? 'system' : newTheme);
  }, [theme, systemTheme, setTheme]);

  return (
    <>
      <Head>
        <style>{`
        :root, .light, .light-theme {
          --theme-toggle-sun-icon-display: block;
          --theme-toggle-moon-icon-display: none;
        }
        .dark, .dark-theme {
          --theme-toggle-sun-icon-display: none;
          --theme-toggle-moon-icon-display: block;
        }
      `}</style>
      </Head>

      <Tooltip className="radix-themes-custom-fonts" content="Toggle theme">
        <IconButton size="3" variant="ghost" color="gray" onClick={handleThemeChange}>
          <SunIcon
            width="16"
            height="16"
            style={{ display: 'var(--theme-toggle-sun-icon-display)' }}
          />
          <MoonIcon
            width="16"
            height="16"
            style={{ display: 'var(--theme-toggle-moon-icon-display)' }}
          />
        </IconButton>
      </Tooltip>
    </>
  );
}
