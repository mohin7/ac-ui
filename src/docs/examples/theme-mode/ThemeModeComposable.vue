<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
import { useColorMode } from "@/lib";

const { isDark, mode, setMode } = useColorMode();
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      type="button"
      class="inline-flex size-8 cursor-pointer items-center justify-center rounded-6 border border-border bg-surface text-heading shadow-xs transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="setMode(isDark ? 'light' : 'dark')"
    >
      <component :is="isDark ? Sun : Moon" class="size-4" aria-hidden="true" />
    </button>
    <span class="text-base text-muted">Mode: <code class="font-mono text-heading">{{ mode }}</code></span>
  </div>
</template>
