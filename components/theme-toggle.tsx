"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "tech-note-theme";
const THEME_CHANGE_EVENT = "tech-note-theme-change";
const THEMES = ["system", "light", "dark"] satisfies Theme[];

export function ThemeScript() {
  const script = `
    (() => {
      const stored = localStorage.getItem("${STORAGE_KEY}");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = stored || "system";
      const isDark = theme === "dark" || (theme === "system" && prefersDark);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.dataset.auTheme = isDark ? "dark" : "neutral";
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.dataset.auTheme = isDark ? "dark" : "neutral";
    }

    applyTheme();
    if (theme === "system") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  function updateTheme(nextTheme: Theme) {
    if (nextTheme === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const items: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: "light", label: "ライト", icon: Sun },
    { value: "dark", label: "ダーク", icon: Moon },
    { value: "system", label: "システム", icon: Monitor },
  ];

  return (
    <div className="flex h-9 items-center rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            type="button"
            className={`grid h-7 w-7 place-items-center rounded-md transition ${
              theme === item.value
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            }`}
            onClick={() => updateTheme(item.value)}
            aria-label={item.label}
            title={item.label}
          >
            <Icon aria-hidden size={15} />
          </button>
        );
      })}
    </div>
  );
}

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);

  return isTheme(stored) ? stored : "system";
}

function getServerThemeSnapshot(): Theme {
  return "system";
}

function isTheme(value: string | null): value is Theme {
  return THEMES.some((theme) => theme === value);
}
