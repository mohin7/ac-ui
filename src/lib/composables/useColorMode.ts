import { computed, ref } from "vue";

export type ColorMode = "light" | "dark" | "system";

// The old library's key, so a user's saved choice carries over.
const STORAGE_KEY = "themeMode";

const mode = ref<ColorMode>("light");
const systemDark = ref(false);
let started = false;

function readStoredMode(): ColorMode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" || value === "system" ? value : null;
  } catch {
    // storage blocked (private window, sandboxed iframe)
    return null;
  }
}

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  // The old library's class, so its remaining styles follow along during migration.
  root.classList.toggle("is-dark-theme", dark);
}

function start(defaultMode: ColorMode) {
  if (started || typeof window === "undefined") return;
  started = true;
  mode.value = readStoredMode() ?? defaultMode;
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.value = query.matches;
  query.addEventListener("change", (e) => {
    systemDark.value = e.matches;
    applyTheme(isDark.value);
  });
  applyTheme(isDark.value);
}

const isDark = computed(() => (mode.value === "system" ? systemDark.value : mode.value === "dark"));

/**
 * The app-wide light/dark/system choice. State is shared by every caller;
 * it toggles `.dark` and `.is-dark-theme` on <html> and remembers the choice in localStorage.
 */
export function useColorMode(options: { defaultMode?: ColorMode } = {}) {
  start(options.defaultMode ?? "light");

  function setMode(next: ColorMode) {
    mode.value = next;
    applyTheme(isDark.value);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // still applied for this session
    }
  }

  return { mode: computed(() => mode.value), isDark, setMode };
}
