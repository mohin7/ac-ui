<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  /** Keys of a shortcut, pressed together: `['mod', 'k']`. Names like `mod`, `shift`, `enter`, `up` become the platform's symbol or name. Leave empty to use the default slot for one key. */
  keys?: string[];
  /** `small` 18px for menus and tooltips, `normal` 22px for body text. */
  size?: "small" | "normal";
  /** Shown between keys. Pass an empty string for the macOS style (⌘K). */
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  keys: () => [],
  size: "normal",
  separator: "+",
});

defineSlots<{
  /** A single key, when `keys` is empty. */
  default?: () => unknown;
}>();

const KEY_CLASS =
  "inline-flex items-center justify-center border border-border border-b-border-dark bg-surface-muted font-sans font-medium text-label shadow-[inset_0_-1px_0_0_var(--color-border)] select-none";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

// Symbols are drawn for sighted users; the spoken name is kept for screen readers.
const named: Record<string, { glyph: string; spoken: string }> = {
  mod: isMac ? { glyph: "⌘", spoken: "Command" } : { glyph: "Ctrl", spoken: "Control" },
  cmd: { glyph: "⌘", spoken: "Command" },
  command: { glyph: "⌘", spoken: "Command" },
  ctrl: { glyph: "Ctrl", spoken: "Control" },
  control: { glyph: "Ctrl", spoken: "Control" },
  alt: isMac ? { glyph: "⌥", spoken: "Option" } : { glyph: "Alt", spoken: "Alt" },
  option: { glyph: "⌥", spoken: "Option" },
  shift: isMac ? { glyph: "⇧", spoken: "Shift" } : { glyph: "Shift", spoken: "Shift" },
  enter: isMac ? { glyph: "↩", spoken: "Return" } : { glyph: "Enter", spoken: "Enter" },
  return: { glyph: "↩", spoken: "Return" },
  esc: { glyph: "Esc", spoken: "Escape" },
  escape: { glyph: "Esc", spoken: "Escape" },
  tab: { glyph: "Tab", spoken: "Tab" },
  backspace: { glyph: "⌫", spoken: "Backspace" },
  delete: { glyph: "Del", spoken: "Delete" },
  space: { glyph: "Space", spoken: "Space" },
  up: { glyph: "↑", spoken: "Up arrow" },
  down: { glyph: "↓", spoken: "Down arrow" },
  left: { glyph: "←", spoken: "Left arrow" },
  right: { glyph: "→", spoken: "Right arrow" },
};

const parts = computed(() =>
  props.keys.map((key) => {
    const known = named[key.toLowerCase()];
    if (known) return { ...known, symbol: known.glyph !== known.spoken };
    const glyph = key.length === 1 ? key.toUpperCase() : key;
    return { glyph, spoken: glyph, symbol: false };
  }),
);

const keyClass = computed(() =>
  props.size === "small" ? "h-4.5 min-w-4.5 px-1 text-sm rounded-4" : "h-5.5 min-w-5.5 px-1.5 text-xs rounded-6",
);
</script>

<template>
  <kbd
    v-if="!parts.length"
    :class="[KEY_CLASS, keyClass]"
    data-testid="ac-kbd"
  >
    <slot />
  </kbd>
  <kbd v-else class="inline-flex items-center gap-0.5 font-sans" data-testid="ac-kbd">
    <template v-for="(part, i) in parts" :key="i">
      <span v-if="i > 0 && separator" class="px-px text-xs text-muted">{{ separator }}</span>
      <kbd :class="[KEY_CLASS, keyClass]">
        <template v-if="part.symbol">
          <span aria-hidden="true">{{ part.glyph }}</span>
          <span class="sr-only">{{ part.spoken }}</span>
        </template>
        <template v-else>{{ part.glyph }}</template>
      </kbd>
    </template>
  </kbd>
</template>
