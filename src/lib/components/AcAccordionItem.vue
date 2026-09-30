<script setup lang="ts">
import { computed, inject, useId, watch } from "vue";
import { ChevronDown } from "lucide-vue-next";
import type { ComputedRef } from "vue";

interface AccordionContext {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  variant: ComputedRef<"bordered" | "separated" | "flush">;
  headingLevel: ComputedRef<2 | 3 | 4 | 5 | 6>;
}

export interface Props {
  /** Identifies the item in the parent AcAccordion's `v-model`. Generated when left out. */
  value?: string;
  /** Header text. The `title` slot overrides it. */
  title?: string;
  /** A muted line under the title, e.g. a summary of the settings inside ("3 replicas · 10 GiB"). */
  description?: string;
  /** The item can't be opened or closed. */
  disabled?: boolean;
  /** Heading level of the title. Defaults to the parent AcAccordion's, or 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  title: "",
  description: "",
  disabled: false,
  headingLevel: undefined,
});

/** Whether the item is open. Use `v-model:open` for a single item outside an AcAccordion. */
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  /** The header was clicked, with the new open state. */
  toggle: [open: boolean];
}>();

defineSlots<{
  /** The panel content, shown when open. */
  default?: () => unknown;
  /** Replaces the `title` text. Keep it to text and inline badges; it sits inside the header button. */
  title?: () => unknown;
  /** Replaces the `description` text. */
  description?: () => unknown;
  /** A 16px icon before the title. */
  icon?: () => unknown;
}>();

const accordion = inject<AccordionContext | null>("ac-accordion", null);

const id = useId();

const key = computed(() => props.value ?? id);
const isOpen = computed(() => (accordion ? accordion.isOpen(key.value) : open.value));
const level = computed(() => props.headingLevel ?? accordion?.headingLevel.value ?? 3);
const variant = computed(() => accordion?.variant.value ?? "separated");

function onClick() {
  if (props.disabled) return;
  const next = !isOpen.value;
  if (accordion) accordion.toggle(key.value);
  else open.value = next;
  emit("toggle", next);
}

watch(isOpen, (v) => {
  if (accordion) open.value = v;
});
</script>

<template>
  <div
    :class="variant === 'separated' && 'overflow-hidden rounded-10 border border-border bg-surface shadow-xs'"
    data-testid="ac-accordion-item"
  >
    <component :is="`h${level}`" class="m-0 text-base leading-5 font-normal tracking-normal">
      <button
        :id="`${id}-trigger`"
        type="button"
        data-accordion-trigger
        :aria-expanded="isOpen"
        :aria-controls="`${id}-panel`"
        :disabled="disabled"
        class="flex w-full cursor-pointer items-center gap-3 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50"
        :class="[variant === 'flush' ? 'px-1' : 'px-4', !disabled && 'hover:bg-surface-muted']"
        @click="onClick"
      >
        <span v-if="$slots.icon" class="inline-flex shrink-0 text-muted [&_svg]:size-4" aria-hidden="true"><slot name="icon" /></span>
        <span class="min-w-0 flex-1">
          <span class="block text-lg leading-6 font-medium text-heading"><slot name="title">{{ title }}</slot></span>
          <span v-if="description || $slots.description" class="mt-0.5 block text-xs text-muted">
            <slot name="description">{{ description }}</slot>
          </span>
        </span>
        <ChevronDown
          class="size-4 shrink-0 text-muted transition-transform duration-200 ease-out-soft motion-reduce:transition-none"
          :class="isOpen && 'rotate-180 text-heading'"
          aria-hidden="true"
        />
      </button>
    </component>
    <!-- Animating grid rows from 0fr to 1fr gives a smooth height change without measuring. -->
    <div
      class="grid transition-[grid-template-rows] duration-200 ease-out-soft motion-reduce:transition-none"
      :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div
        :id="`${id}-panel`"
        role="region"
        :aria-labelledby="`${id}-trigger`"
        :inert="!isOpen || undefined"
        class="min-h-0 overflow-hidden"
      >
        <div class="pt-1 pb-4 text-base text-body" :class="variant === 'flush' ? 'px-1' : 'px-4'">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
