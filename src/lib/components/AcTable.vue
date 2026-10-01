<script setup lang="ts" generic="Row extends Record<string, unknown>">
import { computed, ref } from "vue";
import { ArrowUp, ChevronsUpDown } from "lucide-vue-next";
import AcCellValue from "./AcCellValue.vue";
import type { CellType, ResourceCell, ResourceColumn } from "./AcCellValue.vue";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  /** Shows values with AcCellValue as this type (`auto`, `date`, `labels`, `status`…): dashes for empty values, relative dates, label chips. */
  type?: CellType;
  /** A server-side column descriptor. Shows values with AcCellValue; a row value may be a server cell `{ data, link, color }`. */
  descriptor?: ResourceColumn;
}

export interface Props<R> {
  /** Column definitions: `{ key, label, sortable?, align?, width?, type?, descriptor? }`. `type` or `descriptor` shows values with AcCellValue. */
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
  return [...props.rows].sort((a, b) => String(sortValue(a[k]) ?? "").localeCompare(String(sortValue(b[k]) ?? ""), undefined, { numeric: true }) * dir);
});

function isCell(v: unknown): v is ResourceCell {
  return v !== null && typeof v === "object" && !Array.isArray(v) && "data" in v;
}

function sortValue(v: unknown) {
  return isCell(v) ? (v.sort ?? v.data) : v;
}

const alignClass = (col: Column) => ({ left: "text-left", center: "text-center", right: "text-right" })[col.align ?? "left"];
</script>

<template>
  <div class="w-full overflow-hidden rounded-10 border border-border bg-surface shadow-xs" data-testid="ac-table">
    <div class="ac-scrollbar">
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
                <component
                  :is="sortKey === col.key ? ArrowUp : ChevronsUpDown"
                  v-if="col.sortable"
                  class="size-3 transition-transform"
                  :class="[sortKey === col.key ? 'text-primary' : 'text-slate-60', sortKey === col.key && sortMode === 'desc' && 'rotate-180']"
                  aria-hidden="true"
                />
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
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                  <AcCellValue
                    v-if="col.type || col.descriptor"
                    :value="isCell(row[col.key]) ? undefined : row[col.key]"
                    :cell="isCell(row[col.key]) ? (row[col.key] as ResourceCell) : undefined"
                    :column="col.descriptor"
                    :type="col.type"
                    :title="col.label"
                  />
                  <template v-else>{{ row[col.key] }}</template>
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- Outside the scroller so it stays centred in the visible width on narrow screens -->
    <div v-if="!loading && !rows.length" class="px-4 py-12 text-center text-muted">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>
