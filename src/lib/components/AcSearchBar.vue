<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { ChevronDown, Search, X } from "@lucide/vue";

export interface SearchFilterOption {
  value: string | number;
  label: string;
}

export interface Props {
  /** Placeholder text. */
  placeholder?: string;
  /** Milliseconds to wait after typing before emitting `search`. `0` emits on every key. */
  debounce?: number;
  /** `small` 32px or `normal` 36px tall. */
  size?: "small" | "normal";
  /** Options for a filter select attached to the right of the field, such as cluster status. Bind the choice with `v-model:filter`. No options, no filter. */
  filterOptions?: SearchFilterOption[];
  /** Accessible name of the filter select. */
  filterLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search",
  debounce: 300,
  size: "small",
  filterOptions: () => [],
  filterLabel: "Filter",
});

/** The search text. */
const model = defineModel<string>({ default: "" });
/** The selected filter value. Starts at the first option when unset. */
const filter = defineModel<string | number | undefined>("filter", { default: undefined });

const emit = defineEmits<{ search: [value: string] }>();

const input = ref<HTMLInputElement | null>(null);

const hasFilter = computed(() => props.filterOptions.length > 0);
const height = computed(() => (props.size === "small" ? "h-8" : "h-9"));

let timer: ReturnType<typeof setTimeout> | undefined;

function clear() {
  model.value = "";
  input.value?.focus();
}

watch(model, (v) => {
  clearTimeout(timer);
  if (!props.debounce) emit("search", v);
  else timer = setTimeout(() => emit("search", v), props.debounce);
});

watch(
  () => props.filterOptions,
  (options) => {
    if (options.length && !options.some((o) => o.value === filter.value)) filter.value = options[0]!.value;
  },
  { immediate: true },
);

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="flex w-full" data-ac-ds data-testid="ac-search-bar">
    <div class="relative min-w-0 flex-1">
      <Search class="pointer-events-none absolute top-1/2 left-2.5 z-20 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        ref="input"
        v-model="model"
        type="search"
        :placeholder="placeholder"
        :aria-label="placeholder"
        class="relative block w-full border border-border bg-surface pr-8 pl-8 text-base text-heading shadow-xs transition-[border-color,box-shadow] outline-none placeholder:text-muted hover:border-border-dark focus:z-10 focus:focus-ring [&::-webkit-search-cancel-button]:hidden"
        :class="[height, hasFilter ? 'rounded-l-6' : 'rounded-6']"
        @keydown.esc="model && (clear(), $event.stopPropagation())"
      />
      <button
        v-if="model"
        type="button"
        class="absolute top-1/2 right-1.5 z-20 inline-flex size-5.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading"
        aria-label="Clear search"
        @click="clear"
      >
        <X class="size-3" aria-hidden="true" />
      </button>
    </div>
    <div v-if="hasFilter" class="relative -ml-px shrink-0">
      <select
        v-model="filter"
        :aria-label="filterLabel"
        class="relative block max-w-48 cursor-pointer appearance-none truncate rounded-r-6 border border-border bg-surface-muted pr-8 pl-3 text-base font-medium text-heading shadow-xs transition-[border-color,box-shadow,background-color] outline-none hover:border-border-dark hover:bg-surface-sunken focus:z-10 focus:focus-ring"
        :class="height"
        data-ac-ds
        data-testid="ac-search-bar-filter"
      >
        <option v-for="option in filterOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <ChevronDown class="pointer-events-none absolute top-1/2 right-2.5 z-20 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
    </div>
  </div>
</template>
