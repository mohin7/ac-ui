<script setup lang="ts">
export interface Props {
  /** Optional group heading shown under the line, e.g. "Danger zone". The line is hidden when the divider comes first. */
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: "",
});
</script>

<template>
  <div role="separator" :aria-label="label || undefined" class="group" data-testid="ac-dropdown-divider">
    <div class="-mx-1 my-1 h-px bg-border-light group-first:hidden" />
    <div v-if="label" class="px-2.5 pt-1.5 pb-1 text-sm font-medium tracking-wide text-muted uppercase">{{ label }}</div>
  </div>
</template>
