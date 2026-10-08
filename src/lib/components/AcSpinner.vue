<script setup lang="ts">
export interface Props {
  /** Diameter: `xs` 12px, `small` 16px, `normal` 20px, `large` 32px. */
  size?: "xs" | "small" | "normal" | "large";
  /** Read by screen readers. Pass an empty string when a visible label sits next to it. */
  label?: string;
}

withDefaults(defineProps<Props>(), {
  size: "small",
  label: "Loading",
});

const sizes = { xs: "size-3", small: "size-4", normal: "size-5", large: "size-8" } as const;
</script>

<template>
  <svg
    class="inline-block shrink-0 animate-spin"
    :class="sizes[size]"
    viewBox="0 0 16 16"
    fill="none"
    :role="label ? 'status' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="!label || undefined"
    data-ac-ds
    data-testid="ac-spinner"
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity="0.2" stroke-width="2" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>
