<script setup lang="ts" generic="V extends string | number">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useId, watch } from "vue";
import { Check, ChevronDown, CircleAlert, RefreshCw, Search, X } from "lucide-vue-next";
import AcSpinner from "./AcSpinner.vue";
import type { SelectOption } from "./types";

export interface Props<T extends string | number> {
  /** The choices: `{ value, label, description?, disabled?, group? }`. */
  options: SelectOption<T>[];
  /** Floating label. It rests inside the field and rises when a value is chosen or the list opens. */
  label?: string;
  /** Text shown in the field when there's no label and nothing is selected. */
  placeholder?: string;
  /** Allow several values; `v-model` becomes an array. */
  multiple?: boolean;
  /** Adds a search box to the list. Emits `search` so you can load options from an API. */
  searchable?: boolean;
  /** Shows a clear button when a value is selected. */
  clearable?: boolean;
  /** Shows a spinner and blocks the field while options load. */
  loading?: boolean;
  /** Shows a refresh button that emits `refresh`. */
  refreshable?: boolean;
  /** Disables the field. */
  disabled?: boolean;
  /** Marks the field required and adds a red asterisk. */
  required?: boolean;
  /** Error text under the field. */
  errorMsg?: string;
  /** Helper text under the field (hidden while `errorMsg` is set). */
  hint?: string;
  /** `compact` 32px (toolbars and filters, no label), `small` 36px (forms) or `normal` 40px. */
  size?: "compact" | "small" | "normal";
  /** Text shown when no option matches the search. */
  noResultText?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props<V>>(), {
  label: "",
  placeholder: "Select…",
  multiple: false,
  searchable: false,
  clearable: false,
  loading: false,
  refreshable: false,
  disabled: false,
  required: false,
  errorMsg: "",
  hint: "",
  size: "small",
  noResultText: "No results",
});

const emit = defineEmits<{
  select: [option: SelectOption<V>];
  remove: [option: SelectOption<V>];
  search: [query: string];
  refresh: [];
}>();

defineSlots<{
  /** Custom option row. Receives the option and whether it's selected or highlighted. */
  option?: (props: { option: SelectOption<V>; selected: boolean; active: boolean }) => unknown;
  /** Content shown when the list is empty or nothing matches. */
  empty?: (props: { query: string }) => unknown;
}>();

const model = defineModel<V | V[] | null>({ default: null });

const id = useId();
const attrs = useAttrs();
// class and style stay on the wrapper for layout; everything else (autocomplete, aria-*, data-*) goes to the control.
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const listId = `${id}-list`;
const labelId = `${id}-label`;
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const open = ref(false);
const query = ref("");
const activeIndex = ref(-1);
const placement = ref<{ top?: number; bottom?: number; left: number; width: number; maxHeight: number }>({
  left: 0,
  width: 0,
  maxHeight: 280,
});

// ---- selection state
const selectedValues = computed<V[]>(() => {
  const v = model.value;
  if (v === null || v === undefined || v === ("" as unknown)) return [];
  return Array.isArray(v) ? v : [v];
});
const isSelected = (o: SelectOption<V>) => selectedValues.value.includes(o.value);
const selectedOptions = computed(() =>
  selectedValues.value.map((v) => props.options.find((o) => o.value === v) ?? ({ value: v, label: String(v) } as SelectOption<V>)),
);
const hasValue = computed(() => selectedValues.value.length > 0);

// ---- filtering and grouping
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter(
    (o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q) || o.group?.toLowerCase().includes(q),
  );
});
const groups = computed(() => {
  const out: { name: string; items: { option: SelectOption<V>; index: number }[] }[] = [];
  filtered.value.forEach((option, index) => {
    const name = option.group ?? "";
    let g = out.find((x) => x.name === name);
    if (!g) out.push((g = { name, items: [] }));
    g.items.push({ option, index });
  });
  return out;
});
const optionId = (i: number) => `${id}-opt-${i}`;

// ---- open / close and positioning
const place = () => {
  const el = trigger.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const gap = 6;
  const below = window.innerHeight - r.bottom - gap - 8;
  const above = r.top - gap - 8;
  const wanted = 300;
  const flip = below < Math.min(wanted, 180) && above > below;
  placement.value = flip
    ? { bottom: window.innerHeight - r.top + gap, left: r.left, width: r.width, maxHeight: Math.min(wanted, above) }
    : { top: r.bottom + gap, left: r.left, width: r.width, maxHeight: Math.min(wanted, below) };
};

const firstEnabled = (from = 0, step = 1) => {
  const list = filtered.value;
  for (let i = from; i >= 0 && i < list.length; i += step) if (!list[i]!.disabled) return i;
  return -1;
};

const openList = async () => {
  if (props.disabled || props.loading || open.value) return;
  open.value = true;
  query.value = "";
  place();
  const current = filtered.value.findIndex((o) => isSelected(o));
  activeIndex.value = current >= 0 ? current : firstEnabled();
  await nextTick();
  if (props.searchable) searchInput.value?.focus();
  scrollActiveIntoView();
};

const closeList = (refocus = true) => {
  if (!open.value) return;
  open.value = false;
  activeIndex.value = -1;
  if (refocus) trigger.value?.focus();
};

const toggle = () => (open.value ? closeList() : openList());

// ---- choosing
const choose = (o: SelectOption<V>) => {
  if (o.disabled) return;
  if (props.multiple) {
    const current = [...selectedValues.value];
    const i = current.indexOf(o.value);
    if (i >= 0) {
      current.splice(i, 1);
      emit("remove", o);
    } else {
      current.push(o.value);
      emit("select", o);
    }
    model.value = current;
  } else {
    model.value = o.value;
    emit("select", o);
    closeList();
  }
};

const removeValue = (o: SelectOption<V>) => {
  model.value = props.multiple ? selectedValues.value.filter((v) => v !== o.value) : null;
  emit("remove", o);
};

const clear = () => {
  selectedOptions.value.forEach((o) => emit("remove", o));
  model.value = props.multiple ? [] : null;
  trigger.value?.focus();
};

// ---- keyboard
let typeahead = "";
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

const scrollActiveIntoView = () =>
  nextTick(() => panel.value?.querySelector(`#${CSS.escape(optionId(activeIndex.value))}`)?.scrollIntoView({ block: "nearest" }));

const move = (step: number) => {
  const list = filtered.value;
  if (!list.length) return;
  let i = activeIndex.value;
  for (let n = 0; n < list.length; n++) {
    i = (i + step + list.length) % list.length;
    if (!list[i]!.disabled) break;
  }
  activeIndex.value = i;
  scrollActiveIntoView();
};

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return;
  const key = e.key;
  if (!open.value) {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(key)) {
      e.preventDefault();
      openList();
    } else if (key === "Backspace" && props.multiple && hasValue.value && e.target === trigger.value) {
      removeValue(selectedOptions.value[selectedOptions.value.length - 1]!);
    }
    return;
  }
  if (key === "ArrowDown") {
    e.preventDefault();
    move(1);
  } else if (key === "ArrowUp") {
    e.preventDefault();
    move(-1);
  } else if (key === "Home") {
    e.preventDefault();
    activeIndex.value = firstEnabled();
    scrollActiveIntoView();
  } else if (key === "End") {
    e.preventDefault();
    activeIndex.value = firstEnabled(filtered.value.length - 1, -1);
    scrollActiveIntoView();
  } else if (key === "Enter" || (key === " " && !props.searchable)) {
    e.preventDefault();
    const o = filtered.value[activeIndex.value];
    if (o) choose(o);
  } else if (key === "Escape") {
    e.preventDefault();
    closeList();
  } else if (key === "Tab") {
    closeList(false);
  } else if (!props.searchable && key.length === 1 && !e.metaKey && !e.ctrlKey) {
    // type-to-jump when there is no search box
    typeahead += key.toLowerCase();
    clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
    const i = filtered.value.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typeahead));
    if (i >= 0) {
      activeIndex.value = i;
      scrollActiveIntoView();
    }
  }
};

// ---- outside click, scroll and resize while open
const onPointerDown = (e: PointerEvent) => {
  const t = e.target as Node;
  if (root.value?.contains(t) || panel.value?.contains(t)) return;
  closeList(false);
};
const onViewportChange = (e?: Event) => {
  if (e && panel.value?.contains(e.target as Node)) return;
  place();
};

const unlisten = () => {
  document.removeEventListener("pointerdown", onPointerDown, true);
  window.removeEventListener("scroll", onViewportChange, true);
  window.removeEventListener("resize", onViewportChange);
};
watch(open, (v) => {
  if (!v) return unlisten();
  document.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("scroll", onViewportChange, true);
  window.addEventListener("resize", onViewportChange);
});
watch(query, (q) => {
  emit("search", q);
  activeIndex.value = firstEnabled();
});
onBeforeUnmount(unlisten);

const hoisted = computed(() => !!props.label && (hasValue.value || open.value));
const displayText = computed(() => (!props.multiple && selectedOptions.value[0]?.label) || "");

defineExpose({
  /** Moves focus to the select. */
  focus: () => trigger.value?.focus(),
});
</script>

<template>
  <div ref="root" v-bind="rootAttrs" class="w-full" :class="disabled && 'opacity-60'" data-testid="ac-select">
    <div class="relative">
      <div
        :id="`${id}-trigger`"
        ref="trigger"
        v-bind="controlAttrs"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-labelledby="label ? labelId : undefined"
        :aria-label="label ? undefined : placeholder"
        :aria-disabled="disabled || undefined"
        :aria-invalid="!!errorMsg || undefined"
        :aria-required="required || undefined"
        :aria-activedescendant="open && !searchable && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        class="group flex w-full items-center gap-2 rounded-6 border bg-surface pr-2 pl-3 text-left text-base text-heading shadow-xs transition-[border-color,box-shadow] duration-150 outline-none"
        :class="[
          size === 'compact' ? 'min-h-8' : size === 'small' ? 'min-h-9' : 'min-h-10',
          multiple && hasValue ? 'py-1.5' : '',
          label && hasValue && multiple ? 'pt-2.5' : '',
          disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer',
          errorMsg
            ? 'border-red-60'
            : open
              ? 'focus-ring'
              : 'border-border hover:border-border-dark focus-visible:focus-ring',
        ]"
        @click="toggle"
        @keydown="onKeydown"
      >
        <!-- value -->
        <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          <template v-if="multiple && hasValue">
            <span
              v-for="o in selectedOptions"
              :key="String(o.value)"
              class="inline-flex h-6 max-w-full items-center gap-1 rounded-4 bg-surface-sunken pr-0.5 pl-2 text-xs font-medium text-heading ring-1 ring-border ring-inset"
            >
              <span class="truncate">{{ o.label }}</span>
              <button
                type="button"
                class="inline-flex size-4.5 cursor-pointer items-center justify-center rounded-2 text-muted transition hover:bg-slate-80 hover:text-heading"
                :aria-label="`Remove ${o.label}`"
                :disabled="disabled"
                @click.stop="removeValue(o)"
              >
                <X class="size-2.5" :stroke-width="2.5" aria-hidden="true" />
              </button>
            </span>
          </template>
          <span v-else-if="displayText" class="truncate">{{ displayText }}</span>
          <span v-else-if="!label" class="truncate text-muted">{{ placeholder }}</span>
        </div>

        <!-- controls -->
        <span class="flex shrink-0 items-center gap-0.5 text-muted">
          <AcSpinner v-if="loading" class="text-primary" />
          <button
            v-else-if="refreshable"
            type="button"
            class="inline-flex size-6 cursor-pointer items-center justify-center rounded-4 transition hover:bg-surface-sunken hover:text-heading"
            aria-label="Refresh options"
            :disabled="disabled"
            @click.stop="emit('refresh')"
          >
            <RefreshCw class="size-3.5" aria-hidden="true" />
          </button>
          <button
            v-if="clearable && hasValue && !disabled && !loading"
            type="button"
            class="inline-flex size-6 cursor-pointer items-center justify-center rounded-4 transition hover:bg-surface-sunken hover:text-heading"
            aria-label="Clear selection"
            @click.stop="clear"
          >
            <X class="size-3.5" aria-hidden="true" />
          </button>
          <ChevronDown class="size-4 transition-transform duration-200" :class="open && 'rotate-180 text-heading'" aria-hidden="true" />
        </span>
      </div>

      <!-- floating label -->
      <label
        v-if="label"
        :id="labelId"
        :for="`${id}-trigger`"
        class="pointer-events-none absolute left-2.5 rounded-2 bg-surface px-1 transition-all duration-150 ease-out"
        :class="[
          hoisted ? 'top-0 -translate-y-1/2 text-xs font-medium' : 'top-1/2 -translate-y-1/2 text-base text-muted',
          hoisted && (errorMsg ? 'text-red-30' : open ? 'text-primary-20' : 'text-label'),
        ]"
      >
        {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      </label>
    </div>

    <p v-if="errorMsg" class="mt-1.5 flex items-center gap-1 text-xs text-red-30">
      <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
      {{ errorMsg }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-muted">{{ hint }}</p>

    <!-- list, attached to <body> so modals and scroll containers don't clip it -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          ref="panel"
          class="fixed z-[90] flex flex-col overflow-hidden rounded-8 border border-border bg-surface shadow-lg"
          :style="{
            top: placement.top !== undefined ? `${placement.top}px` : undefined,
            bottom: placement.bottom !== undefined ? `${placement.bottom}px` : undefined,
            left: `${placement.left}px`,
            width: `${placement.width}px`,
            maxHeight: `${placement.maxHeight}px`,
          }"
        >
          <div v-if="searchable" class="border-b border-border-light p-1.5">
            <div class="relative">
              <Search class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                placeholder="Search…"
                aria-label="Search options"
                :aria-controls="listId"
                :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
                class="h-8 w-full rounded-4 bg-surface-muted pr-2 pl-8 text-base text-heading outline-none placeholder:text-muted focus:bg-surface focus:ring-1 focus:ring-border"
                @keydown="onKeydown"
              />
            </div>
          </div>
          <ul
            :id="listId"
            role="listbox"
            :aria-multiselectable="multiple || undefined"
            :aria-labelledby="label ? labelId : undefined"
            class="ac-scrollbar min-h-0 flex-1 p-1"
          >
            <template v-for="g in groups" :key="g.name">
              <li
                v-if="g.name"
                role="presentation"
                class="px-2.5 pt-2.5 pb-1 text-[11px] font-medium tracking-wide text-muted uppercase first:pt-1.5"
              >
                {{ g.name }}
              </li>
              <li
                v-for="{ option, index } in g.items"
                :id="optionId(index)"
                :key="String(option.value)"
                role="option"
                :aria-selected="isSelected(option)"
                :aria-disabled="option.disabled || undefined"
                class="flex cursor-pointer items-start gap-2.5 rounded-6 px-2.5 py-1.5 text-base transition-colors duration-75"
                :class="[
                  option.disabled ? 'cursor-not-allowed opacity-40' : '',
                  index === activeIndex ? 'bg-surface-muted text-heading' : 'text-heading',
                ]"
                @mouseenter="!option.disabled && (activeIndex = index)"
                @mousedown.prevent
                @click="choose(option)"
              >
                <span
                  v-if="multiple"
                  class="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-4 border transition-colors"
                  :class="isSelected(option) ? 'border-primary bg-primary text-white shadow-button' : 'border-border-dark bg-surface'"
                  aria-hidden="true"
                >
                  <Check v-if="isSelected(option)" class="size-3" :stroke-width="3" aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1">
                  <slot name="option" :option="option" :selected="isSelected(option)" :active="index === activeIndex">
                    <span class="block truncate" :class="isSelected(option) && 'font-medium'">{{ option.label }}</span>
                    <span v-if="option.description" class="block truncate text-xs text-muted">{{ option.description }}</span>
                  </slot>
                </span>
                <Check v-if="!multiple && isSelected(option)" class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              </li>
            </template>
            <li v-if="!filtered.length" role="presentation" class="px-3 py-6 text-center text-base text-muted">
              <slot name="empty" :query="query">{{ query ? `${noResultText} for “${query}”` : "No options" }}</slot>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
