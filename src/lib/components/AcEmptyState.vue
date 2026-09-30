<script setup lang="ts">
import { computed } from "vue";
import { Inbox, SearchX, TriangleAlert } from "lucide-vue-next";
import type { Component } from "vue";

export interface Props {
  /** `empty` for a list with nothing in it yet, `search` for a filter or search with no matches, `error` when loading failed. Sets the default icon and title. */
  variant?: "empty" | "search" | "error";
  /** Heading. Defaults to "Nothing here yet", "No results found" or "Something went wrong". */
  title?: string;
  /** A sentence under the title: why it's empty and what to do next. */
  description?: string;
  /** With `variant="search"`, the search text, shown as `No results for “pg-prod”`. */
  query?: string;
  /** A Lucide icon component to replace the variant's default icon. */
  icon?: Component;
  /** `small` for inside a table or card, `normal` for a list area, `large` for a whole page. */
  size?: "small" | "normal" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "empty",
  title: "",
  description: "",
  query: "",
  icon: undefined,
  size: "normal",
});

defineSlots<{
  /** Replaces the icon, e.g. with an illustration. */
  icon?: () => unknown;
  /** Replaces the description, e.g. to add a docs link. */
  default?: () => unknown;
  /** Buttons under the text: the main next step, then a secondary one. */
  actions?: () => unknown;
}>();

const VARIANTS = {
  empty: { glyph: Inbox, title: "Nothing here yet", tile: "border-border bg-surface-muted text-muted" },
  search: { glyph: SearchX, title: "No results found", tile: "border-border bg-surface-muted text-muted" },
  error: { glyph: TriangleAlert, title: "Something went wrong", tile: "border-red-90 bg-red-97 text-red-40" },
} as const;

const SIZES = {
  small: { root: "py-6 gap-3", tile: "size-9 rounded-8 [&_svg]:size-4", title: "text-lg leading-6", text: "text-base max-w-80" },
  normal: { root: "py-12 gap-4", tile: "size-11 rounded-10 [&_svg]:size-5", title: "text-xl leading-6", text: "text-base max-w-100" },
  large: { root: "py-20 gap-5", tile: "size-14 rounded-12 [&_svg]:size-6", title: "text-2xl leading-7", text: "text-lg max-w-120" },
} as const;

const config = computed(() => VARIANTS[props.variant]);
const sizing = computed(() => SIZES[props.size]);
const glyph = computed(() => props.icon ?? config.value.glyph);
const heading = computed(() => {
  if (props.title) return props.title;
  if (props.variant === "search" && props.query) return `No results for “${props.query}”`;
  return config.value.title;
});
</script>

<template>
  <div
    class="flex flex-col items-center px-4 text-center"
    :class="sizing.root"
    :role="variant === 'error' ? 'alert' : undefined"
    data-testid="ac-empty-state"
  >
    <slot name="icon">
      <span class="inline-flex shrink-0 items-center justify-center border shadow-xs" :class="[config.tile, sizing.tile]" aria-hidden="true">
        <component :is="glyph" />
      </span>
    </slot>
    <div class="flex flex-col items-center gap-1">
      <p class="font-semibold tracking-[-0.01em] text-balance text-heading" :class="sizing.title">{{ heading }}</p>
      <div v-if="description || $slots.default" class="text-pretty text-muted [&_a]:font-medium [&_a]:text-primary-20 [&_a]:underline [&_a]:underline-offset-2" :class="sizing.text">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <div v-if="$slots.actions" class="mt-1 flex flex-wrap items-center justify-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
