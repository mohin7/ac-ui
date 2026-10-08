<script setup lang="ts" generic="V extends string | number">
import { computed, ref } from "vue";
import type { Component } from "vue";

export interface SegmentedOption<T extends string | number = string> {
  value: T;
  label: string;
  /** A Lucide (or any) icon component shown before the label. */
  icon?: Component;
  disabled?: boolean;
}

export interface Props<T extends string | number> {
  /** The choices, 2–5 of them: `{ value, label, icon?, disabled? }`. Plain strings are accepted too. */
  options: (SegmentedOption<T> | T)[];
  /** Accessible name for the group, e.g. "Chart range". Required when nothing nearby labels it. */
  label?: string;
  /** Height: `small` 28px (toolbars, cards) or `normal` 32px. */
  size?: "small" | "normal";
  /** Shows only the icons; each option's `label` becomes its accessible name and hover title. */
  iconOnly?: boolean;
  /** Stretches to fill the row with equal-width segments. */
  block?: boolean;
  /** Disables every segment. */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props<V>>(), {
  label: "",
  size: "normal",
  iconOnly: false,
  block: false,
  disabled: false,
});

/** The selected option's `value`. */
const model = defineModel<V | null>({ default: null });

const emit = defineEmits<{
  /** Fires when the viewer picks a different segment. */
  change: [value: V];
}>();

const buttons = ref<HTMLButtonElement[]>([]);

const items = computed<SegmentedOption<V>[]>(() =>
  props.options.map((o) => (typeof o === "object" ? o : { value: o, label: String(o) })),
);
// The segment that takes Tab focus: the selected one, or the first enabled one when nothing is selected.
const tabStop = computed(() => {
  const selected = items.value.findIndex((o) => o.value === model.value && !o.disabled);
  return selected >= 0 ? selected : items.value.findIndex((o) => !o.disabled);
});

function select(option: SegmentedOption<V>) {
  if (props.disabled || option.disabled || option.value === model.value) return;
  model.value = option.value;
  emit("change", option.value);
}

function focusAndSelect(index: number) {
  const option = items.value[index];
  if (!option) return;
  buttons.value[index]?.focus();
  select(option);
}

function step(from: number, delta: number) {
  const count = items.value.length;
  let i = from;
  for (let n = 0; n < count; n++) {
    i = (i + delta + count) % count;
    if (!items.value[i]!.disabled) return i;
  }
  return from;
}

function onKeydown(e: KeyboardEvent, index: number) {
  const keys: Record<string, () => number> = {
    ArrowRight: () => step(index, 1),
    ArrowDown: () => step(index, 1),
    ArrowLeft: () => step(index, -1),
    ArrowUp: () => step(index, -1),
    Home: () => step(-1, 1),
    End: () => step(items.value.length, -1),
  };
  const next = keys[e.key];
  if (!next) return;
  e.preventDefault();
  focusAndSelect(next());
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label || undefined"
    :aria-disabled="disabled || undefined"
    class="items-center gap-0.5 rounded-8 border border-border bg-surface-muted p-0.5"
    :class="[block ? 'flex w-full' : 'inline-flex max-w-full', disabled && 'opacity-50']"
    data-ac-ds
    data-testid="ac-segmented-control"
  >
    <button
      v-for="(option, index) in items"
      :key="String(option.value)"
      ref="buttons"
      type="button"
      role="radio"
      :aria-checked="option.value === model"
      :aria-label="iconOnly ? option.label : undefined"
      :title="iconOnly ? option.label : undefined"
      :tabindex="index === tabStop ? 0 : -1"
      :disabled="disabled || option.disabled"
      class="inline-flex min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-6 font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed"
      :class="[
        size === 'small' ? 'h-6 text-xs [&_svg]:size-3.5' : 'h-7 text-base [&_svg]:size-4',
        iconOnly ? (size === 'small' ? 'w-7' : 'w-8') : size === 'small' ? 'px-2.5' : 'px-3',
        block && 'flex-1',
        option.disabled && !disabled && 'opacity-50',
        option.value === model
          ? 'bg-surface text-heading shadow-sm ring-1 ring-border'
          : 'text-muted enabled:hover:text-heading',
      ]"
      @click="select(option)"
      @keydown="onKeydown($event, index)"
    >
      <component :is="option.icon" v-if="option.icon" class="shrink-0" aria-hidden="true" />
      <span v-if="!iconOnly" class="truncate">{{ option.label }}</span>
    </button>
  </div>
</template>
