<script setup lang="ts">
import AcSpinner from "./AcSpinner.vue";

export interface Props {
  /** Text under the spinner, e.g. "Fetching resource layout". Also announced to screen readers. */
  message?: string;
  /** Shows the spinner. Turn off to show the message alone. */
  showSpinner?: boolean;
  /** Covers the whole viewport on a plain surface, for app start-up and sign-in checks. */
  fullPage?: boolean;
  /** CSS minimum height when not `fullPage`. The preloader also grows to fill its container. */
  minHeight?: string;
}

withDefaults(defineProps<Props>(), {
  message: "Loading…",
  showSpinner: true,
  fullPage: false,
  minHeight: "240px",
});

defineSlots<{
  /** Replaces the message, e.g. with a message and a Cancel button. */
  default?: () => unknown;
}>();

// The root is a Teleport, so class and style are forwarded to the box by hand.
defineOptions({ inheritAttrs: false });
</script>

<template>
  <Teleport to="body" :disabled="!fullPage">
    <div
      v-bind="$attrs"
      role="status"
      aria-live="polite"
      class="flex flex-col items-center justify-center gap-3 px-4 text-center"
      :class="fullPage ? 'fixed inset-0 z-[80] bg-surface' : 'size-full'"
      :style="fullPage ? undefined : { minHeight }"
      data-testid="ac-preloader"
    >
      <AcSpinner v-if="showSpinner" size="normal" class="text-primary" label="" />
      <div class="max-w-80 text-base text-muted">
        <slot>{{ message }}</slot>
      </div>
    </div>
  </Teleport>
</template>
