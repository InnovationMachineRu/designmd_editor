"use client";

import { Icon, IconSun, IconMoon, IconMonitor } from "@/components/icons";
import { useChromeTheme, CHROME_THEMES, type ChromeTheme } from "@/lib/chromeTheme";

const META: Record<ChromeTheme, { label: string; path: React.ReactNode }> = {
  light: { label: "Light theme", path: IconSun },
  system: { label: "Follow system theme", path: IconMonitor },
  dark: { label: "Dark theme", path: IconMoon },
};

/**
 * Global app-chrome theme switch (Light / System / Dark). Distinct from the
 * preview ThemeToggle, which themes the design document being previewed. Writes
 * the `data-theme` attribute on <html> via lib/chromeTheme.ts.
 */
export function ChromeThemeSwitcher() {
  const [theme, setTheme] = useChromeTheme();
  return (
    <div
      role="group"
      aria-label="App theme"
      className="inline-flex items-center rounded-lg border border-app-border bg-app-panel p-0.5"
    >
      {CHROME_THEMES.map((value) => {
        const active = theme === value;
        const { label, path } = META[value];
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
              active
                ? "bg-app-accent text-app-on-accent"
                : "text-app-muted hover:text-app-text hover:bg-app-panel-2"
            }`}
          >
            <Icon path={path} size={15} />
          </button>
        );
      })}
    </div>
  );
}
