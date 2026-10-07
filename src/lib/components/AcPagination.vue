<script setup lang="ts">
import { computed, watch } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import AcSelect from "./AcSelect.vue";

export interface Props {
  /** Total number of items across all pages. */
  total: number;
  /** Choices in the page-size select. */
  pageSizes?: number[];
  /** Hides the "Rows per page" select. */
  hidePageSize?: boolean;
  /** How many page numbers to show on each side of the current one before an ellipsis. */
  siblings?: number;
  /** Always use the compact "‹ 3 / 6 ›" control. It's used automatically below 640px. */
  compact?: boolean;
  /** Noun after the count: "Showing 1–10 of 57 databases". */
  itemLabel?: string;
  /** Disables every control, e.g. while a page loads. */
  disabled?: boolean;
  /** `small` makes the page buttons 28px (default `normal` is 32px). Use it inside cards and dense tables. */
  size?: "normal" | "small";
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
  hidePageSize: false,
  siblings: 1,
  compact: false,
  itemLabel: "",
  disabled: false,
  size: "normal",
});

/** The current page, starting at 1. Bind with `v-model:page`. */
const page = defineModel<number>("page", { default: 1 });
/** Items per page. Bind with `v-model:page-size`. */
const pageSize = defineModel<number>("pageSize", { default: 10 });

const emit = defineEmits<{
  /** The slice of items on the current page, 0-based and end-exclusive, ready for `list.slice(start, end)`. Fires on mount and on every change, like the old `pagination:pagechange`. */
  range: [range: { start: number; end: number }];
}>();

const box = computed(() => (props.size === "small" ? "size-7" : "size-8"));
const numberBox = computed(() => (props.size === "small" ? "h-7 min-w-7 text-sm" : "h-8 min-w-8 text-base"));

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, pageSize.value))));
const current = computed(() => Math.min(Math.max(1, page.value), pageCount.value));
const range = computed(() => ({
  start: Math.min((current.value - 1) * pageSize.value, props.total),
  end: Math.min(current.value * pageSize.value, props.total),
}));
const summary = computed(() => {
  const noun = props.itemLabel ? ` ${props.itemLabel}` : "";
  if (!props.total) return `0${noun || " items"}`;
  return `Showing ${range.value.start + 1}–${range.value.end} of ${props.total}${noun}`;
});
const sizeOptions = computed(() => {
  const sizes = props.pageSizes.includes(pageSize.value) ? props.pageSizes : [...props.pageSizes, pageSize.value].sort((a, b) => a - b);
  return sizes.map((n) => ({ value: n, label: String(n) }));
});
// Always the same number of slots (first, last, current ± siblings, two ellipses) so the control doesn't jump in width.
const items = computed<(number | "start-ellipsis" | "end-ellipsis")[]>(() => {
  const n = pageCount.value;
  const c = current.value;
  const s = Math.max(0, props.siblings);
  const slots = 5 + 2 * s;
  if (n <= slots) return Array.from({ length: n }, (_, i) => i + 1);
  const left = Math.max(c - s, 1);
  const right = Math.min(c + s, n);
  const showStart = left > 3;
  const showEnd = right < n - 2;
  const run = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (!showStart) return [...run(1, 3 + 2 * s), "end-ellipsis", n];
  if (!showEnd) return [1, "start-ellipsis", ...run(n - (2 + 2 * s), n)];
  return [1, "start-ellipsis", ...run(left, right), "end-ellipsis", n];
});

function goTo(p: number) {
  if (props.disabled) return;
  page.value = Math.min(Math.max(1, p), pageCount.value);
}

function changeSize(value: unknown) {
  const next = Number(value);
  if (!next || next === pageSize.value) return;
  // Keep the first visible item on screen after the page size changes.
  const first = range.value.start;
  pageSize.value = next;
  page.value = Math.floor(first / next) + 1;
}

watch(pageCount, (n) => {
  if (page.value > n) page.value = n;
});
watch(range, (r) => emit("range", { ...r }), { immediate: true });
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-base" data-ac-ds data-testid="ac-pagination">
    <div class="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
      <div v-if="!hidePageSize" class="flex items-center gap-2">
        <span class="text-xs whitespace-nowrap text-muted" aria-hidden="true">Rows per page</span>
        <div class="w-18">
          <AcSelect
            :model-value="pageSize"
            :options="sizeOptions"
            size="compact"
            placeholder="Rows per page"
            :disabled="disabled"
            @update:model-value="changeSize"
          />
        </div>
      </div>
      <p class="text-xs whitespace-nowrap text-muted tabular-nums" aria-live="polite">{{ summary }}</p>
    </div>

    <nav aria-label="Pagination" class="ml-auto">
      <ul class="flex items-center gap-1">
        <li>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center justify-center rounded-6 border border-border bg-surface text-body shadow-xs transition hover:border-border-dark hover:bg-surface-muted hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-surface"
            :class="box"
            aria-label="Previous page"
            :disabled="disabled || current <= 1"
            data-ac-ds
            data-testid="ac-pagination-prev"
            @click="goTo(current - 1)"
          >
            <ChevronLeft class="size-4" aria-hidden="true" />
          </button>
        </li>

        <li :class="compact ? 'flex' : 'flex sm:hidden'">
          <span class="px-2 text-xs whitespace-nowrap text-body tabular-nums">
            <span class="sr-only">Page </span><span class="font-medium text-heading">{{ current }}</span> / {{ pageCount }}
          </span>
        </li>

        <template v-if="!compact">
          <li v-for="item in items" :key="item" class="hidden sm:flex">
            <span v-if="typeof item === 'string'" class="inline-flex w-6 items-end justify-center text-xs text-muted" :class="size === 'small' ? 'h-7 pb-1.5' : 'h-8 pb-2'" aria-hidden="true">…</span>
            <button
              v-else
              type="button"
              class="inline-flex cursor-pointer items-center justify-center rounded-6 border px-2 font-medium tabular-nums transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
              :class="[
                numberBox,
                item === current
                  ? 'border-primary bg-primary-95 text-primary-20'
                  : 'border-transparent text-body hover:bg-surface-sunken hover:text-heading',
              ]"
              :aria-label="`Page ${item}`"
              :aria-current="item === current ? 'page' : undefined"
              :disabled="disabled"
              @click="goTo(item)"
            >
              {{ item }}
            </button>
          </li>
        </template>

        <li>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center justify-center rounded-6 border border-border bg-surface text-body shadow-xs transition hover:border-border-dark hover:bg-surface-muted hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-surface"
            :class="box"
            aria-label="Next page"
            :disabled="disabled || current >= pageCount"
            data-ac-ds
            data-testid="ac-pagination-next"
            @click="goTo(current + 1)"
          >
            <ChevronRight class="size-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
