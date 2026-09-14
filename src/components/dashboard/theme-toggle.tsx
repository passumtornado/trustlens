import { useEffect, useState } from "react";

import { Check, Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = localStorage.getItem("trustlens-theme") as Theme | null;
    const nextTheme =
      storedTheme && themeOptions.some((option) => option.value === storedTheme)
        ? storedTheme
        : "system";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  function selectTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem("trustlens-theme", nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-border bg-background p-1"
      aria-label="Color theme"
    >
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => selectTheme(value)}
          className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-pressed:bg-primary/10 aria-pressed:text-primary"
          aria-label={`${label} theme`}
          aria-pressed={theme === value}
          title={`${label} theme`}
        >
          <Icon size={16} />
          {theme === value && (
            <Check size={10} className="absolute right-0.5 top-0.5" />
          )}
        </button>
      ))}
    </div>
  );
}
