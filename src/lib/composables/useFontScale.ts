import { computed, ref } from "vue";

/** `small` 0.92, `default` 1, `large` 1.1, `larger` 1.2 — or any number between 0.8 and 1.5. */
export type FontScale = "small" | "default" | "large" | "larger";

export const FONT_SCALES: Record<FontScale, number> = { small: 0.92, default: 1, large: 1.1, larger: 1.2 };

const STORAGE_KEY = "uiScale";
const MIN = 0.8;
const MAX = 1.5;

const scale = ref(1);
let started = false;

function clamp(value: number) {
  return Math.min(MAX, Math.max(MIN, Math.round(value * 100) / 100));
}

function readStored(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value = raw === null ? NaN : Number(raw);
    return Number.isFinite(value) ? clamp(value) : null;
  } catch {
    // storage blocked (private window, sandboxed iframe)
    return null;
  }
}

function apply(value: number) {
  document.documentElement.style.setProperty("--ac-scale", String(value));
}

function start(defaultScale: number) {
  if (started || typeof window === "undefined") return;
  started = true;
  scale.value = readStored() ?? clamp(defaultScale);
  apply(scale.value);
}

/**
 * The app-wide interface scale. It writes `--ac-scale` on <html>; text, line heights, spacing and radii are all
 * multiples of it, so the whole interface grows or shrinks in proportion. State is shared by every caller and
 * remembered in localStorage.
 */
export function useFontScale(options: { defaultScale?: number } = {}) {
  start(options.defaultScale ?? 1);

  function setScale(next: FontScale | number) {
    scale.value = clamp(typeof next === "number" ? next : FONT_SCALES[next]);
    apply(scale.value);
    try {
      localStorage.setItem(STORAGE_KEY, String(scale.value));
    } catch {
      // still applied for this session
    }
  }

  /** The preset the current value matches, or `null` for a custom number. */
  const preset = computed<FontScale | null>(
    () => (Object.keys(FONT_SCALES) as FontScale[]).find((k) => FONT_SCALES[k] === scale.value) ?? null,
  );

  return { scale: computed(() => scale.value), preset, setScale, presets: FONT_SCALES };
}
