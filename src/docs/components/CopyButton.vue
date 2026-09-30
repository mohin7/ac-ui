<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
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
    <Copy v-if="!copied" class="size-3.5" aria-hidden="true" />
    <Check v-else class="size-3.5 text-primary" aria-hidden="true" />
  </button>
</template>
