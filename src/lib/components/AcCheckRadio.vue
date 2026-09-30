<script setup lang="ts" generic="T">
import { useId } from "vue";
import type { Option } from "./types";

export interface Props<V> {
  /** The radios to render: `{ value, label, description?, disabled? }`. */
  options: Option<V>[];
  /** Base `name` for the radio group. */
  name?: string;
  /** Lays the options out horizontally. */
  row?: boolean;
  /** Card style with each option's description, like the source's hasDescription. */
  cards?: boolean;
  /** Error text under the group. */
  errorMsg?: string;
}

withDefaults(defineProps<Props<T>>(), { name: "radio", row: false, cards: false, errorMsg: "" });

const model = defineModel<T>();
const id = useId();
</script>

<template>
  <div role="radiogroup" data-testid="ac-check-radio">
    <div :class="cards ? 'grid gap-3 sm:grid-cols-2' : row ? 'flex flex-row flex-wrap gap-x-6 gap-y-2' : 'flex flex-col gap-2.5'">
      <label
        v-for="(option, i) in options"
        :key="option.label"
        :for="`${id}-${i}`"
        class="group flex cursor-pointer gap-2.5 text-base text-heading"
        :class="[
          option.disabled && 'cursor-not-allowed opacity-50',
          cards &&
            'rounded-10 border border-border bg-white p-4 shadow-xs transition-[border-color,box-shadow,background-color] duration-150 hover:border-border-dark has-checked:border-primary has-checked:bg-primary-97/60 has-checked:shadow-[0_0_0_1px_var(--color-primary)] has-focus-visible:shadow-[0_0_0_3px_var(--color-ring)]',
        ]"
      >
        <input
          :id="`${id}-${i}`"
          v-model="model"
          type="radio"
          :name="`${name}-${id}`"
          :value="option.value"
          :disabled="option.disabled"
          class="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-border-dark bg-white shadow-xs transition-[border-color,border-width] duration-150 group-hover:border-slate-60 checked:border-[5px] checked:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed"
        />
        <span class="flex flex-col">
          <span :class="cards && 'font-medium'">{{ option.label }}</span>
          <span v-if="cards && option.description" class="mt-0.5 line-clamp-2 text-xs text-muted" :title="option.description">
            {{ option.description }}
          </span>
        </span>
      </label>
    </div>
    <p v-if="errorMsg" class="mt-2 text-xs text-red-30">{{ errorMsg }}</p>
  </div>
</template>
