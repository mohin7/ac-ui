<script setup lang="ts">
import { Check, ChevronRight, Code, Copy } from "lucide-vue-next";
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
        <ChevronRight class="size-3 text-slate-60" aria-hidden="true" />
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
        <Copy v-if="!copied" class="size-3.5 text-muted" aria-hidden="true" />
        <Check v-else class="size-3.5 text-primary" aria-hidden="true" />
        {{ copied ? "Copied" : "Copy import" }}
      </button>
    </div>
    <p class="mt-3 max-w-170 text-[17px] leading-[28px] text-label">{{ page.description }}</p>
    <div v-if="page.source" class="mt-5 flex flex-wrap items-center gap-2">
      <span class="inline-flex h-6 items-center gap-1.5 rounded-6 border border-border bg-surface-muted px-2 font-mono text-[11.5px] text-label">
        <Code class="size-3" aria-hidden="true" />
        {{ page.source }}
      </span>
      <span class="inline-flex h-6 items-center rounded-6 border border-border bg-surface-muted px-2 font-mono text-[11.5px] text-label">
        import { {{ page.component }} } from "@/lib"
      </span>
    </div>
  </header>
</template>
