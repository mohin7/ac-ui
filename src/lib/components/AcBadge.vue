<script setup lang="ts">
import { computed } from "vue";
import type { Tone, Variant } from "./types";

export interface Props {
  /** Text of the badge. The default slot overrides it. */
  label?: string;
  /** Status or brand colour. Always pair a status colour with a word. */
  color?: Tone | "default" | "secondary" | "dark";
  /** `solid` fill, `light` tint (-95 fill, -10 text, best contrast) or `outlined`. */
  variant?: Variant;
  /** Pill shape (`rounded-50`) instead of the 6px control radius. */
  rounded?: boolean;
  /** Shows an 8px status dot before the label. */
  dot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Default",
  color: "default",
  variant: "solid",
  rounded: false,
  dot: false,
});

// The source's badge() mixin (solid / light -95 fill + -10 text / outlined), refined with an inset hairline
// on light badges so they hold their shape on white and tinted surfaces.
const recipes = {
  primary: ["bg-primary text-white", "bg-primary-95 text-primary-10 ring-primary-40/20", "ring-primary-70 text-primary-20", "bg-primary-40"],
  secondary: ["bg-secondary text-white", "bg-secondary-95 text-secondary-10 ring-secondary-40/20", "ring-secondary-70 text-secondary", "bg-secondary-40"],
  info: ["bg-info text-white", "bg-blue-95 text-blue-10 ring-blue-50/20", "ring-blue-80 text-blue-30", "bg-blue-50"],
  success: ["bg-success text-white", "bg-green-95 text-green-10 ring-green-40/25", "ring-green-70 text-green-20", "bg-green-40"],
  warning: ["bg-warning text-on-warning", "bg-yellow-95 text-yellow-10 ring-yellow-50/30", "ring-yellow-70 text-yellow-20", "bg-yellow-50"],
  danger: ["bg-danger text-white", "bg-red-95 text-red-10 ring-red-40/20", "ring-red-80 text-red-30", "bg-red-40"],
  dark: ["bg-gray-20 text-surface", "bg-gray-95 text-gray-10 ring-gray-40/20", "ring-gray-70 text-gray-20", "bg-gray-50"],
  default: ["bg-surface-sunken text-heading", "bg-surface-muted text-heading ring-slate-50/20", "ring-border-dark text-heading", "bg-slate-50"],
} as const;

defineSlots<{
  /** Badge content. Replaces `label`. */
  default?: () => unknown;
}>();

const classes = computed(() => {
  const [solid, light, outlined] = recipes[props.color];
  return { solid, light: `ring-1 ring-inset ${light}`, outlined: `bg-surface ring-1 ring-inset ${outlined}` }[props.variant];
});

const dotClass = computed(() => {
  if (props.variant === "solid" && props.color !== "default") return "bg-surface";
  return recipes[props.color][3];
});
</script>

<template>
  <span
    class="inline-flex h-5.5 items-center gap-1.5 px-2 text-xs leading-none font-medium whitespace-nowrap tabular-nums"
    :class="[classes, rounded ? 'rounded-50' : 'rounded-6']"
    data-testid="ac-badge"
  >
    <span v-if="dot" class="size-1.5 shrink-0 rounded-full" :class="dotClass" aria-hidden="true" />
    <slot>{{ label }}</slot>
  </span>
</template>
