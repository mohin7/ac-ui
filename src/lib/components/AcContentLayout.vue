<script setup lang="ts">
export interface Props {
  /** Draws the white bordered surface. Turn off to place the layout inside another card. */
  surface?: boolean;
}

withDefaults(defineProps<Props>(), { surface: true });

defineSlots<{
  /** Usually an `AcContentHeader`. */
  header?: () => unknown;
  /** The content under the header. */
  default?: () => unknown;
}>();
</script>

<template>
  <section
    :class="surface && 'rounded-10 border border-border bg-surface shadow-xs'"
    data-testid="ac-content-layout"
  >
    <slot name="header" />
    <div><slot /></div>
  </section>
</template>
