<script setup lang="ts">
export interface Props {
  /** Pads the page on all sides (20px). Turn off when a parent already pads it. */
  padded?: boolean;
  /** Space between the page's direct children: `small` 12px, `normal` 20px, `large` 32px. */
  gap?: "small" | "normal" | "large";
  /** Caps the content width and centres it: `narrow` 768px, `normal` 1024px, `wide` 1280px, `full` fills the area. */
  width?: "full" | "wide" | "normal" | "narrow";
}

withDefaults(defineProps<Props>(), { padded: true, gap: "normal", width: "full" });

defineSlots<{
  /** The page's sections: `AcCard`, `AcSectionContent`, `AcTable`, a form. Each direct child is spaced by `gap`. */
  default?: () => unknown;
}>();

const GAPS = { small: "gap-3", normal: "gap-5", large: "gap-8" } as const;
const WIDTHS = { full: "", wide: "mx-auto max-w-7xl", normal: "mx-auto max-w-5xl", narrow: "mx-auto max-w-3xl" } as const;
</script>

<template>
  <div class="flex w-full min-w-0 flex-col" :class="[GAPS[gap], WIDTHS[width], padded && 'p-5']" data-ac-ds data-testid="ac-page">
    <slot />
  </div>
</template>
