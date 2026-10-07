<script setup lang="ts" generic="T">
import { useId } from "vue";
import { Check } from "@lucide/vue";
import type { Option } from "./types";

export interface Props<V> {
  /** The checkboxes to render: `{ value, label, disabled? }`. */
  options: Option<V>[];
  /** Native `name` shared by every checkbox. */
  name?: string;
  /** Error text under the group. */
  errorMsg?: string;
}

withDefaults(defineProps<Props<T>>(), { name: "checkbox", errorMsg: "" });

const model = defineModel<T[]>({ default: () => [] });
const id = useId();
</script>

<template>
  <div class="flex flex-col gap-2.5" data-ac-ds data-testid="ac-checkbox">
    <label
      v-for="(option, i) in options"
      :key="option.label"
      :for="`${id}-${i}`"
      class="group inline-flex w-fit cursor-pointer items-center gap-2.5 text-base text-heading"
      :class="option.disabled && 'cursor-not-allowed opacity-50'"
    >
      <span class="relative inline-flex size-4 shrink-0">
        <input
          :id="`${id}-${i}`"
          v-model="model"
          type="checkbox"
          :name="name"
          :value="option.value"
          :disabled="option.disabled"
          class="peer size-4 cursor-pointer appearance-none rounded-4 border border-border-dark bg-surface shadow-xs transition-[background-color,border-color,box-shadow] duration-150 group-hover:border-slate-60 checked:border-primary checked:bg-primary checked:shadow-button focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed"
        />
        <Check
          class="pointer-events-none absolute inset-0 m-auto size-3 scale-75 text-white opacity-0 transition duration-150 peer-checked:scale-100 peer-checked:opacity-100"
          :stroke-width="3"
          aria-hidden="true"
        />
      </span>
      <span>{{ option.label }}</span>
    </label>
    <p v-if="errorMsg" class="text-xs text-red-30">{{ errorMsg }}</p>
  </div>
</template>
