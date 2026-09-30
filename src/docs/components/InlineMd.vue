<script setup lang="ts">
import { computed } from "vue";

// Renders `code` spans in short doc strings without an HTML parser.
const props = defineProps<{ text: string }>();
const parts = computed(() => props.text.split(/(`[^`]+`)/g).filter(Boolean));
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <code v-if="part.startsWith('`')" class="prose-code">{{ part.slice(1, -1) }}</code>
    <template v-else>{{ part }}</template>
  </template>
</template>
