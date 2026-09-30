<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Search } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { pages } from "../nav";

const open = defineModel<boolean>({ default: false });
const router = useRouter();
const query = ref("");
const index = ref(0);
const input = ref<HTMLInputElement | null>(null);

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return pages;
  return pages
    .map((p) => {
      const t = p.title.toLowerCase();
      const score = t.startsWith(q) ? 3 : t.includes(q) ? 2 : (p.description + p.section + (p.group ?? "")).toLowerCase().includes(q) ? 1 : 0;
      return { p, score };
    })
    .filter((r) => r.score)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
});

watch(open, async (v) => {
  if (!v) return;
  query.value = "";
  index.value = 0;
  await nextTick();
  input.value?.focus();
});
watch(query, () => (index.value = 0));

const go = (path?: string) => {
  if (!path) return;
  open.value = false;
  router.push(path);
};

const onKey = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    index.value = Math.min(index.value + 1, results.value.length - 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    index.value = Math.max(index.value - 1, 0);
  } else if (e.key === "Enter") {
    go(results.value[index.value]?.path);
  } else if (e.key === "Escape") {
    open.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60] flex animate-fade-in items-start justify-center bg-overlay p-4 pt-[12vh] backdrop-blur-[2px]" @click.self="open = false">
      <div class="w-full max-w-150 animate-pop-in overflow-hidden rounded-12 border border-border bg-surface shadow-xl" role="dialog" aria-label="Search docs">
        <div class="flex items-center gap-2 border-b border-border px-4">
          <Search class="size-4 text-label" aria-hidden="true" />
          <input
            ref="input"
            v-model="query"
            type="text"
            placeholder="Search components and guides…"
            class="h-13 flex-1 bg-transparent text-[15px] text-heading outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            @keydown="onKey"
          />
          <kbd class="inline-flex h-5 items-center rounded-4 border border-border bg-surface-muted px-1.5 font-sans text-[11px] font-medium text-label">Esc</kbd>
        </div>
        <ul id="search-results" role="listbox" class="ac-scrollbar max-h-96 p-2">
          <li v-for="(p, i) in results" :key="p.path" role="option" :aria-selected="i === index">
            <button
              type="button"
              class="flex w-full cursor-pointer flex-col rounded-8 px-3 py-2 text-left transition-colors duration-75"
              :class="i === index ? 'bg-surface-muted ring-1 ring-border ring-inset' : ''"
              @mouseenter="index = i"
              @click="go(p.path)"
            >
              <span class="flex items-center gap-2">
                <span class="font-medium text-heading">{{ p.title }}</span>
                <span class="rounded-4 bg-surface-sunken px-1.5 text-[11px] leading-4 text-label">{{ p.group ? `${p.section} · ${p.group}` : p.section }}</span>
              </span>
              <span class="mt-0.5 truncate text-xs text-muted">{{ p.description }}</span>
            </button>
          </li>
          <li v-if="!results.length" class="px-3 py-6 text-center text-label">No results for “{{ query }}”.</li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
