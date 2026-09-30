<script setup lang="ts">
import { useCopy } from "../composables/useCopy";

const props = withDefaults(defineProps<{ text: string; label?: string }>(), { label: "Copy code" });
const { copied, copy } = useCopy();
</script>

<template>
  <button
    type="button"
    class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-muted transition-colors hover:bg-surface-sunken hover:text-heading"
    :aria-label="copied ? 'Copied' : props.label"
    :title="copied ? 'Copied' : props.label"
    @click="copy(text)"
  >
    <svg v-if="!copied" class="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
      <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
      <path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h6.5" />
    </svg>
    <svg v-else class="size-3.5 text-primary" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  </button>
</template>
