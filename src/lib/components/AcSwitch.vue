<script setup lang="ts">
import { computed, ref, useAttrs, useId } from "vue";

export interface Props {
  /** Label shown to the left of the switch. */
  label?: string;
  /** Native `name` attribute. */
  name?: string;
  /** Disables the switch. */
  disabled?: boolean;
  /** Error text under the switch. */
  errorMsg?: string;
}

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<Props>(), { label: "", name: "", disabled: false, errorMsg: "" });

defineSlots<{
  /** Content before the label. */
  left?: () => unknown;
  /** Content between the label and the switch, e.g. an info icon. */
  middle?: () => unknown;
  /** Content after the switch, e.g. a status badge. */
  right?: () => unknown;
}>();

const model = defineModel<boolean>({ default: false });
const id = useId();
const attrs = useAttrs();
// class and style stay on the wrapper for layout; everything else (autocomplete, aria-*, data-*) goes to the control.
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const button = ref<HTMLButtonElement | null>(null);

defineExpose({
  /** Moves focus to the switch. */
  focus: () => button.value?.focus(),
});
</script>

<template>
  <div v-bind="rootAttrs" data-ac-ds data-testid="ac-switch">
    <div class="flex items-center gap-2">
      <slot name="left" />
      <label v-if="label" :for="id" class="cursor-pointer text-base text-heading">{{ label }}</label>
      <slot name="middle" />
      <button
        :id="id"
        ref="button"
        v-bind="controlAttrs"
        type="button"
        role="switch"
        :name="name"
        :aria-checked="model"
        :disabled="disabled"
        class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-50 p-0.5 inset-shadow-xs transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        :class="model ? 'bg-primary' : 'bg-slate-70 hover:bg-slate-60'"
        @click="model = !model"
      >
        <span
          class="inline-block size-4 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-200 ease-out-soft"
          :class="model ? 'translate-x-4' : 'translate-x-0'"
        />
      </button>
      <slot name="right" />
    </div>
    <p v-if="errorMsg" class="mt-1.5 text-xs text-red-30">{{ errorMsg }}</p>
  </div>
</template>
