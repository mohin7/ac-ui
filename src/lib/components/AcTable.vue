<script setup lang="ts" generic="Row extends Record<string, unknown>">
import { computed, ref } from "vue";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface Props<R> {
  /** Column definitions: `{ key, label, sortable?, align?, width? }`. */
  columns: Column[];
  /** Row objects. Each column's `key` is read from the row. */
  rows: R[];
  /** Row property used as the Vue `key`. */
  rowKey?: string;
  /** Shows skeleton rows instead of data. */
  loading?: boolean;
  /** Number of skeleton rows while loading. */
  loaderRows?: number;
  /** Text shown when `rows` is empty (or use the `empty` slot). */
  emptyText?: string;
  /** Adds a pointer cursor and emits `row-click`. */
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props<Row>>(), {
  rowKey: "id",
  loading: false,
  loaderRows: 3,
  emptyText: "No data found",
  clickable: false,
});

const emit = defineEmits<{ "row-click": [row: Row]; sort: [key: string, mode: "asc" | "desc"] }>();

defineSlots<{
  /** Custom cell for a column: `#cell-name="{ row, value }"`. One slot per column key. */
  [key: `cell-${string}`]: (props: { row: Row; value: unknown }) => unknown;
  /** Content shown when `rows` is empty. */
  empty?: () => unknown;
}>();

const sortKey = ref<string>("");
const sortMode = ref<"asc" | "desc">("asc");

const toggleSort = (col: Column) => {
  if (!col.sortable) return;
  if (sortKey.value === col.key) sortMode.value = sortMode.value === "asc" ? "desc" : "asc";
  else {
    sortKey.value = col.key;
    sortMode.value = "asc";
  }
  emit("sort", sortKey.value, sortMode.value);
};

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows;
  const k = sortKey.value;
  const dir = sortMode.value === "asc" ? 1 : -1;
  return [...props.rows].sort((a, b) => String(a[k] ?? "").localeCompare(String(b[k] ?? ""), undefined, { numeric: true }) * dir);
});

const alignClass = (col: Column) => ({ left: "text-left", center: "text-center", right: "text-right" })[col.align ?? "left"];
</script>

<template>
  <div class="ac-scrollbar w-full rounded-10 border border-border bg-white shadow-xs" data-testid="ac-table">
    <table class="w-full border-separate border-spacing-0 text-base">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            class="h-9 border-b border-border bg-surface-muted px-4 text-xs font-medium whitespace-nowrap text-label first:rounded-tl-10 last:rounded-tr-10"
            :class="[alignClass(col), col.sortable && 'cursor-pointer select-none transition-colors hover:text-heading']"
            :style="col.width ? { width: col.width } : undefined"
            :aria-sort="sortKey === col.key ? (sortMode === 'asc' ? 'ascending' : 'descending') : undefined"
            @click="toggleSort(col)"
          >
            <span class="inline-flex items-center gap-1" :class="sortKey === col.key && 'text-heading'">
              {{ col.label }}
              <svg
                v-if="col.sortable"
                class="size-3 transition-transform"
                :class="[sortKey === col.key ? 'text-primary' : 'text-slate-60', sortKey === col.key && sortMode === 'desc' && 'rotate-180']"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path v-if="sortKey === col.key" d="M6 9.5v-7M3 5.5l3-3 3 3" />
                <path v-else d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
              </svg>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="i in loaderRows" :key="`loader-${i}`">
            <td v-for="(col, c) in columns" :key="col.key" class="h-12 border-b border-border-light px-4 [tr:last-child_&]:border-0">
              <span class="block h-2.5 animate-pulse rounded-full bg-surface-sunken" :style="{ width: `${50 + ((i * 17 + c * 23) % 40)}%` }" />
            </td>
          </tr>
        </template>
        <tr v-else-if="!rows.length">
          <td :colspan="columns.length" class="px-4 py-12 text-center text-muted">
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="(row, i) in sortedRows"
            :key="String(row[rowKey] ?? i)"
            class="group transition-colors duration-100 hover:bg-surface-muted/70"
            :class="clickable && 'cursor-pointer'"
            @click="clickable && emit('row-click', row)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="h-12 border-b border-border-light px-4 whitespace-nowrap text-body tabular-nums group-last:border-0"
              :class="alignClass(col)"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">{{ row[col.key] }}</slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
