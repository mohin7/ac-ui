<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  /** `text` lines, a `circle` or `rect`, or a preset: `table`, `card`, `info-card`, `editor`. */
  shape?: "text" | "circle" | "rect" | "table" | "card" | "info-card" | "editor";
  /** Number of text lines. The last one is shorter so the block reads as a paragraph. */
  lines?: number;
  /** Rows of the `table` preset, not counting the header. */
  rows?: number;
  /** Columns of the `table` preset. */
  cols?: number;
  /** CSS width, e.g. `"80%"` or `"240px"`. Defaults to full width, or to `height` for a circle. */
  width?: string;
  /** CSS height of a `rect` or `editor` (default `320px`, like AcCodeEditor), the diameter of a `circle`, or the height of each `text` line. */
  height?: string;
  /** Hidden text for screen readers. Pass an empty string to hide the skeleton from them, e.g. when several are composed inside one `aria-busy` region. */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  shape: "text",
  lines: 1,
  rows: 5,
  cols: 4,
  width: "",
  height: "",
  label: "Loading",
});

const BONE = "ac-skeleton-bone block rounded-4";

// Fixed rather than random so the layout doesn't jump between renders.
const TABLE_WIDTHS = ["70%", "45%", "60%", "35%", "55%", "40%"];
// Indent and width per line, so the `editor` preset reads as nested YAML.
const CODE_LINES = [[0, 30], [1, 40], [1, 25], [2, 45], [2, 35], [1, 30], [0, 20], [1, 50], [1, 35], [2, 40], [2, 30], [0, 25], [1, 45], [1, 30], [2, 50], [0, 35]] as const;

const rootStyle = computed(() => {
  if (props.shape === "circle") {
    const d = props.height || props.width || "40px";
    return { width: d, height: d };
  }
  if (props.shape === "rect") return { width: props.width || "100%", height: props.height || "80px" };
  if (props.shape === "editor") return { width: props.width || undefined, height: props.height || "320px" };
  return props.width ? { width: props.width } : undefined;
});

const lineHeight = computed(() => props.height || "12px");

const lineWidths = computed(() => {
  const count = Math.max(1, props.lines);
  return Array.from({ length: count }, (_, i) => (count > 1 && i === count - 1 ? "60%" : "100%"));
});
</script>

<template>
  <div
    :aria-busy="label ? 'true' : undefined"
    :aria-hidden="!label || undefined"
    class="max-w-full"
    :class="shape === 'circle' ? 'shrink-0' : !rootStyle?.width && 'w-full'"
    :style="rootStyle"
    data-testid="ac-skeleton"
  >
    <span v-if="shape === 'circle'" :class="BONE" class="size-full rounded-full" aria-hidden="true" />
    <span v-else-if="shape === 'rect'" :class="BONE" class="size-full rounded-6" aria-hidden="true" />

    <div v-else-if="shape === 'text'" class="flex flex-col gap-2" aria-hidden="true">
      <span v-for="(w, i) in lineWidths" :key="i" :class="BONE" :style="{ width: w, height: lineHeight }" />
    </div>

    <div v-else-if="shape === 'table'" class="w-full" aria-hidden="true">
      <div class="flex h-9 items-center gap-4 border-b border-border px-4">
        <span v-for="c in cols" :key="c" class="flex-1"><span :class="BONE" class="h-2.5 w-1/2 opacity-70" /></span>
      </div>
      <div v-for="r in rows" :key="r" class="flex h-12 items-center gap-4 border-b border-border-light px-4 last:border-0">
        <span v-for="c in cols" :key="c" class="flex-1">
          <span :class="BONE" class="h-3" :style="{ width: TABLE_WIDTHS[(r + c) % TABLE_WIDTHS.length] }" />
        </span>
      </div>
    </div>

    <div
      v-else-if="shape === 'editor'"
      class="flex size-full overflow-hidden rounded-10 border border-border bg-surface shadow-xs"
      aria-hidden="true"
    >
      <div class="flex w-11 shrink-0 flex-col items-end gap-2 border-r border-border-light bg-surface-muted px-2.5 py-3">
        <span v-for="(_, i) in CODE_LINES" :key="i" :class="BONE" class="h-2 w-3 shrink-0 opacity-60" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-2 px-3 py-3">
        <span
          v-for="([indent, width], i) in CODE_LINES"
          :key="i"
          :class="BONE"
          class="h-2 shrink-0"
          :style="{ marginLeft: `${indent * 16}px`, width: `${width}%` }"
        />
      </div>
    </div>

    <div v-else-if="shape === 'card'" class="rounded-10 border border-border bg-surface p-5 shadow-xs" aria-hidden="true">
      <span :class="BONE" class="h-4 w-2/5" />
      <span :class="BONE" class="mt-2 h-3 w-1/4" />
      <div class="mt-5 flex flex-col gap-2">
        <span :class="BONE" class="h-3 w-full" />
        <span :class="BONE" class="h-3 w-full" />
        <span :class="BONE" class="h-3 w-3/5" />
      </div>
    </div>

    <div v-else class="rounded-10 border border-border bg-surface p-4 shadow-xs" aria-hidden="true">
      <div class="flex items-center gap-3">
        <span :class="BONE" class="size-10 shrink-0 rounded-8" />
        <div class="min-w-0 flex-1">
          <span :class="BONE" class="h-3.5 w-1/2" />
          <span :class="BONE" class="mt-2 h-2.5 w-1/3" />
        </div>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-border-light pt-4">
        <span :class="BONE" class="h-2.5 w-3/5" />
        <span :class="BONE" class="h-2.5 w-2/5 justify-self-end" />
        <span :class="BONE" class="h-2.5 w-1/2" />
        <span :class="BONE" class="h-2.5 w-1/3 justify-self-end" />
      </div>
    </div>

    <span v-if="label" class="sr-only">{{ label }}</span>
  </div>
</template>
