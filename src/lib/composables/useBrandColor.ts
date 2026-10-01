import { computed, ref } from "vue";

/** A brand colour as numbers: hue 0–360, saturation and lightness 0–100. */
export interface BrandHsl {
  hue: number;
  saturation: number;
  lightness: number;
}

/** The shape the old `@appscode/design-system/plugins/theme` returned: strings, with `%` on saturation and lightness. */
export interface LegacyHsl {
  hue: string;
  saturation: string;
  lightness: string;
}

export interface SetBrandColorOptions {
  /** Darkens the colour, keeping its hue, until white text on it reaches 4.5:1. */
  ensureContrast?: boolean;
}

// The old apps' key, so a saved white-label colour carries over.
const STORAGE_KEY = "themeColor";
const VARS = ["--primary-hue", "--primary-saturation", "--primary-light"] as const;
/** WCAG AA for normal-size text. */
export const MIN_CONTRAST = 4.5;

const current = ref<BrandHsl | null>(null);
let restored = false;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Parses `#rgb` or `#rrggbb` (the `#` is optional). Returns `null` for anything else. */
export function hexToHsl(hex: string): BrandHsl | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const digits = m[1]!.length === 3 ? [...m[1]!].map((c) => c + c).join("") : m[1]!;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16) / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  if (delta) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  return { hue, saturation: +(saturation * 100).toFixed(1), lightness: +(lightness * 100).toFixed(1) };
}

function hslToRgb({ hue, saturation, lightness }: BrandHsl): [number, number, number] {
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;
  const k = (n: number) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}

/** Converts an HSL colour to `#rrggbb`. */
export function hslToHex(color: BrandHsl): string {
  return `#${hslToRgb(color)
    .map((c) => Math.round(c * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

/** WCAG contrast ratio of white text on the colour, from 1 to 21. Solid buttons put white text on `bg-primary`. */
export function contrastOnWhite(color: BrandHsl): number {
  const [r, g, b] = hslToRgb(color).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (luminance + 0.05);
}

/** The highest lightness (in whole percent) at which white text on this hue and saturation still reaches `target`. */
export function readableLightness(hue: number, saturation: number, target = MIN_CONTRAST): number {
  for (let lightness = 100; lightness > 0; lightness--) {
    if (contrastOnWhite({ hue, saturation, lightness }) >= target) return lightness;
  }
  return 0;
}

function readVars(): BrandHsl | null {
  if (typeof document === "undefined") return null;
  const style = getComputedStyle(document.documentElement);
  const [hue, saturation, lightness] = VARS.map((v) => parseFloat(style.getPropertyValue(v)));
  if ([hue, saturation, lightness].some((n) => Number.isNaN(n))) return null;
  return { hue: hue!, saturation: saturation!, lightness: lightness! };
}

function writeVars(color: BrandHsl) {
  const root = document.documentElement.style;
  root.setProperty("--primary-hue", String(color.hue));
  root.setProperty("--primary-saturation", `${color.saturation}%`);
  root.setProperty("--primary-light", `${color.lightness}%`);
  current.value = color;
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // storage blocked (private window, sandboxed iframe)
    return null;
  }
}

/**
 * The runtime brand colour. It writes `--primary-hue`, `--primary-saturation` and `--primary-light`
 * on <html>, which re-hues every `primary-*` step. State is shared by every caller.
 * With `persist`, the colour is saved in localStorage (the old apps' `themeColor` key) and restored on first use.
 */
export function useBrandColor(options: { persist?: boolean } = {}) {
  if (typeof document !== "undefined") {
    if (options.persist && !restored) {
      restored = true;
      const saved = readStored();
      const hsl = saved ? hexToHsl(saved) : null;
      if (hsl) writeVars(hsl);
    }
    // Re-read on every call: something else (an app's CSS, the old plugin) may have changed the variables.
    current.value = readVars();
  }

  const hsl = computed(() => current.value);
  const color = computed(() => (current.value ? hslToHex(current.value) : ""));
  const contrast = computed(() => (current.value ? contrastOnWhite(current.value) : 0));
  const isReadable = computed(() => contrast.value >= MIN_CONTRAST);

  /** Applies a `#rrggbb` colour. Returns `false` and changes nothing if the hex is invalid. */
  function setColor(hex: string, setOptions: SetBrandColorOptions = {}): boolean {
    const parsed = hexToHsl(hex);
    if (!parsed || typeof document === "undefined") return false;
    const next = setOptions.ensureContrast
      ? { ...parsed, lightness: Math.min(parsed.lightness, readableLightness(parsed.hue, parsed.saturation)) }
      : parsed;
    writeVars(next);
    if (options.persist) {
      try {
        localStorage.setItem(STORAGE_KEY, hslToHex(next));
      } catch {
        // still applied for this session
      }
    }
    return true;
  }

  /** Removes the runtime colour so the theme's default (or the app's CSS override) applies again. */
  function reset() {
    if (typeof document === "undefined") return;
    VARS.forEach((v) => document.documentElement.style.removeProperty(v));
    current.value = readVars();
    if (options.persist) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // nothing saved to remove
      }
    }
  }

  return { color, hsl, contrast, isReadable, setColor, reset };
}

// Compatibility with `@appscode/design-system/plugins/theme`, so apps can switch the import path first.

/** @deprecated Use `hexToHsl`. Same output as the old plugin: `{ hue: "208", saturation: "77%", lightness: "40%" }`. */
export function HexToHSL(hex: string): LegacyHsl {
  const hsl = hexToHsl(hex) ?? { hue: 0, saturation: 0, lightness: 0 };
  return { hue: String(hsl.hue), saturation: `${hsl.saturation}%`, lightness: `${hsl.lightness}%` };
}

/** @deprecated Use `hslToHex`. Takes numbers, like the old plugin. */
export function HSLToHex(h: number, s: number, l: number): string {
  return hslToHex({ hue: h, saturation: s, lightness: l });
}

/** @deprecated Use `useBrandColor().hsl`. Reads the three variables from :root as strings. */
export function getThemeHSL(): LegacyHsl {
  if (typeof document === "undefined") return { hue: "", saturation: "", lightness: "" };
  const style = getComputedStyle(document.documentElement);
  const [hue, saturation, lightness] = VARS.map((v) => style.getPropertyValue(v).trim()) as [string, string, string];
  return { hue, saturation, lightness };
}

/** @deprecated Use `useBrandColor().setColor(hex)`. Writes the three variables on :root; pass `%` on saturation and lightness. */
export function setThemeHSL(h: string | number, s: string, l: string): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  root.setProperty("--primary-hue", String(h));
  root.setProperty("--primary-saturation", s);
  root.setProperty("--primary-light", l);
  current.value = readVars();
}
