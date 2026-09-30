<script setup lang="ts">
import { computed, provide, ref } from "vue";

export interface Props {
  /** Lets several items be open at once. `v-model` becomes an array of values. */
  multiple?: boolean;
  /** `bordered` one card with dividers, `separated` a card per item, `flush` dividers only, for use inside a card or form. */
  variant?: "bordered" | "separated" | "flush";
  /** Heading level of each item's title, so the outline fits the page. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  variant: "bordered",
  headingLevel: 3,
});

/** The open item's `value` (or an array of values with `multiple`). `null` when all are closed. */
const model = defineModel<string | string[] | null>({ default: null });

defineSlots<{
  /** AcAccordionItem children. */
  default?: () => unknown;
}>();

const root = ref<HTMLElement | null>(null);

const openValues = computed<string[]>(() => {
  const v = model.value;
  if (v === null || v === undefined || v === "") return [];
  return Array.isArray(v) ? v : [v];
});

function isOpen(value: string) {
  return openValues.value.includes(value);
}

function toggle(value: string) {
  const open = isOpen(value);
  if (props.multiple) model.value = open ? openValues.value.filter((v) => v !== value) : [...openValues.value, value];
  else model.value = open ? null : value;
}

// WAI-ARIA accordion: ↑ ↓ Home End move between headers.
function onKeydown(e: KeyboardEvent) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
  const target = e.target as HTMLElement;
  if (!target.matches("[data-accordion-trigger]")) return;
  // Only this accordion's own headers, not a nested one's.
  const triggers = [...(root.value?.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]") ?? [])].filter(
    (el) => el.closest("[data-testid='ac-accordion']") === root.value && !el.disabled,
  );
  const i = triggers.indexOf(target as HTMLButtonElement);
  if (i < 0) return;
  e.preventDefault();
  const next =
    e.key === "Home" ? 0 : e.key === "End" ? triggers.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + triggers.length) % triggers.length;
  triggers[next]?.focus();
}

provide("ac-accordion", {
  isOpen,
  toggle,
  variant: computed(() => props.variant),
  headingLevel: computed(() => props.headingLevel),
});
</script>

<template>
  <div
    ref="root"
    class="w-full"
    :class="{
      'divide-y divide-border-light overflow-hidden rounded-10 border border-border bg-surface shadow-xs': variant === 'bordered',
      'flex flex-col gap-3': variant === 'separated',
      'divide-y divide-border-light border-y border-border-light': variant === 'flush',
    }"
    data-testid="ac-accordion"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
