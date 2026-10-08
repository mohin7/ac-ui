<script setup lang="ts">
import { computed } from "vue";
import { X } from "@lucide/vue";
import type { Tone } from "./types";

export interface Props {
  /** Text of the tag. The default slot overrides it. */
  label?: string;
  /** `neutral` for most labels; a tone to group filters by kind, e.g. environment or region. */
  color?: Tone | "neutral";
  /** Pill shape (`rounded-50`) instead of the 6px control radius. */
  rounded?: boolean;
  /** Shows a remove button that emits `remove`. */
  removable?: boolean;
  /** Key of a key–value tag such as a Kubernetes label (`app=postgres`). Setting it switches to the two-part style. */
  keyLabel?: string;
  /** Value of a key–value tag. Shown after `keyLabel`, tinted with `color`. */
  valueLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  color: "neutral",
  rounded: false,
  removable: false,
  keyLabel: "",
  valueLabel: "",
});

const emit = defineEmits<{ remove: [] }>();

defineSlots<{
  /** Tag content. Replaces `label`, or the value in key–value mode. */
  default?: () => unknown;
  /** A 14px icon before the text, e.g. a cloud provider or resource kind. */
  icon?: () => unknown;
}>();

// A tag is a bordered chip on the surface, unlike a badge's filled status label.
const tones = {
  neutral: { box: "bg-surface text-body border-border", value: "bg-surface text-heading", divider: "border-border" },
  primary: { box: "bg-primary-97 text-primary-20 border-primary-80", value: "bg-primary-95 text-primary-10", divider: "border-primary-80" },
  info: { box: "bg-blue-97 text-blue-20 border-blue-80", value: "bg-blue-95 text-blue-10", divider: "border-blue-80" },
  success: { box: "bg-green-97 text-green-20 border-green-80", value: "bg-green-95 text-green-10", divider: "border-green-80" },
  warning: { box: "bg-yellow-97 text-yellow-20 border-yellow-80", value: "bg-yellow-95 text-yellow-10", divider: "border-yellow-80" },
  danger: { box: "bg-red-97 text-red-20 border-red-80", value: "bg-red-95 text-red-10", divider: "border-red-80" },
} as const;

const isKeyValue = computed(() => !!props.keyLabel);
const tone = computed(() => tones[props.color]);
const text = computed(() => (isKeyValue.value ? `${props.keyLabel}=${props.valueLabel}` : props.label));
const boxClass = computed(() =>
  isKeyValue.value ? ["bg-surface text-label", props.color === "neutral" ? "border-border" : tone.value.divider] : tone.value.box,
);

function remove() {
  emit("remove");
}
</script>

<template>
  <span
    class="inline-flex h-6 max-w-full items-stretch overflow-hidden border text-xs leading-none whitespace-nowrap"
    :class="[boxClass, rounded ? 'rounded-50' : 'rounded-6', isKeyValue && 'font-mono text-[length:calc(11.5px*var(--ac-scale))]']"
    data-ac-ds
    data-testid="ac-tag"
  >
    <template v-if="isKeyValue">
      <span class="inline-flex min-w-0 items-center gap-1.5 bg-surface-muted pr-1.5 text-label" :class="rounded ? 'pl-2.5' : 'pl-2'">
        <span v-if="$slots.icon" class="inline-flex shrink-0 [&_svg]:size-3.5" aria-hidden="true"><slot name="icon" /></span>
        <span class="truncate">{{ keyLabel }}</span>
      </span>
      <span class="sr-only">=</span>
      <span
        class="inline-flex min-w-0 shrink-[0.25] items-center border-l pl-1.5"
        :class="[tone.value, tone.divider, !removable && (rounded ? 'pr-2.5' : 'pr-2')]"
      >
        <span class="truncate"><slot>{{ valueLabel }}</slot></span>
      </span>
    </template>
    <span
      v-else
      class="inline-flex min-w-0 items-center gap-1.5"
      :class="[rounded ? 'pl-2.5' : 'pl-2', !removable && (rounded ? 'pr-2.5' : 'pr-2')]"
    >
      <span v-if="$slots.icon" class="inline-flex shrink-0 [&_svg]:size-3.5" aria-hidden="true"><slot name="icon" /></span>
      <span class="truncate"><slot>{{ label }}</slot></span>
    </span>
    <span v-if="removable" class="inline-flex shrink-0 items-center px-0.5" :class="isKeyValue && tone.value">
      <button
        type="button"
        class="inline-flex size-4.5 cursor-pointer items-center justify-center opacity-60 transition hover:bg-current/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :class="rounded ? 'rounded-full' : 'rounded-4'"
        :aria-label="text ? `Remove ${text}` : 'Remove'"
        @click="remove"
      >
        <X class="size-3" aria-hidden="true" />
      </button>
    </span>
  </span>
</template>
