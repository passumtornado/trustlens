export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "trustlens-theme";

const THEME_CHANGE_EVENT = "trustlens-theme-change";

export const themeValues: Theme[] = ["light", "dark", "system"];

export function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
}

export function readStoredTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  return storedTheme && themeValues.includes(storedTheme)
    ? storedTheme
    : "system";
}

// Persists the theme, applies it, and notifies other mounted components in the same tab.
export function setStoredTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(
    new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }),
  );
}

export function subscribeToThemeChanges(callback: (theme: Theme) => void) {
  function handleThemeEvent(event: Event) {
    callback((event as CustomEvent<Theme>).detail);
  }

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeEvent);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeEvent);
}
