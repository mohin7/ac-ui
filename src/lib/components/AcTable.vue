<script setup lang="ts" generic="Row extends Record<string, unknown>">
import { computed, ref } from "vue";
import { ArrowUp, Check, ChevronsUpDown, Minus } from "lucide-vue-next";
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
  /** Adds a checkbox column for choosing rows, e.g. for bulk delete. Bind the chosen rows' `rowKey` values with `v-model:selected`. */
  selectable?: boolean;
  /** Turns a server cell's link template into a URL, e.g. to fill `${username}` and `${clustername}` from the current route. */
  resolveLink?: (link: string) => string;
}

const props = withDefaults(defineProps<Props<Row>>(), {
  rowKey: "id",
  loading: false,
  loaderRows: 3,
  emptyText: "No data found",
  clickable: false,
  selectable: false,
  resolveLink: undefined,
});

/** `rowKey` values of the chosen rows. Bind with `v-model:selected`. Rows that leave `rows` (another page, a search) stay chosen. */
const selected = defineModel<unknown[]>("selected", { default: () => [] });

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

const rowKeys = computed(() => props.rows.map((row) => row[props.rowKey]));
const selectedKeys = computed(() => new Set(selected.value));
const allSelected = computed(() => rowKeys.value.length > 0 && rowKeys.value.every((k) => selectedKeys.value.has(k)));
const someSelected = computed(() => !allSelected.value && rowKeys.value.some((k) => selectedKeys.value.has(k)));

// Only the rows in view: choices made on other pages are kept.
function toggleAll() {
  const inView = new Set(rowKeys.value);
  selected.value = allSelected.value
    ? selected.value.filter((k) => !inView.has(k))
    : [...selected.value, ...rowKeys.value.filter((k) => !selectedKeys.value.has(k))];
}

function toggleRow(row: Row) {
  const key = row[props.rowKey];
  selected.value = selectedKeys.value.has(key) ? selected.value.filter((k) => k !== key) : [...selected.value, key];
}

// Names the row by its first column, e.g. "Select demo-postgres", falling back to its key.
function rowLabel(row: Row) {
  const first = row[props.columns[0]?.key ?? ""];
  const text = isCell(first) ? first.data : first;
  return typeof text === "string" || typeof text === "number" ? text : String(row[props.rowKey]);
}

const checkboxClass =
  "peer size-4 cursor-pointer appearance-none rounded-4 border border-border-dark bg-surface align-middle shadow-xs transition-[background-color,border-color,box-shadow] duration-150 hover:border-slate-60 checked:border-primary checked:bg-primary checked:shadow-button indeterminate:border-primary indeterminate:bg-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const alignClass = (col: Column) => ({ left: "text-left", center: "text-center", right: "text-right" })[col.align ?? "left"];
</script>

<template>
  <div class="w-full overflow-hidden rounded-10 border border-border bg-surface shadow-xs" data-ac-ds data-testid="ac-table">
    <div class="ac-scrollbar">
      <table class="w-full border-separate border-spacing-0 text-base">
        <thead>
          <tr>
            <th v-if="selectable" scope="col" class="h-9 w-10 border-b border-border bg-surface-muted pr-0 pl-4 first:rounded-tl-10">
              <span class="relative flex size-4">
                <input
                  type="checkbox"
                  :class="checkboxClass"
                  :checked="allSelected"
                  :indeterminate="someSelected"
                  :disabled="loading || !rows.length"
                  aria-label="Select all rows"
                  @change="toggleAll"
                />
                <component
                  :is="someSelected ? Minus : Check"
                  class="pointer-events-none absolute inset-0 m-auto size-3 text-white opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-100"
                  :stroke-width="3"
                  aria-hidden="true"
                />
              </span>
            </th>
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
              <td v-if="selectable" class="h-12 border-b border-border-light pl-4 [tr:last-child_&]:border-0" />
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
              :class="[clickable && 'cursor-pointer', selectable && selectedKeys.has(row[rowKey]) && 'bg-primary-97']"
              @click="clickable && emit('row-click', row)"
            >
              <td v-if="selectable" class="h-12 w-10 border-b border-border-light pr-0 pl-4 group-last:border-0" @click.stop>
                <span class="relative flex size-4">
                  <input
                    type="checkbox"
                    :class="checkboxClass"
                    :checked="selectedKeys.has(row[rowKey])"
                    :aria-label="`Select ${rowLabel(row)}`"
                    @change="toggleRow(row)"
                  />
                  <Check
                    class="pointer-events-none absolute inset-0 m-auto size-3 text-white opacity-0 peer-checked:opacity-100"
                    :stroke-width="3"
                    aria-hidden="true"
                  />
                </span>
              </td>
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
                    :resolve-link="resolveLink"
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
