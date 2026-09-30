<script setup lang="ts">
import { useCopy } from "../composables/useCopy";

defineProps<{ text: string }>();
const { copied, copy } = useCopy(1200);
</script>

<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center gap-1 rounded-2 font-mono text-[12px] text-heading hover:text-primary"
    :title="`Copy ${text}`"
    @click="copy(text)"
  >
    {{ copied ? "Copied!" : text }}
  </button>
</template>
