<script setup lang="ts">
import { FONT_SCALES, useFontScale } from "../composables/useFontScale";
import type { FontScale } from "../composables/useFontScale";

export interface Props {
  /** Used until the viewer picks a size: a preset name or a number (0.8–1.5). */
  defaultScale?: FontScale | number;
  /** `icons` is a compact switch of four "A"s; `labels` adds the words, for menus and settings pages. */
  display?: "icons" | "labels";
}

const props = withDefaults(defineProps<Props>(), {
  defaultScale: "default",
  display: "icons",
});

const emit = defineEmits<{
  /** The scale now applied, e.g. `1.1`. */
  "set:scale": [scale: number];
}>();

const sizes = [
  { value: "small", label: "Small", glyph: "text-xs" },
  { value: "default", label: "Default", glyph: "text-base" },
  { value: "large", label: "Large", glyph: "text-xl" },
  { value: "larger", label: "Larger", glyph: "text-2xl" },
] as const;

const { scale, preset, setScale } = useFontScale({
  defaultScale: typeof props.defaultScale === "number" ? props.defaultScale : FONT_SCALES[props.defaultScale],
});

function choose(next: FontScale) {
  setScale(next);
  emit("set:scale", scale.value);
}
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Text size"
    class="inline-flex items-center gap-0.5 rounded-8 border border-border bg-surface-muted p-0.5"
    data-ac-ds
    data-testid="ac-font-scale"
  >
    <button
      v-for="s in sizes"
      :key="s.value"
      type="button"
      role="radio"
      :aria-checked="preset === s.value"
      :aria-label="display === 'icons' ? `${s.label} text` : undefined"
      :title="display === 'icons' ? `${s.label} text` : undefined"
      class="inline-flex h-6.5 cursor-pointer items-center justify-center gap-1.5 rounded-6 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      :class="[
        display === 'icons' ? 'w-7' : 'px-2.5',
        preset === s.value ? 'bg-surface text-heading shadow-sm ring-1 ring-border' : 'text-muted hover:text-heading',
      ]"
      @click="choose(s.value)"
    >
      <span v-if="display === 'icons'" class="leading-none font-semibold" :class="s.glyph" aria-hidden="true">A</span>
      <span v-else>{{ s.label }}</span>
    </button>
  </div>
</template>
