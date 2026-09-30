<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Menu, Search } from "lucide-vue-next";
import { AcThemeMode } from "@/lib";
import BrandHueMenu from "./BrandHueMenu.vue";

const emit = defineEmits<{ search: []; menu: [] }>();
const route = useRoute();

const tabs = [
  { label: "Docs", to: "/getting-started/introduction", match: ["/getting-started", "/foundations"] },
  { label: "Components", to: "/components/button", match: ["/components"] },
  { label: "Examples", to: "/examples/databases", match: ["/examples"] },
];
const activeTab = computed(() => tabs.find((t) => t.match.some((m) => route.path.startsWith(m)))?.label);
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border-light bg-surface/85 backdrop-blur-md backdrop-saturate-150">
    <div class="mx-auto flex h-15 max-w-360 items-center gap-3 px-4 lg:px-8">
      <button
        type="button"
        class="-ml-1 inline-flex size-8 cursor-pointer items-center justify-center rounded-6 text-heading transition hover:bg-surface-sunken lg:hidden"
        aria-label="Open navigation"
        @click="emit('menu')"
      >
        <Menu class="size-4.5" aria-hidden="true" />
      </button>
      <RouterLink to="/" class="flex shrink-0 items-center gap-2.5" aria-label="AppsCode Design System home">
        <img src="/logos/appscode-mark.png" alt="" class="size-6.5 rounded-6" />
        <span class="flex items-baseline gap-1.5">
          <span class="text-[15px] font-semibold tracking-[-0.02em] text-heading">AppsCode</span>
          <span class="hidden text-[15px] font-normal tracking-[-0.02em] text-muted sm:inline">Design System</span>
        </span>
      </RouterLink>
      <span class="ml-1 hidden rounded-50 border border-border px-2 py-0.5 font-mono text-[11px] text-label sm:inline">v0.2</span>

      <nav class="ml-6 hidden items-center gap-0.5 md:flex" aria-label="Main">
        <RouterLink
          v-for="t in tabs"
          :key="t.label"
          :to="t.to"
          class="relative rounded-6 px-3 py-1.5 text-base font-medium transition-colors"
          :class="activeTab === t.label ? 'text-heading' : 'text-muted hover:text-heading'"
        >
          {{ t.label }}
          <span
            v-if="activeTab === t.label"
            class="absolute inset-x-3 -bottom-[15px] h-0.5 rounded-full bg-primary"
            aria-hidden="true"
          />
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          class="group inline-flex h-8 cursor-pointer items-center gap-2 rounded-6 border border-border bg-surface-muted pr-1.5 pl-2.5 text-base text-muted shadow-xs transition hover:border-border-dark hover:bg-surface sm:w-60"
          @click="emit('search')"
        >
          <Search class="size-3.5" aria-hidden="true" />
          <span class="hidden flex-1 text-left sm:inline">Search docs…</span>
          <kbd class="hidden h-5 items-center rounded-4 border border-border bg-surface px-1.5 font-sans text-[11px] font-medium text-label sm:inline-flex">
            {{ isMac ? "⌘" : "Ctrl" }} K
          </kbd>
        </button>
        <AcThemeMode class="hidden sm:inline-flex" default-mode="system" />
        <BrandHueMenu />
      </div>
    </div>
  </header>
</template>
