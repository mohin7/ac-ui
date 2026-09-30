<script setup lang="ts">
import { computed } from "vue";
import { pages, type DocPage } from "../nav";

const props = defineProps<{ page: DocPage }>();
const i = computed(() => pages.findIndex((p) => p.path === props.page.path));
const prev = computed(() => pages[i.value - 1]);
const next = computed(() => pages[i.value + 1]);
</script>

<template>
  <nav class="mt-20 grid gap-4 border-t border-border-light pt-10 sm:grid-cols-2" aria-label="Pagination">
    <RouterLink
      v-if="prev"
      :to="prev.path"
      class="group rounded-10 border border-border bg-surface px-5 py-4 shadow-xs transition hover:border-border-dark hover:shadow-sm"
    >
      <span class="flex items-center gap-1 text-xs text-muted">
        <svg class="size-3 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M7.5 2.5 4 6l3.5 3.5" /></svg>
        Previous
      </span>
      <span class="mt-1 block text-lg font-medium text-heading">{{ prev.title }}</span>
    </RouterLink>
    <span v-else />
    <RouterLink
      v-if="next"
      :to="next.path"
      class="group rounded-10 border border-border bg-surface px-5 py-4 text-right shadow-xs transition hover:border-border-dark hover:shadow-sm"
    >
      <span class="flex items-center justify-end gap-1 text-xs text-muted">
        Next
        <svg class="size-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m4.5 2.5 3.5 3.5-3.5 3.5" /></svg>
      </span>
      <span class="mt-1 block text-lg font-medium text-heading">{{ next.title }}</span>
    </RouterLink>
  </nav>
</template>
