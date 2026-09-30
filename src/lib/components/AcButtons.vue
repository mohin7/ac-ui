<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  /** Joins the buttons into one control with shared borders, like a toolbar. Old `class="has-addons"`. */
  attached?: boolean;
  /** Horizontal alignment of the row. `between` pushes the first and last button to the edges. */
  align?: "start" | "center" | "end" | "between";
  /** Space between buttons: `small` 4px, `normal` 8px, `large` 12px. Ignored when `attached`. */
  gap?: "small" | "normal" | "large";
  /** Shrinks the group to its content instead of filling the row. Old `is-max-width`. */
  inline?: boolean;
  /** Accessible name for the group, e.g. "Editor view". Recommended for `attached` groups. */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  attached: false,
  align: "start",
  gap: "normal",
  inline: false,
  label: "",
});

defineSlots<{
  /** The buttons, usually `AcButton`s. */
  default?: () => unknown;
}>();

const ALIGN = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" } as const;
const GAP = { small: "gap-1", normal: "gap-2", large: "gap-3" } as const;
// Children overlap by 1px so borders don't double; hovered and focused ones rise above their neighbours.
const ATTACHED =
  "[&>*]:rounded-none [&>*:first-child]:rounded-l-6 [&>*:last-child]:rounded-r-6 [&>*:not(:first-child)]:-ml-px [&>*:hover]:z-[1] [&>*:focus-visible]:z-[2]";

const classes = computed(() => [
  props.inline ? "inline-flex" : "flex",
  props.attached ? "isolate flex-nowrap" : ["flex-wrap", GAP[props.gap]],
  ALIGN[props.align],
  props.attached && ATTACHED,
]);
</script>

<template>
  <div role="group" :aria-label="label || undefined" class="items-center" :class="classes" data-testid="ac-buttons">
    <slot />
  </div>
</template>
