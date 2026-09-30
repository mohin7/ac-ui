<script setup lang="ts">
import { Info, Lightbulb, TriangleAlert } from "lucide-vue-next";
withDefaults(defineProps<{ type?: "tip" | "note" | "warning" }>(), { type: "note" });
</script>

<template>
  <div
    class="my-5 flex gap-3 rounded-10 border px-4 py-3.5 text-lg leading-6 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2"
    :class="{
      'border-primary-90 bg-primary-97 text-primary-10': type === 'tip',
      'border-blue-90 bg-blue-97 text-blue-10': type === 'note',
      'border-yellow-80 bg-yellow-97 text-yellow-10': type === 'warning',
    }"
  >
    <component
      :is="type === 'warning' ? TriangleAlert : type === 'tip' ? Lightbulb : Info"
      class="mt-1 size-4 shrink-0"
      :class="{ 'text-primary': type === 'tip', 'text-blue-50': type === 'note', 'text-yellow-50': type === 'warning' }"
      aria-hidden="true"
    />
    <div class="min-w-0 flex-1"><slot /></div>
  </div>
</template>
