<script setup lang="ts">
import { computed, ref, useId } from "vue";

export interface Props {
  /** Floating label. It rests inside the field and rises on focus or when filled. */
  label: string;
  /** Native `name` attribute. */
  name?: string;
  /** Native input type. `password` adds a show/hide toggle. */
  type?: "text" | "password" | "email" | "number" | "url" | "search";
  /** Marks the field required and adds a red asterisk. */
  required?: boolean;
  /** Disables the field. */
  disabled?: boolean;
  /** Read-only field with a gray background. */
  readonly?: boolean;
  /** Error text under the field. Turns the border and label red and sets `aria-invalid`. */
  errorMsg?: string;
  /** Helper text under the field (hidden while `errorMsg` is set). */
  hint?: string;
  /** `small` 36px or `normal` 40px tall. */
  size?: "small" | "normal";
}

const props = withDefaults(defineProps<Props>(), {
  name: "",
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  errorMsg: "",
  hint: "",
  size: "small",
});

const model = defineModel<string | number>({ default: "" });
const id = useId();
const showValue = ref(false);
const inputType = computed(() => (props.type === "password" && showValue.value ? "text" : props.type));
const describedBy = computed(() => (props.errorMsg || props.hint ? `${id}-msg` : undefined));
</script>

<template>
  <div class="w-full" :class="disabled && 'opacity-60'" data-testid="ac-input">
    <div class="relative">
      <!-- placeholder=" " lets the label float with :placeholder-shown, like .ac-label.show-label -->
      <input
        :id="id"
        v-model="model"
        :name="name"
        :type="inputType"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="!!errorMsg || undefined"
        :aria-describedby="describedBy"
        placeholder=" "
        class="peer block w-full rounded-6 border bg-white px-3 text-base text-heading shadow-xs transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-transparent disabled:cursor-not-allowed disabled:bg-surface-muted read-only:bg-surface-muted read-only:shadow-none"
        :class="[
          size === 'small' ? 'h-9' : 'h-10',
          type === 'password' && 'pr-9',
          errorMsg
            ? 'border-red-60 focus:border-danger focus:shadow-[0_0_0_3px_var(--color-red-90)]'
            : 'border-border hover:border-border-dark focus:focus-ring',
        ]"
      />
      <label
        :for="id"
        class="pointer-events-none absolute top-0 left-2.5 -translate-y-1/2 rounded-2 bg-white px-1 text-xs font-medium text-label transition-all duration-150 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-muted peer-focus:top-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-primary-20 peer-read-only:bg-linear-to-b peer-read-only:from-white peer-read-only:from-50% peer-read-only:to-surface-muted peer-read-only:to-50% peer-disabled:bg-linear-to-b peer-disabled:from-white peer-disabled:from-50% peer-disabled:to-surface-muted peer-disabled:to-50%"
        :class="errorMsg && 'text-red-30! peer-focus:text-red-30!'"
      >
        {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      </label>
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute top-1/2 right-1.5 inline-flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading"
        :aria-label="showValue ? 'Hide value' : 'Show value'"
        @click="showValue = !showValue"
      >
        <svg class="size-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" />
          <circle cx="10" cy="10" r="2.5" />
          <path v-if="showValue" d="M3 17 17 3" />
        </svg>
      </button>
    </div>
    <p v-if="errorMsg" :id="`${id}-msg`" class="mt-1.5 flex items-center gap-1 text-xs text-red-30">
      <svg class="size-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0-10a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 5Zm0 6.5a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" clip-rule="evenodd" />
      </svg>
      {{ errorMsg }}
    </p>
    <p v-else-if="hint" :id="`${id}-msg`" class="mt-1.5 text-xs text-muted">{{ hint }}</p>
  </div>
</template>
