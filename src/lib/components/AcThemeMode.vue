<script setup lang="ts">
import { Monitor, Moon, Sun } from "lucide-vue-next";
import { useColorMode } from "../composables/useColorMode";
import type { ColorMode } from "../composables/useColorMode";

export interface Props {
  /** Used until the viewer picks a mode. */
  defaultMode?: ColorMode;
  /** `icons` is a compact 3-icon switch; `labels` adds the words, for menus and settings pages. */
  display?: "icons" | "labels";
}

const props = withDefaults(defineProps<Props>(), {
  defaultMode: "light",
  display: "icons",
});

const emit = defineEmits<{
  /** The theme now showing, after resolving `system`. Same event as the old ThemeMode. */
  "set:theme": [theme: "light" | "dark"];
}>();

const modes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const { mode, isDark, setMode } = useColorMode({ defaultMode: props.defaultMode });

function choose(next: ColorMode) {
  setMode(next);
  emit("set:theme", isDark.value ? "dark" : "light");
}
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Theme"
    class="inline-flex items-center gap-0.5 rounded-8 border border-border bg-surface-muted p-0.5"
    data-testid="ac-theme-mode"
  >
    <button
      v-for="m in modes"
      :key="m.value"
      type="button"
      role="radio"
      :aria-checked="mode === m.value"
      :aria-label="display === 'icons' ? `${m.label} theme` : undefined"
      :title="display === 'icons' ? `${m.label} theme` : undefined"
      class="inline-flex h-6.5 cursor-pointer items-center justify-center gap-1.5 rounded-6 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      :class="[
        display === 'icons' ? 'w-7' : 'px-2.5',
        mode === m.value ? 'bg-surface text-heading shadow-sm ring-1 ring-border' : 'text-muted hover:text-heading',
      ]"
      @click="choose(m.value)"
    >
      <component :is="m.icon" class="size-3.5" aria-hidden="true" />
      <span v-if="display === 'labels'">{{ m.label }}</span>
    </button>
  </div>
</template>
