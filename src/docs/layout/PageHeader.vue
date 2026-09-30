<script setup lang="ts">
import type { DocPage } from "../nav";
import { useCopy } from "../composables/useCopy";

const props = defineProps<{ page: DocPage }>();
const { copied, copy } = useCopy();
const copyImport = () => copy(`import { ${props.page.component} } from "@/lib";`);
</script>

<template>
  <header class="mb-10">
    <nav class="mb-3 flex items-center gap-1.5 text-xs font-medium" aria-label="Breadcrumb">
      <span class="text-primary-20">{{ page.section }}</span>
      <template v-if="page.group">
        <svg class="size-3 text-slate-60" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m4.5 2.5 3.5 3.5-3.5 3.5" /></svg>
        <span class="text-muted">{{ page.group }}</span>
      </template>
    </nav>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <h1 class="text-[34px] leading-[42px] font-semibold tracking-[-0.035em]">{{ page.title }}</h1>
      <button
        v-if="page.component"
        type="button"
        class="mt-1.5 inline-flex h-8 cursor-pointer items-center gap-2 rounded-6 border border-border bg-surface px-3 text-base font-medium text-heading shadow-xs transition hover:border-border-dark hover:bg-surface-muted"
        @click="copyImport"
      >
        <svg v-if="!copied" class="size-3.5 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" /><path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h6.5" />
        </svg>
        <svg v-else class="size-3.5 text-primary" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
        {{ copied ? "Copied" : "Copy import" }}
      </button>
    </div>
    <p class="mt-3 max-w-170 text-[17px] leading-[28px] text-label">{{ page.description }}</p>
    <div v-if="page.source" class="mt-5 flex flex-wrap items-center gap-2">
      <span class="inline-flex h-6 items-center gap-1.5 rounded-6 border border-border bg-surface-muted px-2 font-mono text-[11.5px] text-label">
        <svg class="size-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4" /></svg>
        {{ page.source }}
      </span>
      <span class="inline-flex h-6 items-center rounded-6 border border-border bg-surface-muted px-2 font-mono text-[11.5px] text-label">
        import { {{ page.component }} } from "@/lib"
      </span>
    </div>
  </header>
</template>
