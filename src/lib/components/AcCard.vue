<script setup lang="ts">
export interface Props {
  /** Header title. The header only renders with a title or `actions` slot. */
  title?: string;
  /** Small line under the title. */
  subtitle?: string;
  /** Adds 20px padding to the body. Turn off for flush tables. */
  padded?: boolean;
}

withDefaults(defineProps<Props>(), { title: "", subtitle: "", padded: true });
defineSlots<{
  /** Card body. */
  default?: () => unknown;
  /** Buttons on the right of the header. */
  actions?: () => unknown;
}>();
</script>

<template>
  <section class="rounded-10 border border-border bg-surface shadow-xs" data-testid="ac-card">
    <header
      v-if="title || $slots.actions"
      class="flex items-center justify-between gap-4 border-b border-border-light px-5 py-3.5"
    >
      <div class="min-w-0">
        <h5 class="truncate">{{ title }}</h5>
        <p v-if="subtitle" class="mt-0.5 truncate text-xs text-muted">{{ subtitle }}</p>
      </div>
      <div class="flex shrink-0 items-center gap-2"><slot name="actions" /></div>
    </header>
    <div :class="padded && 'p-5'"><slot /></div>
  </section>
</template>
