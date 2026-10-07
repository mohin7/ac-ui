<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, nextTick, ref, toRaw, useId } from "vue";
import { Check, ChevronDown, ChevronRight, CircleAlert, Pencil, Plus, Trash2, X } from "@lucide/vue";
import AcBadge from "./AcBadge.vue";
import AcButton from "./AcButton.vue";
import AcCellValue from "./AcCellValue.vue";
import AcSpinner from "./AcSpinner.vue";
import type { Ref } from "vue";
import type { CellType } from "./AcCellValue.vue";

/** A column of the item table. */
export interface FormArrayColumn<I = Record<string, unknown>> {
  /** Item property shown in this column. Also names the `cell-<key>` and `field-<key>` slots. */
  key: string;
  /** Header text. */
  label: string;
  /** Shows the value with AcCellValue as this type, e.g. `date` or `labels`. Defaults to `auto`. */
  type?: CellType;
  /** Turns the value into text, e.g. to add a unit. */
  format?: (value: unknown, item: I) => string;
  /** CSS width of the column. */
  width?: string;
}

export interface Props<I> {
  /** Name of the field, e.g. “Quotas” or “Environment Variables”. */
  label: string;
  /** Columns of the item table: `{ key, label, type?, format?, width? }`. */
  columns: FormArrayColumn<I>[];
  /** Singular name of one item, used in buttons and screen-reader text: “Add quota”, “Edit quota cpu-limit”. */
  itemName?: string;
  /** Creates the starting value of a new item. */
  newItem?: () => I;
  /** `form` opens a panel under the row for the `form` slot; `inline` edits in the row itself through `field-<key>` slots. */
  mode?: "form" | "inline";
  /** Checks an item before it's saved. Return errors by field key, or one message. `index` is -1 for a new item. */
  validate?: (item: I, index: number) => Record<string, string> | string | null | undefined | void;
  /** Runs after validation and before the list changes, e.g. to save to the API. Return `false` (or throw) to keep the form open. */
  beforeSave?: (item: I, index: number) => boolean | void | Promise<boolean | void>;
  /** Runs before an item is removed, e.g. to ask for confirmation. Return `false` to keep it. */
  beforeRemove?: (item: I, index: number) => boolean | void | Promise<boolean | void>;
  /** Marks the field required and adds a red asterisk. Show `errorMsg` when it's empty. */
  required?: boolean;
  /** Disables adding, editing and removing. */
  disabled?: boolean;
  /** Hides every action and shows the items only. */
  readonly?: boolean;
  /** Shows the Edit button on each row. */
  editable?: boolean;
  /** Disables the Add button only, e.g. until a namespace is chosen. */
  addDisabled?: boolean;
  /** Most items allowed. The Add button disables at the limit. */
  max?: number;
  /** Shows a spinner on Save and blocks the actions, e.g. while you save outside `beforeSave`. */
  loading?: boolean;
  /** Lets people collapse the field to its header. */
  collapsible?: boolean;
  /** Starts collapsed. Needs `collapsible`. */
  defaultCollapsed?: boolean;
  /** Error for the whole field, e.g. “Add at least one quota”. A list shows one per line. */
  errorMsg?: string | string[];
  /** Helper text under the label (hidden while `errorMsg` is set). */
  hint?: string;
  /** Text of the Add button. Defaults to “Add <itemName>”. */
  addLabel?: string;
  /** Heading of the form. Defaults to “New <itemName>” or “Edit <itemName>”. */
  formTitle?: string;
  /** Text shown when there are no items (or use the `empty` slot). */
  emptyText?: string;
}

type Row = { kind: "item" | "form" | "inline" | "details"; index: number };

const props = withDefaults(defineProps<Props<T>>(), {
  itemName: "item",
  newItem: () => ({}) as T,
  mode: "form",
  validate: undefined,
  beforeSave: undefined,
  beforeRemove: undefined,
  required: false,
  disabled: false,
  readonly: false,
  editable: true,
  addDisabled: false,
  max: undefined,
  loading: false,
  collapsible: false,
  defaultCollapsed: false,
  errorMsg: "",
  hint: "",
  addLabel: "",
  formTitle: "",
  emptyText: "Nothing added yet.",
});

/** The items. Bind with `v-model`; it's replaced with a new array on every change. */
const model = defineModel<T[]>({ default: () => [] });

const emit = defineEmits<{
  add: [item: T];
  update: [item: T, index: number];
  remove: [item: T, index: number];
}>();

const slots = defineSlots<{
  /** The editor in `form` mode. Bind fields to `item` (a copy, saved on Save) and show `errors[key]` under them. `index` is -1 for a new item. */
  form?: (props: { item: T; index: number; errors: Record<string, string>; isNew: boolean }) => unknown;
  /** The field for a column in `inline` mode, e.g. `#field-name="{ item, error }"`. */
  [name: `field-${string}`]: (props: { item: T; index: number; error: string; errors: Record<string, string> }) => unknown;
  /** Custom display of a column's value, e.g. `#cell-status="{ value }"`. */
  [name: `cell-${string}`]: (props: { item: T; index: number; value: unknown }) => unknown;
  /** More about an item, shown under its row behind a toggle button. */
  details?: (props: { item: T; index: number }) => unknown;
  /** Extra buttons before Edit and Remove on each row. */
  "row-actions"?: (props: { item: T; index: number }) => unknown;
  /** Replaces the empty text, e.g. to explain what to add. */
  empty?: () => unknown;
}>();

const NEW = -1;
const FOCUSABLE = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [role="combobox"]:not([aria-disabled="true"]), button:not([disabled])';

const id = useId();
const labelId = `${id}-label`;
const bodyId = `${id}-body`;
const messageId = `${id}-msg`;

const root = ref<HTMLElement | null>(null);
const collapsed = ref(props.collapsible && props.defaultCollapsed);
const editingIndex = ref<number | null>(null);
// Cast: a generic T would otherwise be unwrapped to UnwrapRef<T>
const draft = ref({}) as Ref<T>;
const errors = ref<Record<string, string>>({});
const formError = ref("");
const pending = ref(false);
const expanded = ref(new Set<number>());
const announcement = ref("");

const items = computed(() => model.value ?? []);
const busy = computed(() => pending.value || props.loading);
const editing = computed(() => editingIndex.value !== null);
const errorLines = computed(() => (Array.isArray(props.errorMsg) ? props.errorMsg : props.errorMsg ? [props.errorMsg] : []));
const atMax = computed(() => props.max !== undefined && items.value.length >= props.max);
const canAdd = computed(() => !props.disabled && !props.addDisabled && !atMax.value && !editing.value && !busy.value);
const rowActionsDisabled = computed(() => props.disabled || editing.value || busy.value);
const hasActionsColumn = computed(() => !props.readonly || !!slots.details || !!slots["row-actions"]);
const showTable = computed(() => items.value.length > 0 || editingIndex.value === NEW);
const colspan = computed(() => props.columns.length + (hasActionsColumn.value ? 1 : 0));
const addText = computed(() => props.addLabel || `Add ${props.itemName}`);
const formHeading = computed(
  () => props.formTitle || `${editingIndex.value === NEW ? "New" : "Edit"} ${props.itemName}`,
);

const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  items.value.forEach((_, index) => {
    const isEditing = editingIndex.value === index;
    out.push({ kind: isEditing && props.mode === "inline" ? "inline" : "item", index });
    if (isEditing && props.mode === "form") out.push({ kind: "form", index });
    else if (!isEditing && expanded.value.has(index)) out.push({ kind: "details", index });
  });
  if (editingIndex.value === NEW) out.push({ kind: props.mode === "inline" ? "inline" : "form", index: NEW });
  return out;
});

function itemAt(index: number) {
  return index === NEW ? draft.value : items.value[index]!;
}

function rowName(index: number) {
  const first = props.columns[0];
  const value = first ? items.value[index]?.[first.key] : undefined;
  return value === undefined || value === null || typeof value === "object" || value === ""
    ? `${props.itemName} ${index + 1}`
    : `${props.itemName} ${String(value)}`;
}

function cellText(column: FormArrayColumn<T>, index: number) {
  const item = itemAt(index);
  return column.format ? column.format(item[column.key], item) : null;
}

function clone(item: T): T {
  try {
    return structuredClone(toRaw(item));
  } catch {
    return JSON.parse(JSON.stringify(item)) as T;
  }
}

function focusIn(selector: string, fallback?: () => HTMLElement | null | undefined) {
  nextTick(() => {
    const el = root.value?.querySelector<HTMLElement>(selector) ?? fallback?.();
    el?.focus();
  });
}

function focusEditor() {
  nextTick(() => {
    const editor = root.value?.querySelector<HTMLElement>("[data-editor]");
    const field = editor?.querySelector<HTMLElement>(`[data-editor-fields] :is(${FOCUSABLE})`) ?? editor?.querySelector<HTMLElement>(FOCUSABLE);
    field?.focus();
  });
}

function focusAfterClose(index: number) {
  if (index >= 0 && index < items.value.length) focusIn(`[data-row="${index}"] [data-action="edit"], [data-row="${index}"] [data-action="remove"]`, addButton);
  else focusIn("[data-action='add']");
}

function addButton() {
  return root.value?.querySelector<HTMLElement>("[data-action='add']");
}

function resetForm() {
  errors.value = {};
  formError.value = "";
}

function startAdd() {
  if (!canAdd.value) return;
  collapsed.value = false;
  resetForm();
  draft.value = props.newItem();
  editingIndex.value = NEW;
  focusEditor();
}

function startEdit(index: number) {
  if (rowActionsDisabled.value || !props.editable) return;
  resetForm();
  draft.value = clone(items.value[index]!);
  editingIndex.value = index;
  focusEditor();
}

function cancel() {
  const index = editingIndex.value;
  if (index === null || pending.value) return;
  editingIndex.value = null;
  resetForm();
  focusAfterClose(index);
}

async function save() {
  const index = editingIndex.value;
  if (index === null || busy.value) return;
  const item = draft.value;
  const result = props.validate?.(item, index);
  errors.value = result && typeof result === "object" ? result : {};
  formError.value = typeof result === "string" ? result : "";
  if (formError.value || Object.keys(errors.value).length) {
    focusIn("[data-editor] [aria-invalid='true'], [data-editor] [aria-invalid='true'] input");
    return;
  }
  pending.value = true;
  try {
    if ((await props.beforeSave?.(item, index)) === false) return;
  } catch (e) {
    formError.value = e instanceof Error ? e.message : String(e);
    return;
  } finally {
    pending.value = false;
  }
  // New array — the parent's model may be readonly
  const next = [...items.value];
  if (index === NEW) next.push(item);
  else next[index] = item;
  model.value = next;
  editingIndex.value = null;
  resetForm();
  if (index === NEW) {
    emit("add", item);
    announcement.value = `${capitalize(props.itemName)} added.`;
  } else {
    emit("update", item, index);
    announcement.value = `${capitalize(props.itemName)} updated.`;
  }
  focusAfterClose(index === NEW ? next.length - 1 : index);
}

async function remove(index: number) {
  if (rowActionsDisabled.value) return;
  const item = items.value[index]!;
  if (props.beforeRemove) {
    pending.value = true;
    try {
      if ((await props.beforeRemove(item, index)) === false) return;
    } finally {
      pending.value = false;
    }
  }
  model.value = items.value.filter((_, i) => i !== index);
  expanded.value = new Set();
  emit("remove", item, index);
  announcement.value = `${capitalize(props.itemName)} removed.`;
  focusAfterClose(Math.min(index, items.value.length - 1));
}

function toggleDetails(index: number) {
  const next = new Set(expanded.value);
  if (!next.delete(index)) next.add(index);
  expanded.value = next;
}

function onEditorKeydown(e: KeyboardEvent) {
  // An open select or menu inside handles its own keys first.
  if (e.defaultPrevented) return;
  const target = e.target as HTMLElement;
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    cancel();
  } else if (e.key === "Enter" && target.tagName === "INPUT" && !["checkbox", "radio", "file"].includes((target as HTMLInputElement).type)) {
    e.preventDefault();
    save();
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

defineExpose({
  /** Opens the form for a new item. */
  add: startAdd,
  /** Opens the form for the item at `index`. */
  edit: startEdit,
  /** Closes the form without saving. */
  cancel,
});
</script>

<template>
  <div
    ref="root"
    role="group"
    :aria-labelledby="labelId"
    :aria-describedby="errorLines.length || hint ? messageId : undefined"
    data-ac-ds
    data-testid="ac-form-array"
  >
    <!-- header -->
    <div class="flex min-h-8 items-center justify-between gap-3">
      <component
        :is="collapsible ? 'button' : 'div'"
        :type="collapsible ? 'button' : undefined"
        class="-ml-1 flex min-w-0 items-center gap-1.5 rounded-6 px-1 py-0.5 text-left"
        :class="collapsible && 'cursor-pointer transition hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring'"
        :aria-expanded="collapsible ? !collapsed : undefined"
        :aria-controls="collapsible ? bodyId : undefined"
        @click="collapsible && (collapsed = !collapsed)"
      >
        <ChevronRight
          v-if="collapsible"
          class="size-4 shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none"
          :class="!collapsed && 'rotate-90'"
          aria-hidden="true"
        />
        <span :id="labelId" class="truncate text-lg font-medium text-heading">
          {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
        </span>
        <AcBadge v-if="items.length" :label="String(items.length)" rounded class="shrink-0" />
        <span v-if="required" class="sr-only">(required)</span>
      </component>
      <AcButton
        v-if="!readonly"
        data-action="add"
        :title="addText"
        size="small"
        color="white"
        :disabled="!canAdd"
        @click="startAdd"
      >
        <template #icon><Plus aria-hidden="true" /></template>
      </AcButton>
    </div>

    <div v-if="errorLines.length" :id="messageId" class="mt-1 space-y-0.5">
      <p v-for="line in errorLines" :key="line" class="flex items-center gap-1 text-xs text-red-30">
        <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
        {{ line }}
      </p>
    </div>
    <p v-else-if="hint" :id="messageId" class="mt-0.5 text-xs text-muted">{{ hint }}</p>

    <div v-show="!collapsed" :id="bodyId" class="mt-2">
      <div
        v-if="showTable"
        class="overflow-hidden rounded-10 border bg-surface shadow-xs"
        :class="errorLines.length ? 'border-red-60' : 'border-border'"
      >
        <div class="ac-scrollbar">
          <table class="w-full border-separate border-spacing-0 text-base">
            <caption class="sr-only">{{ label }}</caption>
            <thead>
              <tr>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  scope="col"
                  class="h-8 border-b border-border bg-surface-muted px-3 text-left text-xs font-medium whitespace-nowrap text-label"
                  :style="col.width ? { width: col.width } : undefined"
                >
                  {{ col.label }}
                </th>
                <th v-if="hasActionsColumn" scope="col" class="h-8 w-px border-b border-border bg-surface-muted px-3 text-right">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="row in rows" :key="`${row.kind}-${row.index}`">
                <!-- an item -->
                <tr v-if="row.kind === 'item'" :data-row="row.index" class="group/row">
                  <td
                    v-for="col in columns"
                    :key="col.key"
                    class="h-10 border-b border-border-light px-3 whitespace-nowrap text-body [tr:last-child_&]:border-b-0"
                  >
                    <slot :name="`cell-${col.key}`" :item="itemAt(row.index)" :index="row.index" :value="itemAt(row.index)[col.key]">
                      <template v-if="col.format">{{ cellText(col, row.index) }}</template>
                      <AcCellValue v-else :value="itemAt(row.index)[col.key]" :type="col.type ?? 'auto'" :title="col.label" max-width="220px" />
                    </slot>
                  </td>
                  <td v-if="hasActionsColumn" class="h-10 border-b border-border-light px-2 text-right whitespace-nowrap [tr:last-child_&]:border-b-0">
                    <span class="inline-flex items-center gap-0.5">
                      <slot name="row-actions" :item="itemAt(row.index)" :index="row.index" />
                      <button
                        v-if="$slots.details"
                        type="button"
                        class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                        :aria-expanded="expanded.has(row.index)"
                        :aria-label="`Details of ${rowName(row.index)}`"
                        @click="toggleDetails(row.index)"
                      >
                        <ChevronDown class="size-4 transition-transform motion-reduce:transition-none" :class="expanded.has(row.index) && 'rotate-180'" aria-hidden="true" />
                      </button>
                      <button
                        v-if="editable && !readonly"
                        type="button"
                        data-action="edit"
                        class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        :aria-label="`Edit ${rowName(row.index)}`"
                        :disabled="rowActionsDisabled"
                        @click="startEdit(row.index)"
                      >
                        <Pencil class="size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        v-if="!readonly"
                        type="button"
                        data-action="remove"
                        class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-red-95 hover:text-red-30 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted"
                        :aria-label="`Remove ${rowName(row.index)}`"
                        :disabled="rowActionsDisabled"
                        @click="remove(row.index)"
                      >
                        <Trash2 class="size-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  </td>
                </tr>

                <!-- inline editor row -->
                <tr
                  v-else-if="row.kind === 'inline'"
                  data-editor
                  :aria-label="formHeading"
                  class="bg-surface-muted"
                  @keydown="onEditorKeydown"
                >
                  <td v-for="col in columns" :key="col.key" data-editor-fields class="border-b border-border-light px-2 py-2 align-top [tr:last-child_&]:border-b-0">
                    <slot
                      :name="`field-${col.key}`"
                      :item="draft"
                      :index="row.index"
                      :error="errors[col.key] ?? ''"
                      :errors="errors"
                    >
                      <span class="inline-flex h-9 items-center px-1 text-body">
                        <AcCellValue :value="draft[col.key]" :type="col.type ?? 'auto'" :title="col.label" max-width="220px" />
                      </span>
                    </slot>
                  </td>
                  <td class="border-b border-border-light px-2 py-2 text-right align-top whitespace-nowrap [tr:last-child_&]:border-b-0">
                    <span class="inline-flex h-9 items-center gap-0.5">
                      <button
                        type="button"
                        class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-primary-20 transition hover:bg-primary-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                        :aria-label="row.index === NEW ? `Add ${itemName}` : `Save ${itemName}`"
                        :disabled="busy || disabled"
                        @click="save"
                      >
                        <AcSpinner v-if="busy" class="text-primary" label="" />
                        <Check v-else class="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Cancel"
                        :disabled="pending"
                        @click="cancel"
                      >
                        <X class="size-4" aria-hidden="true" />
                      </button>
                    </span>
                    <p v-if="formError" role="alert" class="mt-1 max-w-48 text-left text-xs whitespace-normal text-red-30">{{ formError }}</p>
                  </td>
                </tr>

                <!-- form editor panel -->
                <tr v-else-if="row.kind === 'form'">
                  <td :colspan="colspan" class="border-b border-border-light bg-surface-muted p-0 [tr:last-child_&]:border-b-0">
                    <div
                      data-editor
                      role="group"
                      :aria-labelledby="`${id}-form-title`"
                      class="px-4 py-4"
                      @keydown="onEditorKeydown"
                    >
                      <p :id="`${id}-form-title`" class="mb-3 text-base font-medium text-heading">{{ formHeading }}</p>
                      <div data-editor-fields class="space-y-4">
                        <slot name="form" :item="draft" :index="row.index" :errors="errors" :is-new="row.index === NEW" />
                      </div>
                      <p v-if="formError" role="alert" class="mt-3 flex items-center gap-1 text-xs text-red-30">
                        <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
                        {{ formError }}
                      </p>
                      <div class="mt-4 flex justify-end gap-2">
                        <AcButton title="Cancel" size="small" color="white" :disabled="pending" @click="cancel" />
                        <AcButton
                          :title="row.index === NEW ? `Add ${itemName}` : 'Save'"
                          size="small"
                          :loading="busy"
                          :disabled="disabled"
                          @click="save"
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- details -->
                <tr v-else-if="row.kind === 'details'">
                  <td :colspan="colspan" class="border-b border-border-light bg-surface-muted px-4 py-3 text-base text-body [tr:last-child_&]:border-b-0">
                    <slot name="details" :item="itemAt(row.index)" :index="row.index" />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-else
        class="rounded-10 border border-dashed px-4 py-5 text-center text-base text-muted"
        :class="errorLines.length ? 'border-red-60' : 'border-border-dark'"
      >
        <slot name="empty">{{ emptyText }}</slot>
      </div>
    </div>

    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
  </div>
</template>
