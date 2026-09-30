<script setup lang="ts">
defineProps<{ dos: string[]; donts: string[] }>();
</script>

<template>
  <div class="my-5 grid gap-4 md:grid-cols-2">
    <div class="overflow-hidden rounded-10 border border-border bg-surface shadow-xs">
      <p class="flex items-center gap-2 border-b border-border-light bg-green-97 px-4 py-2.5 text-base font-semibold text-green-10">
        <span class="inline-flex size-4.5 items-center justify-center rounded-full bg-success text-white" aria-hidden="true">
          <svg class="size-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.5 5 9l4.5-6" /></svg>
        </span>
        Do
      </p>
      <ul class="space-y-2.5 px-4 py-4">
        <li v-for="d in dos" :key="d" class="flex gap-2.5 text-lg leading-6 text-body">
          <span class="mt-2.5 size-1 shrink-0 rounded-full bg-success" aria-hidden="true" />{{ d }}
        </li>
      </ul>
    </div>
    <div class="overflow-hidden rounded-10 border border-border bg-surface shadow-xs">
      <p class="flex items-center gap-2 border-b border-border-light bg-red-97 px-4 py-2.5 text-base font-semibold text-red-10">
        <span class="inline-flex size-4.5 items-center justify-center rounded-full bg-danger text-white" aria-hidden="true">
          <svg class="size-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 3l6 6M9 3 3 9" /></svg>
        </span>
        Don't
      </p>
      <ul class="space-y-2.5 px-4 py-4">
        <li v-for="d in donts" :key="d" class="flex gap-2.5 text-lg leading-6 text-body">
          <span class="mt-2.5 size-1 shrink-0 rounded-full bg-danger" aria-hidden="true" />{{ d }}
        </li>
      </ul>
    </div>
  </div>
</template>
