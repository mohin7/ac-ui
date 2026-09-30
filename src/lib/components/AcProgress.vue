<script setup lang="ts">
import { computed, useId } from "vue";
import type { Tone } from "./types";

export interface Props {
  /** Current amount, from 0 to `max`. Ignored while `indeterminate`. */
  value?: number;
  /** The amount that fills the bar. */
  max?: number;
  /** Text above the bar, e.g. "Storage". Also the bar's accessible name. */
  label?: string;
  /** Shows the value to the right of the label: the percentage, or `valueText` when set. */
  showValue?: boolean;
  /** Replaces the percentage, e.g. "7.2 GiB of 10 GiB". Also read by screen readers. */
  valueText?: string;
  /** Bar colour. `auto` is for quotas: primary, then warning from 80% and danger from 95%. */
  color?: Tone | "auto";
  /** For work of unknown length: a sliding bar with no value. */
  indeterminate?: boolean;
  /** Bar height: `small` 4px, `normal` 6px, `large` 10px. */
  size?: "small" | "normal" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  label: "",
  showValue: false,
  valueText: "",
  color: "primary",
  indeterminate: false,
  size: "normal",
});

const fills: Record<Tone, string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const heights = { small: "h-1", normal: "h-1.5", large: "h-2.5" } as const;

const id = useId();

const percent = computed(() => {
  if (props.max <= 0) return 0;
  return Math.min(100, Math.max(0, (props.value / props.max) * 100));
});

const tone = computed<Tone>(() => {
  if (props.color !== "auto") return props.color;
  if (percent.value >= 95) return "danger";
  if (percent.value >= 80) return "warning";
  return "primary";
});

const displayValue = computed(() => props.valueText || `${Math.round(percent.value)}%`);
const hasHeader = computed(() => !!props.label || (props.showValue && !props.indeterminate));
</script>

<template>
  <div class="w-full" data-testid="ac-progress">
    <div v-if="hasHeader" class="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
      <span v-if="label" :id="`${id}-label`" class="min-w-0 truncate font-medium text-label">{{ label }}</span>
      <span
        v-if="showValue && !indeterminate"
        class="ml-auto shrink-0 tabular-nums"
        :class="color === 'auto' && tone !== 'primary' ? (tone === 'danger' ? 'text-red-30' : 'text-yellow-20') : 'text-muted'"
        aria-hidden="true"
      >
        {{ displayValue }}
      </span>
    </div>
    <div
      role="progressbar"
      :aria-labelledby="label ? `${id}-label` : undefined"
      :aria-label="label ? undefined : 'Progress'"
      aria-valuemin="0"
      :aria-valuemax="indeterminate ? undefined : max"
      :aria-valuenow="indeterminate ? undefined : Math.min(max, Math.max(0, value))"
      :aria-valuetext="indeterminate ? undefined : displayValue"
      :aria-busy="indeterminate || undefined"
      class="relative w-full overflow-hidden rounded-full bg-slate-90"
      :class="heights[size]"
    >
      <div
        v-if="indeterminate"
        class="ac-progress-indeterminate absolute inset-y-0 left-0 w-2/5 rounded-full motion-reduce:w-full motion-reduce:opacity-40"
        :class="fills[tone]"
      />
      <div
        v-else
        class="h-full rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none"
        :class="fills[tone]"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
