<script setup lang="ts">
import { computed } from "vue";
import AcSpinner from "./AcSpinner.vue";
import type { Tone, Variant } from "./types";

export interface Props {
  /** Text label. You can also pass content through the default slot. */
  title?: string;
  /** Colour of the button. `white` and `ghost` are neutral styles for secondary actions. */
  color?: Tone | "white" | "ghost";
  /** `solid` fill, `light` tinted fill (-95 background, -30 text) or `outlined` border. */
  variant?: Variant;
  /** Height and padding: `small` 28px, `normal` 32px, `medium` 40px. */
  size?: "small" | "normal" | "medium";
  /** Shows a spinner, hides the label and blocks clicks. */
  loading?: boolean;
  /** Disables the button (50% opacity, no click events). */
  disabled?: boolean;
  /** Native button type. Use `submit` inside forms. */
  type?: "button" | "submit" | "reset";
  /** Renders an <a> styled as the button instead of a <button>. */
  href?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  color: "primary",
  variant: "solid",
  size: "normal",
  loading: false,
  disabled: false,
  type: "button",
  href: undefined,
});

const emit = defineEmits<{ click: [e: MouseEvent] }>();

defineSlots<{
  /** Button content, after the icon and `title`. */
  default?: () => unknown;
  /** A 16px icon before the label (an inline SVG or icon component). */
  icon?: () => unknown;
}>();

// Colour recipes follow styles/components/_button.scss (solid, light -95/-30, outlined),
// refined with a top highlight on solid fills and hairline borders on the rest.
const tones: Record<Tone, Record<Variant, string>> = {
  primary: {
    solid: "bg-primary text-white border-black/15 shadow-button hover:bg-primary-hover",
    light: "bg-primary-95 text-primary-20 border-transparent hover:bg-primary-93",
    outlined: "bg-surface text-primary-20 border-primary-70 shadow-xs hover:bg-primary-97 hover:border-primary-60",
  },
  info: {
    solid: "bg-info text-white border-black/15 shadow-button hover:bg-info-hover",
    light: "bg-blue-95 text-blue-30 border-transparent hover:bg-blue-93",
    outlined: "bg-surface text-blue-30 border-blue-80 shadow-xs hover:bg-blue-97",
  },
  success: {
    solid: "bg-success text-white border-black/15 shadow-button hover:bg-success-hover",
    light: "bg-green-95 text-green-20 border-transparent hover:bg-green-93",
    outlined: "bg-surface text-green-20 border-green-70 shadow-xs hover:bg-green-97",
  },
  warning: {
    solid: "bg-warning text-on-warning border-black/10 shadow-button hover:bg-warning-hover",
    light: "bg-yellow-95 text-yellow-20 border-transparent hover:bg-yellow-93",
    outlined: "bg-surface text-yellow-20 border-yellow-70 shadow-xs hover:bg-yellow-97",
  },
  danger: {
    solid: "bg-danger text-white border-black/15 shadow-button hover:bg-danger-hover",
    light: "bg-red-95 text-red-30 border-transparent hover:bg-red-93",
    outlined: "bg-surface text-red-30 border-red-80 shadow-xs hover:bg-red-97",
  },
};

const colorClass = computed(() => {
  if (props.color === "white")
    return "bg-surface text-heading border-border shadow-xs hover:bg-surface-muted hover:border-border-dark";
  if (props.color === "ghost") return "bg-transparent text-body border-transparent hover:bg-surface-sunken hover:text-heading";
  return tones[props.color][props.variant];
});

const sizeClass = computed(
  () =>
    ({
      small: "h-7 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5",
      normal: "h-8 gap-2 px-3.5 text-base [&_svg]:size-4",
      medium: "h-10 gap-2 px-5 text-lg [&_svg]:size-4",
    })[props.size],
);

const handleClick = (e: MouseEvent) => {
  if (!props.disabled && !props.loading) emit("click", e);
};
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href && !disabled ? href : undefined"
    :type="href ? undefined : type"
    :disabled="(!href && disabled) || undefined"
    :aria-disabled="(href && disabled) || undefined"
    :aria-busy="loading || undefined"
    class="relative inline-flex cursor-pointer items-center justify-center rounded-6 border font-medium tracking-[-0.005em] whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out select-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0 aria-disabled:pointer-events-none aria-disabled:opacity-50"
    :class="[colorClass, sizeClass, loading && 'text-transparent! pointer-events-none']"
    data-testid="ac-button"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="-ml-0.5 inline-flex shrink-0 items-center justify-center" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span v-if="title">{{ title }}</span>
    <slot />
    <AcSpinner
      v-if="loading"
      class="absolute inset-0 m-auto"
      :class="variant === 'solid' && color !== 'white' && color !== 'ghost' ? 'text-white' : 'text-primary'"
      label=""
    />
  </component>
</template>
