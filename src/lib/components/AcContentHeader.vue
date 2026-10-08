<script setup lang="ts">
export interface Props {
  /** Section title. */
  title?: string;
  /** Line under the title. */
  subtitle?: string;
  /** Draws a divider under the header. */
  bordered?: boolean;
}

withDefaults(defineProps<Props>(), { title: "", subtitle: "", bordered: true });

defineSlots<{
  /** Icon before the title. */
  icon?: () => unknown;
  /** Right after the title, e.g. a count badge or info tooltip. */
  "title-actions"?: () => unknown;
  /** Right side: filters, search and actions. */
  default?: () => unknown;
}>();
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3.5"
    :class="bordered && 'border-b border-border-light'"
    data-ac-ds
    data-testid="ac-content-header"
  >
    <div class="flex min-w-0 items-center gap-2.5">
      <span v-if="$slots.icon" class="inline-flex shrink-0 text-muted"><slot name="icon" /></span>
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h5 class="truncate">{{ title }}</h5>
          <slot name="title-actions" />
        </div>
        <p v-if="subtitle" class="mt-0.5 truncate text-xs text-muted">{{ subtitle }}</p>
      </div>
    </div>
    <div v-if="$slots.default" class="flex flex-wrap items-center gap-2"><slot /></div>
  </div>
</template>
