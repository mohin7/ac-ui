<script setup lang="ts">
import { computed, getCurrentInstance, useId } from "vue";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-vue-next";
import type { Component } from "vue";
import type { Tone } from "./types";

export interface Props {
  /** What the number measures, in sentence case: "Databases", "Data RPO". Also the card's accessible name when it's a link. */
  label: string;
  /** The number or short text to show. Format it yourself, e.g. `"1,284"` or `"41s"`. */
  value?: string | number;
  /** Unit or context after the value, e.g. `GiB` or `/ 1m target`. Old `suffix`. */
  suffix?: string;
  /** Change since a previous period. A number is shown as a signed percentage (`12` → `+12%`); pass a string for other units, e.g. `"+19s"`. */
  delta?: string | number;
  /** The period `delta` compares with, e.g. "vs last week". */
  deltaLabel?: string;
  /** Direction of `delta`. Worked out from its sign when not set; set it for text such as "2m margin". */
  trend?: "up" | "down" | "flat";
  /** A rise is bad, e.g. error rate, latency or cost, so up is shown in red and down in green. */
  invertTrend?: boolean;
  /** Colours the value, and tints the whole card for `warning` and `danger`. Old SummaryCard item `type`. */
  status?: "default" | "success" | "info" | "warning" | "danger";
  /** Recent values, oldest first, drawn as a small line next to the value. About 7 to 30 points. */
  sparkline?: number[];
  /** Adds a bar under the value, from 0 to 100. */
  progress?: number;
  /** Colour of the `progress` bar. `auto` turns it warning from 80 and danger from 95. */
  progressColor?: Tone | "auto";
  /** A Lucide icon shown in a tinted tile at the top right. Or use the `icon` slot. */
  icon?: Component;
  /** `small` for dense grids and summaries (14px value); `normal` for overview rows (24px value). */
  size?: "small" | "normal";
  /** Label on the left and value on the right, in one compact row. Replaces the old OverviewCard. */
  inline?: boolean;
  /** Sets the value in Geist Mono, for IDs, timestamps and durations. */
  mono?: boolean;
  /** Shows a placeholder bar instead of the value while it loads. */
  loading?: boolean;
  /** Makes the card a `RouterLink` to this route. Needs vue-router in the app; without it a string is used as `href`. */
  to?: string | Record<string, unknown>;
  /** Makes the card a plain link. */
  href?: string;
  /** Link target for `href`, e.g. `_blank`. */
  target?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  suffix: "",
  delta: undefined,
  deltaLabel: "",
  trend: undefined,
  invertTrend: false,
  status: "default",
  sparkline: () => [],
  progress: undefined,
  progressColor: "primary",
  icon: undefined,
  size: "normal",
  inline: false,
  mono: false,
  loading: false,
  to: undefined,
  href: undefined,
  target: undefined,
});

const emit = defineEmits<{
  /** Fires when the card is clicked. Listening to it turns the card into a button. */
  click: [e: MouseEvent];
}>();

defineSlots<{
  /** Replaces the value, e.g. a status badge or two lines of text. */
  default?: () => unknown;
  /** A badge or tag at the top right, e.g. "Optimal". */
  badge?: () => unknown;
  /** Replaces the `icon` tile. */
  icon?: () => unknown;
  /** A row of small text under the value, after the delta. Old StatCard `footer`. */
  footer?: () => unknown;
}>();

const SPARK_W = 88;
const SPARK_H = 28;

const STATUS = {
  default: { card: "border-border bg-surface", value: "text-heading", label: "text-muted" },
  success: { card: "border-border bg-surface", value: "text-green-30", label: "text-muted" },
  info: { card: "border-border bg-surface", value: "text-blue-30", label: "text-muted" },
  warning: { card: "border-yellow-80 bg-yellow-97", value: "text-yellow-20", label: "text-yellow-20" },
  danger: { card: "border-red-80 bg-red-97", value: "text-red-30", label: "text-red-30" },
} as const;

const FILLS: Record<Tone, string> = { primary: "bg-primary", info: "bg-info", success: "bg-success", warning: "bg-warning", danger: "bg-danger" };

const instance = getCurrentInstance();
// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = instance?.appContext.components.RouterLink as Component | undefined;
const id = useId();

const tone = computed(() => STATUS[props.status]);

const direction = computed(() => {
  if (props.trend) return props.trend;
  if (props.delta === undefined || props.delta === "") return undefined;
  if (typeof props.delta === "number") return props.delta > 0 ? "up" : props.delta < 0 ? "down" : "flat";
  const first = props.delta.trim()[0];
  if (first === "+") return "up";
  if (first === "-" || first === "−") return "down";
  return "flat";
});

const deltaText = computed(() => {
  if (typeof props.delta !== "number") return props.delta ?? "";
  const sign = props.delta > 0 ? "+" : props.delta < 0 ? "−" : "";
  return `${sign}${Math.abs(props.delta).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
});

const deltaClass = computed(() => {
  if (direction.value === "flat" || !direction.value) return "text-muted";
  const good = (direction.value === "up") !== props.invertTrend;
  return good ? "text-green-30" : "text-red-30";
});

const showDelta = computed(() => !!direction.value && deltaText.value !== "");

const progressPercent = computed(() => Math.min(100, Math.max(0, props.progress ?? 0)));

const progressFill = computed(() => {
  if (props.progressColor !== "auto") return FILLS[props.progressColor];
  if (progressPercent.value >= 95) return FILLS.danger;
  return progressPercent.value >= 80 ? FILLS.warning : FILLS.primary;
});

const deltaIcon = computed(() => (direction.value === "up" ? ArrowUpRight : direction.value === "down" ? ArrowDownRight : Minus));

const spark = computed(() => {
  const points = props.sparkline.filter((n) => Number.isFinite(n));
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 3;
  const xy = points.map((n, i) => [
    (i / (points.length - 1)) * (SPARK_W - pad * 2) + pad,
    SPARK_H - pad - ((n - min) / range) * (SPARK_H - pad * 2),
  ]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x!.toFixed(1)} ${y!.toFixed(1)}`).join(" ");
  const last = xy[xy.length - 1]!;
  const fmt = (n: number) => n.toLocaleString();
  const summary = `Trend over ${points.length} points: from ${fmt(points[0]!)} to ${fmt(points[points.length - 1]!)}, low ${fmt(min)}, high ${fmt(max)}`;
  return { line, area: `${line} L${last[0]!.toFixed(1)} ${SPARK_H} L${pad} ${SPARK_H} Z`, last, summary };
});

const valueClass = computed(() => {
  if (props.inline || props.size === "small") return "text-lg font-semibold";
  return "text-3xl font-semibold";
});

const link = computed(() => {
  if (props.to !== undefined && routerLink) return { is: routerLink, to: props.to };
  const href = props.href ?? (typeof props.to === "string" ? props.to : undefined);
  if (href) return { is: "a", href, target: props.target, rel: props.target === "_blank" ? "noopener noreferrer" : undefined };
  return null;
});

function isButton() {
  return !link.value && !!instance?.vnode.props?.onClick;
}

function onClick(e: MouseEvent) {
  emit("click", e);
}
</script>

<template>
  <div
    class="relative flex min-w-0 rounded-10 border shadow-xs transition-[border-color,box-shadow] duration-150 has-[[data-ac-card-link]:focus-visible]:ring-[3px] has-[[data-ac-card-link]:focus-visible]:ring-ring"
    :class="[
      tone.card,
      inline ? 'items-center justify-between gap-3 px-4 py-2.5' : 'flex-col gap-2',
      !inline && (size === 'small' ? 'px-3.5 py-3' : 'p-4'),
      (link || isButton()) && 'hover:border-border-dark hover:shadow-sm',
    ]"
    :aria-busy="loading || undefined"
    data-ac-ds
    data-testid="ac-stat-card"
  >
    <div class="flex min-w-0 items-start justify-between gap-2" :class="inline && 'flex-1'">
      <component
        :is="link ? link.is : isButton() ? 'button' : 'p'"
        v-bind="link ? { ...link, is: undefined } : {}"
        :id="`${id}-label`"
        :type="isButton() ? 'button' : undefined"
        :aria-describedby="link || isButton() ? `${id}-value` : undefined"
        :data-ac-card-link="link || isButton() ? '' : undefined"
        class="min-w-0 truncate text-left font-medium outline-none after:absolute after:inset-0 after:rounded-10"
        :class="[
          inline ? 'text-base text-body' : size === 'small' ? 'text-sm tracking-wide uppercase' : 'text-xs',
          !inline && tone.label,
          (link || isButton()) && 'cursor-pointer',
        ]"
        @click="link || isButton() ? onClick($event) : undefined"
      >
        {{ label }}
      </component>
      <div v-if="!inline && ($slots.badge || $slots.icon || icon)" class="-mt-0.5 flex shrink-0 items-center gap-2">
        <slot name="badge" />
        <span
          v-if="$slots.icon || icon"
          class="inline-flex size-8 items-center justify-center rounded-8 bg-primary-95 text-primary-30 [&_svg]:size-4"
          aria-hidden="true"
        >
          <slot name="icon"><component :is="icon" /></slot>
        </span>
      </div>
    </div>

    <div :id="`${id}-value`" class="flex min-w-0 items-end justify-between gap-3" :class="inline ? 'shrink-0' : 'flex-1'">
      <span v-if="loading" class="ac-skeleton-bone block rounded-4" :class="inline ? 'h-4 w-12' : size === 'small' ? 'h-4 w-2/5' : 'mt-1 h-6 w-1/2'" />
      <div v-else class="min-w-0">
        <slot>
          <p class="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span class="min-w-0 break-words" :class="[valueClass, tone.value, mono && 'font-mono tracking-tight']">{{ value }}</span>
            <span v-if="suffix" class="text-base text-muted">{{ suffix }}</span>
          </p>
        </slot>
      </div>
      <svg
        v-if="spark && !inline && !loading"
        :width="SPARK_W"
        :height="SPARK_H"
        :viewBox="`0 0 ${SPARK_W} ${SPARK_H}`"
        class="mb-1 shrink-0 overflow-visible"
        role="img"
        :aria-label="spark.summary"
      >
        <path :d="spark.area" class="fill-primary-97" />
        <path :d="spark.line" fill="none" class="stroke-slate-60" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <circle :cx="spark.last[0]" :cy="spark.last[1]" r="3" class="fill-primary stroke-surface" stroke-width="1.5" />
      </svg>
    </div>

    <div
      v-if="progress !== undefined && !inline"
      role="progressbar"
      :aria-labelledby="`${id}-label`"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(progressPercent)"
      class="h-1 w-full overflow-hidden rounded-full bg-slate-90"
    >
      <div
        class="h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none"
        :class="progressFill"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <div
      v-if="!inline && (showDelta || $slots.footer)"
      class="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted"
    >
      <span v-if="showDelta" class="inline-flex items-center gap-1">
        <span class="inline-flex items-center gap-0.5 font-medium" :class="deltaClass">
          <component :is="deltaIcon" class="size-3.5" aria-hidden="true" />
          <span class="sr-only">{{ direction === "up" ? "Up" : direction === "down" ? "Down" : "No change" }}</span>
          {{ deltaText }}
        </span>
        <span v-if="deltaLabel">{{ deltaLabel }}</span>
      </span>
      <slot name="footer" />
    </div>
  </div>
</template>
