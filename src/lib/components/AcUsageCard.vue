<script setup lang="ts">
import { computed, getCurrentInstance, useId } from "vue";
import AcBadge from "./AcBadge.vue";
import type { Component } from "vue";

export interface UsageBreakdownRow {
  /** Row name, e.g. a namespace, database or "CPU (core-month)". */
  label: string;
  /** A Lucide icon before the label. */
  icon?: Component;
  /** One value per column after the label. Numbers are formatted with `format`. */
  values: (string | number)[];
}

export interface Props {
  /** What is measured, e.g. "Storage", "CPU" or "Billable usage". Also the meter's accessible name. */
  title: string;
  /** A muted line under the title, e.g. "Across 6 databases in demo". */
  description?: string;
  /** The period the numbers cover, shown at the top right, e.g. "Sep 2026" or "This billing cycle". */
  period?: string;
  /** A Lucide icon shown in a tinted tile before the title. Or use the `icon` slot. */
  icon?: Component;
  /** Amount used, in `unit`. Leave unset for a card that only shows a breakdown. */
  used?: number;
  /** The quota or limit, in `unit`. Without it there's no meter and the card reads "No limit". */
  limit?: number;
  /** Unit after the numbers, e.g. "GiB", "cores" or "databases". */
  unit?: string;
  /** Formats every number on the card. Defaults to the browser locale with up to 2 decimals. */
  format?: (value: number) => string;
  /** Percentage of the limit where the meter turns warning and a "Near limit" badge appears. */
  warningAt?: number;
  /** Percentage of the limit where the meter turns danger and an "At limit" badge appears. */
  dangerAt?: number;
  /** Marks `warningAt` and `dangerAt` on the meter. */
  showThresholds?: boolean;
  /** Rows of a breakdown table under the meter: `{ label, icon?, values }`. Old UsageTableCard `tbody`. */
  breakdown?: UsageBreakdownRow[];
  /** Column headings of the breakdown, starting with the label column. Old UsageTableCard `thead`. */
  breakdownHeaders?: string[];
  /** Shows placeholder bars instead of the numbers while they load. Old `isLoaderActive`. */
  loading?: boolean;
  /** Makes the card a `RouterLink` to this route. Needs vue-router in the app; without it a string is used as `href`. */
  to?: string | Record<string, unknown>;
  /** Makes the card a plain link. */
  href?: string;
  /** Link target for `href`, e.g. `_blank`. */
  target?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  period: "",
  icon: undefined,
  used: undefined,
  limit: undefined,
  unit: "",
  format: undefined,
  warningAt: 80,
  dangerAt: 95,
  showThresholds: true,
  breakdown: () => [],
  breakdownHeaders: () => [],
  loading: false,
  to: undefined,
  href: undefined,
  target: undefined,
});

const emit = defineEmits<{
  /** Fires when the card is clicked. Listening to it turns the card into a button. */
  click: [e: MouseEvent];
}>();

const slots = defineSlots<{
  /** Replaces the `icon` tile. */
  icon?: () => unknown;
  /** Buttons at the top right, e.g. "Upgrade plan". */
  actions?: () => unknown;
  /** Extra content between the meter and the breakdown. */
  default?: () => unknown;
  /** A row at the bottom, e.g. "Resets on Oct 1". */
  footer?: () => unknown;
}>();

const LEVELS = {
  ok: { fill: "bg-primary", track: "bg-primary-93", text: "text-muted", badge: "" },
  warning: { fill: "bg-warning", track: "bg-yellow-93", text: "text-yellow-20", badge: "Near limit" },
  danger: { fill: "bg-danger", track: "bg-red-93", text: "text-red-30", badge: "At limit" },
  over: { fill: "bg-danger", track: "bg-red-93", text: "text-red-30", badge: "Over limit" },
} as const;

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

const instance = getCurrentInstance();
// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = instance?.appContext.components.RouterLink as Component | undefined;
const id = useId();

const hasUsed = computed(() => typeof props.used === "number" && Number.isFinite(props.used));
const hasLimit = computed(() => hasUsed.value && typeof props.limit === "number" && props.limit > 0);
const percent = computed(() => (hasLimit.value ? (props.used! / props.limit!) * 100 : 0));

const level = computed<keyof typeof LEVELS>(() => {
  if (!hasLimit.value) return "ok";
  if (props.used! > props.limit!) return "over";
  if (percent.value >= props.dangerAt) return "danger";
  return percent.value >= props.warningAt ? "warning" : "ok";
});

const tone = computed(() => LEVELS[level.value]);

const thresholds = computed(() =>
  props.showThresholds ? [props.warningAt, props.dangerAt].filter((t) => t > 0 && t < 100) : [],
);

const remainingText = computed(() => {
  if (!hasLimit.value) return "";
  const diff = props.limit! - props.used!;
  return diff >= 0 ? `${withUnit(diff)} left` : `${withUnit(-diff)} over the limit`;
});

const meterText = computed(() => {
  const base = `${withUnit(props.used ?? 0)} of ${withUnit(props.limit ?? 0)}, ${Math.round(percent.value)}%`;
  return tone.value.badge ? `${base}, ${tone.value.badge.toLowerCase()}` : base;
});

const link = computed(() => {
  if (props.to !== undefined && routerLink) return { is: routerLink, to: props.to };
  const href = props.href ?? (typeof props.to === "string" ? props.to : undefined);
  if (href) return { is: "a", href, target: props.target, rel: props.target === "_blank" ? "noopener noreferrer" : undefined };
  return null;
});

function fmt(value: string | number) {
  if (typeof value !== "number") return value;
  return props.format ? props.format(value) : numberFormat.format(value);
}

function withUnit(value: number) {
  return props.unit ? `${fmt(value)} ${props.unit}` : String(fmt(value));
}

function isButton() {
  return !link.value && !!instance?.vnode.props?.onClick;
}

function onClick(e: MouseEvent) {
  emit("click", e);
}
</script>

<template>
  <section
    class="relative flex min-w-0 flex-col rounded-10 border border-border bg-surface shadow-xs transition-[border-color,box-shadow] duration-150 has-[[data-ac-card-link]:focus-visible]:ring-[3px] has-[[data-ac-card-link]:focus-visible]:ring-ring"
    :class="(link || isButton()) && 'hover:border-border-dark hover:shadow-sm'"
    :aria-labelledby="`${id}-title`"
    :aria-busy="loading || undefined"
    data-testid="ac-usage-card"
  >
    <div class="flex min-w-0 flex-col gap-4 p-4">
      <header class="flex min-w-0 items-start gap-3">
        <span
          v-if="slots.icon || icon"
          class="inline-flex size-8 shrink-0 items-center justify-center rounded-8 bg-primary-95 text-primary-30 [&_svg]:size-4"
          aria-hidden="true"
        >
          <slot name="icon"><component :is="icon" /></slot>
        </span>
        <div class="min-w-0 flex-1">
          <h3 :id="`${id}-title`" class="truncate text-lg leading-6 font-semibold tracking-[-0.01em] text-heading">
            <component
              :is="link ? link.is : 'button'"
              v-if="link || isButton()"
              v-bind="link ? { ...link, is: undefined } : { type: 'button' }"
              data-ac-card-link
              class="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-10"
              @click="onClick"
            >
              {{ title }}
            </component>
            <template v-else>{{ title }}</template>
          </h3>
          <p v-if="description" class="truncate text-xs text-muted" :title="description">{{ description }}</p>
        </div>
        <div v-if="period || tone.badge || slots.actions" class="relative z-10 flex shrink-0 flex-wrap items-center justify-end gap-2">
          <span v-if="period" class="text-xs text-muted">{{ period }}</span>
          <AcBadge
            v-if="tone.badge && !loading"
            :label="tone.badge"
            :color="level === 'warning' ? 'warning' : 'danger'"
            variant="light"
            rounded
            dot
          />
          <slot name="actions" />
        </div>
      </header>

      <div v-if="hasUsed || (loading && breakdown.length === 0)" class="flex min-w-0 flex-col gap-2">
        <template v-if="loading">
          <span class="ac-skeleton-bone block h-6 w-2/5 rounded-4" />
          <span class="ac-skeleton-bone block h-2 w-full rounded-full" />
        </template>
        <template v-else>
          <div class="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p class="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
              <span class="text-3xl font-semibold text-heading">{{ fmt(used!) }}</span>
              <span v-if="hasLimit" class="text-base text-muted">of {{ withUnit(limit!) }}</span>
              <span v-else class="text-base text-muted">{{ unit }}<template v-if="unit"> · </template>No limit</span>
            </p>
            <span v-if="hasLimit" class="text-base font-medium tabular-nums" :class="level === 'ok' ? 'text-heading' : tone.text">
              {{ Math.round(percent) }}%
            </span>
          </div>

          <div
            v-if="hasLimit"
            role="meter"
            :aria-labelledby="`${id}-title`"
            aria-valuemin="0"
            :aria-valuemax="limit"
            :aria-valuenow="Math.min(used!, limit!)"
            :aria-valuetext="meterText"
            class="relative h-2 w-full overflow-hidden rounded-full"
            :class="tone.track"
          >
            <div
              class="h-full rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none"
              :class="tone.fill"
              :style="{ width: `${Math.min(100, percent)}%` }"
            />
            <span
              v-for="t in thresholds"
              :key="t"
              class="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-surface"
              :style="{ left: `${t}%` }"
              aria-hidden="true"
            />
          </div>
          <p v-if="remainingText" class="text-xs" :class="tone.text">{{ remainingText }}</p>
        </template>
      </div>

      <div v-if="slots.default" class="text-base text-body"><slot /></div>
    </div>

    <div v-if="breakdown.length" class="ac-scrollbar border-t border-border-light">
      <table class="w-full text-left text-base">
        <thead v-if="breakdownHeaders.length" class="text-xs text-muted">
          <tr>
            <th
              v-for="(h, i) in breakdownHeaders"
              :key="i"
              scope="col"
              class="h-9 px-4 font-medium whitespace-nowrap"
              :class="i > 0 && 'text-right'"
            >
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, r) in breakdown" :key="`${row.label}${r}`" class="border-t border-border-light" :class="!breakdownHeaders.length && r === 0 && 'border-t-0'">
            <th scope="row" class="px-4 py-2.5 font-normal text-body">
              <span class="flex min-w-0 items-center gap-2">
                <component :is="row.icon" v-if="row.icon" class="size-4 shrink-0 text-muted" aria-hidden="true" />
                <span class="truncate">{{ row.label }}</span>
              </span>
            </th>
            <td v-for="(v, c) in row.values" :key="c" class="px-4 py-2.5 text-right font-medium whitespace-nowrap text-heading tabular-nums">
              <span v-if="loading" class="ac-skeleton-bone ml-auto block h-3 w-14 rounded-4" />
              <template v-else>{{ fmt(v) }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="slots.footer"
      class="relative z-10 mt-auto flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-border-light px-4 py-3 text-xs text-muted"
    >
      <slot name="footer" />
    </div>
  </section>
</template>
