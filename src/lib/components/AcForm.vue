<script setup lang="ts">
import { computed, provide } from "vue";

export interface Props {
  /** Maximum width of the fields: `narrow` 640px, `normal` 800px (the old `.form-content`), `wide` 1000px, `full` no limit. Defaults to `wide` for the `aside` layout, `normal` otherwise. */
  width?: "narrow" | "normal" | "wide" | "full";
  /** Default layout of every AcFormSection inside: `stacked` puts the title above the fields, `aside` puts it on the left from 768px up. */
  layout?: "stacked" | "aside";
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  layout: "stacked",
});

const emit = defineEmits<{
  /** The form was submitted (Enter in a field or a `type="submit"` button). The page doesn't reload. */
  submit: [event: SubmitEvent];
}>();

defineSlots<{
  /** AcFormSection groups, or fields directly. */
  default?: () => unknown;
  /** An AcFormFooter. It's placed after the fields and spans the whole form. */
  footer?: () => unknown;
}>();

const widths = {
  narrow: "max-w-160",
  normal: "max-w-200",
  wide: "max-w-250",
  full: "",
} as const;

const widthClass = computed(() => widths[props.width ?? (props.layout === "aside" ? "wide" : "normal")]);

provide("ac-form", {
  layout: computed(() => props.layout),
  widthClass,
});

function onSubmit(e: Event) {
  emit("submit", e as SubmitEvent);
}
</script>

<template>
  <form class="w-full" data-testid="ac-form" @submit.prevent="onSubmit">
    <div class="flex w-full flex-col" :class="widthClass">
      <slot />
    </div>
    <slot name="footer" />
  </form>
</template>
