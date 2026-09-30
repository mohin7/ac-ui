<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

export interface Props {
  /** Placeholder text. */
  placeholder?: string;
  /** Milliseconds to wait after typing before emitting `search`. `0` emits on every key. */
  debounce?: number;
  /** `small` 32px or `normal` 36px tall. */
  size?: "small" | "normal";
}

const props = withDefaults(defineProps<Props>(), { placeholder: "Search", debounce: 300, size: "small" });
const emit = defineEmits<{ search: [value: string] }>();

/** The search text. */
const model = defineModel<string>({ default: "" });
const input = ref<HTMLInputElement | null>(null);

let timer: ReturnType<typeof setTimeout> | undefined;
watch(model, (v) => {
  clearTimeout(timer);
  if (!props.debounce) emit("search", v);
  else timer = setTimeout(() => emit("search", v), props.debounce);
});
onBeforeUnmount(() => clearTimeout(timer));

const clear = () => {
  model.value = "";
  input.value?.focus();
};
</script>

<template>
  <div class="relative w-full" data-testid="ac-search-bar">
    <svg
      class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" />
    </svg>
    <input
      ref="input"
      v-model="model"
      type="search"
      :placeholder="placeholder"
      :aria-label="placeholder"
      class="block w-full rounded-6 border border-border bg-white pr-8 pl-8 text-base text-heading shadow-xs transition-[border-color,box-shadow] outline-none placeholder:text-muted hover:border-border-dark focus:focus-ring [&::-webkit-search-cancel-button]:hidden"
      :class="size === 'small' ? 'h-8' : 'h-9'"
      @keydown.esc="model && (clear(), $event.stopPropagation())"
    />
    <button
      v-if="model"
      type="button"
      class="absolute top-1/2 right-1.5 inline-flex size-5.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading"
      aria-label="Clear search"
      @click="clear"
    >
      <svg class="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <path d="M3 3l6 6M9 3 3 9" />
      </svg>
    </button>
  </div>
</template>
