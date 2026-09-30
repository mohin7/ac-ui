<script setup lang="ts">
import { computed, inject, useId } from "vue";
import type { ComputedRef } from "vue";

export interface Props {
  /** Heading of the group, e.g. "Schedule" or "Retention". */
  title?: string;
  /** A line or two under the title explaining the group. */
  description?: string;
  /** `stacked` puts the title above the fields; `aside` puts it in a left column from 768px up. Defaults to the AcForm's `layout`. */
  layout?: "stacked" | "aside";
  /** Lays the fields out in two columns from 640px up. Use `class="sm:col-span-2"` on a field to span both. */
  columns?: 1 | 2;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  layout: undefined,
  columns: 1,
});

defineSlots<{
  /** The fields. They're spaced 20px apart. */
  default?: () => unknown;
  /** Replaces the description, e.g. to add a docs link. */
  description?: () => unknown;
  /** Content at the right of the title, e.g. a "Reset to defaults" button. Only in the `stacked` layout. */
  actions?: () => unknown;
}>();

const form = inject<{ layout: ComputedRef<"stacked" | "aside"> } | null>("ac-form", null);

const id = useId();

const resolvedLayout = computed(() => props.layout ?? form?.layout.value ?? "stacked");
</script>

<template>
  <div
    role="group"
    :aria-labelledby="title ? `${id}-title` : undefined"
    :aria-describedby="description || $slots.description ? `${id}-desc` : undefined"
    class="border-t border-border-light py-7 first:border-t-0 first:pt-0"
    :class="resolvedLayout === 'aside' && 'md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10'"
    data-testid="ac-form-section"
  >
    <div v-if="title || description || $slots.description || $slots.actions" class="mb-5 flex items-start gap-4" :class="resolvedLayout === 'aside' && 'md:mb-0'">
      <div class="min-w-0 flex-1">
        <h3 v-if="title" :id="`${id}-title`" class="text-xl leading-6 font-semibold tracking-[-0.01em] text-heading">{{ title }}</h3>
        <div v-if="description || $slots.description" :id="`${id}-desc`" class="mt-1 text-base text-muted [&_a]:font-medium [&_a]:text-primary-20 [&_a]:underline [&_a]:underline-offset-2">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
      <div v-if="$slots.actions && resolvedLayout === 'stacked'" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div class="grid min-w-0 gap-5" :class="[columns === 2 && 'sm:grid-cols-2', resolvedLayout === 'aside' && 'md:col-start-2']">
      <slot />
    </div>
  </div>
</template>
