<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { pages, sections } from "../nav";

defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
const route = useRoute();
const filter = ref("");

const tree = computed(() => {
  const q = filter.value.trim().toLowerCase();
  return sections
    .map((section) => {
      const items = pages.filter((p) => p.section === section && (!q || p.title.toLowerCase().includes(q)));
      const groups = [...new Set(items.map((p) => p.group ?? ""))].map((g) => ({
        name: g,
        items: items.filter((p) => (p.group ?? "") === g),
      }));
      return { section, groups, count: items.length };
    })
    .filter((s) => s.count);
});
</script>

<template>
  <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition-opacity" leave-active-class="transition-opacity">
    <div v-if="open" class="fixed inset-0 z-40 bg-slate-10/30 backdrop-blur-[2px] lg:hidden" aria-hidden="true" @click="emit('close')" />
  </Transition>
  <aside
    class="fixed top-0 bottom-0 left-0 z-50 w-68 overflow-y-auto border-r border-border-light bg-white px-4 pt-5 pb-12 transition-transform duration-300 ease-out-soft [scrollbar-width:none] hover:[scrollbar-width:thin] lg:sticky lg:top-15 lg:z-0 lg:h-[calc(100dvh-60px)] lg:w-60 lg:translate-x-0 lg:border-0 lg:bg-transparent lg:px-0 lg:pt-8"
    :class="open ? 'translate-x-0 shadow-xl lg:shadow-none' : '-translate-x-full'"
    aria-label="Documentation"
  >
    <div class="relative mb-6">
      <svg class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <path d="M2.5 4h11M4.5 8h7M6.5 12h3" />
      </svg>
      <input
        v-model="filter"
        type="search"
        placeholder="Filter"
        aria-label="Filter pages"
        class="h-8 w-full rounded-6 border border-border bg-white pr-3 pl-8 text-base text-heading shadow-xs transition placeholder:text-muted hover:border-border-dark focus:focus-ring"
      />
    </div>
    <nav>
      <div v-for="s in tree" :key="s.section" class="mb-7">
        <p class="mb-2 px-2.5 text-xs font-semibold text-heading">{{ s.section }}</p>
        <div v-for="g in s.groups" :key="g.name" :class="g.name && 'mb-3'">
          <p v-if="g.name" class="mt-3 mb-1 px-2.5 text-[11px] font-medium tracking-wide text-muted uppercase">{{ g.name }}</p>
          <ul class="space-y-px">
            <li v-for="p in g.items" :key="p.path">
              <RouterLink
                :to="p.path"
                class="flex h-7.5 items-center gap-2 rounded-6 px-2.5 text-base transition-colors duration-100"
                :class="
                  route.path === p.path
                    ? 'bg-primary-95 font-medium text-primary-10'
                    : 'text-label hover:bg-surface-muted hover:text-heading'
                "
                @click="emit('close')"
              >
                {{ p.title }}
                <span v-if="p.badge" class="ml-auto rounded-4 bg-white px-1.5 text-[10px] leading-4 font-medium text-primary-20 ring-1 ring-primary-80 ring-inset">{{ p.badge }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <p v-if="!tree.length" class="px-2.5 text-base text-muted">No pages match “{{ filter }}”.</p>
    </nav>
  </aside>
</template>
