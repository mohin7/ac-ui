<script setup lang="ts">
import { Search } from "@lucide/vue";
import { AcKbd } from "@/lib";
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <p>Press <AcKbd :keys="['mod', 'k']" /> to search clusters, or <AcKbd>/</AcKbd> to filter this table.</p>
    <button
      type="button"
      class="flex h-8 w-64 cursor-pointer items-center gap-2 rounded-6 border border-border bg-surface px-2.5 text-muted shadow-xs transition hover:border-border-dark"
    >
      <Search class="size-4" aria-hidden="true" />
      <span class="flex-1 text-left">Search resources…</span>
      <AcKbd :keys="['mod', 'k']" size="small" />
    </button>
  </div>
</template>
