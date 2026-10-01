import { ref, watch } from "vue";

export interface BrandPreset {
  name: string;
  hue: number;
  saturation: number;
  light: number;
}

// AppsCode green is the default; the blue is the commented-out preset in the old _root-variables.scss.
export const presets: BrandPreset[] = [
  { name: "AppsCode green", hue: 149, saturation: 100, light: 30 },
  { name: "Legacy blue", hue: 208, saturation: 77, light: 40 },
];

const hue = ref(presets[0]!.hue);
const saturation = ref(presets[0]!.saturation);
const light = ref(presets[0]!.light);

watch(
  [hue, saturation, light],
  ([h, s, l]) => {
    const root = document.documentElement.style;
    root.setProperty("--primary-hue", String(h));
    root.setProperty("--primary-saturation", `${s}%`);
    root.setProperty("--primary-light", `${l}%`);
  },
  { immediate: true },
);

export function useBrandHue() {
  const apply = (p: BrandPreset) => {
    hue.value = p.hue;
    saturation.value = p.saturation;
    light.value = p.light;
  };
  // Other code (useBrandColor on the Theming page) can change the variables, so re-read them before showing the sliders.
  const sync = () => {
    const style = getComputedStyle(document.documentElement);
    const read = (name: string) => parseFloat(style.getPropertyValue(name));
    const [h, s, l] = [read("--primary-hue"), read("--primary-saturation"), read("--primary-light")];
    if ([h, s, l].every(Number.isFinite)) apply({ name: "", hue: h, saturation: s, light: l });
  };
  return { hue, saturation, light, apply, sync };
}
