<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { highlight } from "../composables/useHighlighter";
import CopyButton from "./CopyButton.vue";

const props = withDefaults(defineProps<{ code: string; lang?: string; filename?: string; flush?: boolean }>(), {
  lang: "vue",
  filename: "",
  flush: false,
});

const html = ref("");
watchEffect(async () => {
  const code = props.code.trim();
  html.value = await highlight(code, props.lang);
});
</script>

<template>
  <div class="group relative bg-surface-muted" :class="!flush && 'overflow-hidden rounded-10 border border-border shadow-xs'">
    <div v-if="filename" class="flex h-9.5 items-center justify-between border-b border-border-light bg-surface pr-2 pl-4">
      <span class="flex items-center gap-2 font-mono text-[11.5px] text-label">
        <span class="size-1.5 rounded-full bg-slate-70" aria-hidden="true" />{{ filename }}
      </span>
      <CopyButton :text="code.trim()" />
    </div>
    <CopyButton
      v-else
      :text="code.trim()"
      class="absolute top-2 right-2 z-10 border border-border bg-surface opacity-0 shadow-xs transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    />
    <!-- eslint-disable-next-line vue/no-v-html -- Shiki output from our own example sources -->
    <div v-if="html" class="ac-scrollbar px-4.5 py-3.5 [&_pre]:outline-none" v-html="html" />
    <pre v-else class="ac-scrollbar px-4.5 py-3.5 font-mono text-[12.5px] leading-[1.7] text-heading">{{ code.trim() }}</pre>
  </div>
</template>
