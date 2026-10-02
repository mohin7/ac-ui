<script setup lang="ts">
import { computed, ref, useAttrs, useId, useSlots } from "vue";
import { CircleAlert, Eye, EyeOff } from "lucide-vue-next";
import type { Component } from "vue";

export interface Props {
  /** Floating label. It rests inside the field and rises on focus or when filled. With a `prefix`, it always sits on the top edge. */
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
  /** Text of a button attached to the right edge, such as "Copy", "Generate" or "Browse". It emits `addon` when clicked. Also its accessible name when `addon-icon-only` is set. */
  addonLabel?: string;
  /** A Lucide icon component shown in the attached button, before `addon-label`. */
  addonIcon?: Component;
  /** Shows only `addon-icon` in the attached button; `addon-label` becomes its `aria-label` and tooltip. */
  addonIconOnly?: boolean;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  name: "",
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  errorMsg: "",
  hint: "",
  size: "small",
  addonLabel: "",
  addonIcon: undefined,
  addonIconOnly: false,
});

const model = defineModel<string | number>({ default: "" });

const emit = defineEmits<{ addon: [event: MouseEvent] }>();

defineSlots<{
  /** Content inside the field before the value: a 16px icon or fixed text such as `https://`. */
  prefix?: () => unknown;
  /** Content inside the field after the value: a unit such as `Gi` or `%`, or a status icon. */
  suffix?: () => unknown;
}>();

const id = useId();
const attrs = useAttrs();
const slots = useSlots();
// class and style stay on the wrapper for layout; everything else (autocomplete, aria-*, data-*) goes to the control.
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const input = ref<HTMLInputElement | null>(null);
const showValue = ref(false);
const inputType = computed(() => (props.type === "password" && showValue.value ? "text" : props.type));
const describedBy = computed(() => (props.errorMsg || props.hint ? `${id}-msg` : undefined));
const hasAddon = computed(() => !!props.addonLabel || !!props.addonIcon);
const hasSuffix = computed(() => !!slots.suffix || props.type === "password");

function onAddon(event: MouseEvent) {
  if (!props.disabled) emit("addon", event);
}

defineExpose({
  /** Moves focus to the input. */
  focus: () => input.value?.focus(),
});
</script>

<template>
  <div v-bind="rootAttrs" class="w-full" :class="disabled && 'opacity-60'" data-ac-ds data-testid="ac-input">
    <div class="flex">
      <div
        class="relative flex min-w-0 flex-1 items-center border shadow-xs transition-[border-color,box-shadow] duration-150"
        :class="[
          size === 'small' ? 'h-9' : 'h-10',
          hasAddon ? 'rounded-l-6' : 'rounded-6',
          disabled || readonly ? 'bg-surface-muted' : 'bg-surface',
          readonly && 'shadow-none',
          errorMsg
            ? 'border-red-60 focus-within:border-danger focus-within:shadow-[0_0_0_3px_var(--color-red-90)]'
            : 'border-border hover:border-border-dark focus-within:focus-ring',
        ]"
      >
        <span
          v-if="$slots.prefix"
          class="flex h-full shrink-0 items-center pl-3 text-base whitespace-nowrap text-muted select-none [&_svg]:size-4"
        >
          <slot name="prefix" />
        </span>
        <!-- placeholder=" " lets the label float with :placeholder-shown, like .ac-label.show-label -->
        <input
          :id="id"
          ref="input"
          v-bind="controlAttrs"
          v-model="model"
          :name="name"
          :type="inputType"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :aria-invalid="!!errorMsg || undefined"
          :aria-describedby="describedBy"
          placeholder=" "
          class="peer block h-full w-full min-w-0 flex-1 rounded-6 bg-transparent text-base text-heading outline-none placeholder:text-transparent disabled:cursor-not-allowed"
          :class="[$slots.prefix ? 'pl-1' : 'pl-3', hasSuffix ? 'pr-1.5' : 'pr-3']"
        />
        <!-- With a prefix the label stays raised, so it never sits on top of the prefix text. -->
        <label
          :for="id"
          class="pointer-events-none absolute -top-px left-2.25 max-w-[calc(100%-20px)] -translate-y-1/2 truncate rounded-2 bg-surface px-1 text-xs font-medium whitespace-nowrap text-label transition-all duration-150 ease-out peer-focus:text-primary-20 peer-read-only:bg-linear-to-b peer-read-only:from-surface peer-read-only:from-50% peer-read-only:to-surface-muted peer-read-only:to-50% peer-disabled:bg-linear-to-b peer-disabled:from-surface peer-disabled:from-50% peer-disabled:to-surface-muted peer-disabled:to-50%"
          :class="[
            !$slots.prefix &&
              'peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-muted peer-focus:-top-px peer-focus:text-xs peer-focus:font-medium',
            errorMsg && 'text-red-30! peer-focus:text-red-30!',
          ]"
        >
          {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
        </label>
        <span
          v-if="$slots.suffix"
          class="relative flex h-full shrink-0 items-center bg-inherit text-base whitespace-nowrap text-muted select-none [&_svg]:size-4"
          :class="type === 'password' ? 'pr-1' : 'pr-3'"
        >
          <slot name="suffix" />
        </span>
        <button
          v-if="type === 'password'"
          type="button"
          class="relative mr-1.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading"
          :aria-label="showValue ? 'Hide value' : 'Show value'"
          @click="showValue = !showValue"
        >
          <component :is="showValue ? EyeOff : Eye" class="size-4" aria-hidden="true" />
        </button>
      </div>
      <button
        v-if="hasAddon"
        type="button"
        class="relative -ml-px inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-r-6 border border-border bg-surface-muted text-base font-medium whitespace-nowrap text-heading shadow-xs transition-[background-color,border-color,box-shadow] duration-150 hover:bg-surface-sunken focus-visible:z-10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:hover:bg-surface-muted"
        :class="[size === 'small' ? 'h-9' : 'h-10', addonIconOnly ? 'w-9' : 'px-3']"
        :disabled="disabled"
        :aria-label="addonIconOnly ? addonLabel : undefined"
        :title="addonIconOnly ? addonLabel : undefined"
        data-ac-ds
        data-testid="ac-input-addon"
        @click="onAddon"
      >
        <component :is="addonIcon" v-if="addonIcon" class="size-4 text-label" aria-hidden="true" />
        <span v-if="!addonIconOnly">{{ addonLabel }}</span>
      </button>
    </div>
    <p v-if="errorMsg" :id="`${id}-msg`" class="mt-1.5 flex items-center gap-1 text-xs text-red-30">
      <CircleAlert class="size-3.5 shrink-0" aria-hidden="true" />
      {{ errorMsg }}
    </p>
    <p v-else-if="hint" :id="`${id}-msg`" class="mt-1.5 text-xs text-muted">{{ hint }}</p>
  </div>
</template>
