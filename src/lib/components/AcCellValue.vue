<script lang="ts">
import { ref as moduleRef } from "vue";

// Shared by every cell on the page: one clock for relative dates, one observer for truncation.
const clock = moduleRef(Date.now());
let clockUsers = 0;
let clockTimer: ReturnType<typeof setInterval> | undefined;

function holdClock() {
  if (clockUsers++ === 0) clockTimer = setInterval(() => (clock.value = Date.now()), 30_000);
}

function releaseClock() {
  if (--clockUsers === 0) clearInterval(clockTimer);
}

const overflowWatchers = new WeakMap<Element, () => void>();
let overflowObserver: ResizeObserver | undefined;

function watchOverflow(el: Element, onChange: () => void) {
  if (typeof ResizeObserver === "undefined") return onChange();
  overflowObserver ??= new ResizeObserver((entries) => entries.forEach((e) => overflowWatchers.get(e.target)?.()));
  overflowWatchers.set(el, onChange);
  overflowObserver.observe(el);
}

function unwatchOverflow(el: Element) {
  overflowWatchers.delete(el);
  overflowObserver?.unobserve(el);
}
</script>

<script setup lang="ts">
import { computed, defineAsyncComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Braces, Check, Minus } from "lucide-vue-next";
import AcBadge from "./AcBadge.vue";
import AcModal from "./AcModal.vue";
import AcSkeleton from "./AcSkeleton.vue";
import AcTag from "./AcTag.vue";
import AcTooltip from "./AcTooltip.vue";
import type { Component, ComponentPublicInstance } from "vue";

/** How a value is shown. `auto` picks one from the value itself. */
export type CellType = "auto" | "string" | "number" | "integer" | "boolean" | "date" | "object" | "array" | "labels" | "status";

/** One cell of a server-side resource table (the old `AcTableCell`). */
export interface ResourceCell {
  /** The value: a string, number, boolean, map, list or null. */
  data: unknown;
  /** Value to sort by, when it differs from `data` (e.g. a Unix time for an age). */
  sort?: string | number;
  /** Where the value links to. May hold `${placeholders}`; resolve them with `resolveLink`. */
  link?: string;
  /** Hover text for the value. */
  tooltip?: string;
  /** URL of a 16px image shown before the value. */
  icon?: string;
  /** Status colour, e.g. `success` or `danger`. Shows the value as a badge. */
  color?: string;
  /** Shows the value in bold. */
  isBold?: boolean;
}

/** One column of a server-side resource table (the old `AcTableCol`). */
export interface ResourceColumn {
  /** Header text. Also titles the JSON viewer. */
  name: string;
  /** OpenAPI type from the server (`string`, `integer`, `number`, `boolean`, `date`, `object`), or any `CellType`. */
  type?: CellType | "string" | "integer" | "number" | "boolean" | "date" | "object";
  /** OpenAPI format. `name` marks the resource-name column, which is shown bold. */
  format?: string;
  /** Lower numbers matter more. Hide high numbers on narrow screens. */
  priority?: number;
  /** Server template the value came from. Not used by the UI. */
  pathTemplate?: string;
  /** Alignment of the value. */
  textAlign?: "left" | "center" | "right" | string;
  /** Badge shape for coloured cells: `Pill` (default) or `Rectangle`. */
  shape?: "Pill" | "Rectangle" | string;
  /** Column width in pixels. */
  width?: number;
  /** Server-side sort settings. */
  sort?: { enable?: boolean; template?: string; type?: string };
  /** Present when cells in this column carry links. */
  link?: boolean | Record<string, unknown>;
  /** Present when cells in this column carry tooltips. */
  tooltip?: boolean | Record<string, unknown>;
  /** Present when cells in this column carry icons. */
  icon?: boolean | Record<string, unknown>;
  /** A Grafana dashboard for the row. The app renders the button, e.g. in an AcTable cell slot. */
  dashboard?: { status: string; title: string; message?: string };
  /** A shell into the row's pod or service. The app renders the button. */
  exec?: Record<string, unknown>;
}

/** One row of a server-side resource table (the old `AcTableRow`). */
export interface ResourceRow {
  cells: ResourceCell[];
  namespace?: string;
  ctx?: Record<string, unknown>;
}

/** A server-side resource table: column descriptors and rows of cells (the old `AcTable` type). */
export interface ResourceTable {
  columns: ResourceColumn[];
  rows: ResourceRow[];
  name?: string;
}

/** @deprecated Use `ResourceCell`. */
export type AcTableCell = ResourceCell;
/** @deprecated Use `ResourceColumn`. */
export type AcTableCol = ResourceColumn;
/** @deprecated Use `ResourceRow`. */
export type AcTableRow = ResourceRow;

export interface Props {
  /** The value to show: text, a number, a boolean, a date, a map, a list, or null for a dash. */
  value?: unknown;
  /** How to show it. `auto` detects booleans, numbers, ISO dates, lists and maps (a map of plain values becomes label chips). */
  type?: CellType;
  /** A server-side cell `{ data, link, tooltip, icon, color, isBold }` (the old `cellValue`). Its fields fill in the props of the same meaning. */
  cell?: ResourceCell;
  /** A server-side column `{ name, type, format, textAlign, shape }` (the old `cellDescriptor`). Fills in `type`, `title` and `align`. */
  column?: ResourceColumn;
  /** What the value is, e.g. the column name. Titles the JSON viewer and labels its button. */
  title?: string;
  /** Makes the value a link. `http(s)` links open in a new tab; paths starting with `/` use `RouterLink` when vue-router is installed. */
  href?: string;
  /** Turns a link template into a URL, e.g. to fill `${username}` and `${clustername}` from the current route. */
  resolveLink?: (link: string) => string;
  /** Status colour. Shows the value as a badge. Accepts the old Bulma names too (`is-success`, `light`, `dark`). */
  color?: string;
  /** Hover and focus text. Truncated values show their full text when this is empty. */
  tooltip?: string;
  /** URL of a 16px image before the value, e.g. a cloud provider logo. */
  icon?: string;
  /** Shows the value in bold heading colour, e.g. a resource name. */
  bold?: boolean;
  /** Shows text in the monospace font, for IDs, images and hashes. */
  mono?: boolean;
  /** Alignment inside a wider container. Tables align through their column instead. */
  align?: "left" | "center" | "right";
  /** CSS max width. Longer text is cut with an ellipsis and a tooltip shows it in full. */
  maxWidth?: string;
  /** How many label or list chips show before a “+N more” button. */
  maxItems?: number;
  /** Text after a number, e.g. `%` or ` GiB`. */
  unit?: string;
  /** Shows dates as “3d ago” with the exact time on hover. Turn off to show the exact time. */
  relative?: boolean;
  /** Shown for null, empty text, empty lists and maps, and the server's `<none>` / `<unknown>`. */
  emptyText?: string;
  /** Shows a placeholder bar while the value loads. */
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  type: "auto",
  cell: undefined,
  column: undefined,
  title: "",
  href: "",
  resolveLink: undefined,
  color: "",
  tooltip: "",
  icon: "",
  bold: false,
  mono: false,
  align: undefined,
  maxWidth: "280px",
  maxItems: 3,
  unit: "",
  relative: true,
  emptyText: "—",
  loading: false,
});

type Kind = Exclude<CellType, "auto"> | "empty";
type BadgeColor = "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "dark" | "default";

const EMPTY_STRINGS = new Set(["", "<none>", "<unknown>", "<nil>", "null", "undefined"]);
const BADGE_COLORS: Record<string, BadgeColor> = {
  primary: "primary",
  secondary: "secondary",
  info: "info",
  link: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
  dark: "dark",
  black: "dark",
  light: "default",
  white: "default",
  gray: "default",
  default: "default",
  neutral: "default",
};
const STATUS_WORDS: [BadgeColor, RegExp][] = [
  ["success", /^(ready|running|succeeded|success|successful|healthy|active|available|approved|bound|completed?|current|provisioned|synced|true)$/],
  ["danger", /^(failed|failure|error|critical|notready|not ready|unhealthy|crashloopbackoff|lost|rejected|false)$/],
  ["warning", /^(pending|provisioning|progressing|updating|degraded|warning|halted|paused|terminating|waiting|suspended)$/],
];
const QUANTITY = /^-?[\d.]+\s?[a-zA-Z%]{0,3}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;
const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const integerFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const exactFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "long" });

const CodeEditor = defineAsyncComponent({
  loader: () => import("../editor").then((m) => m.AcCodeEditor),
  loadingComponent: () => h(AcSkeleton, { shape: "editor", height: "240px" }),
  delay: 150,
});
// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined;

const textEl = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const expanded = ref(false);
const viewerMounted = ref(false);
const viewerOpen = ref(false);

const raw = computed(() => (props.cell ? props.cell.data : props.value));
const title = computed(() => props.title || props.column?.name || "");
const tipText = computed(() => props.tooltip || props.cell?.tooltip || "");
const iconUrl = computed(() => props.icon || props.cell?.icon || "");
const isBold = computed(() => props.bold || !!props.cell?.isBold || props.column?.format === "name");
const alignment = computed(() => props.align ?? (props.column?.textAlign as Props["align"]));

const link = computed(() => {
  const target = props.href || props.cell?.link || "";
  return target && props.resolveLink ? props.resolveLink(target) : target;
});
const external = computed(() => /^https?:\/\//.test(link.value));
const linkTag = computed(() => (routerLink && link.value.startsWith("/") ? routerLink : "a"));
const linkAttrs = computed(() => {
  if (!link.value) return null;
  if (external.value) return { href: link.value, target: "_blank", rel: "noopener noreferrer" };
  return linkTag.value === "a" ? { href: link.value } : { to: link.value };
});

const badgeColor = computed<BadgeColor | null>(() => {
  const name = (props.color || props.cell?.color || "").trim().split(/\s+/)[0]!.replace(/^is-/, "");
  if (name) return BADGE_COLORS[name] ?? "default";
  if (kind.value !== "status") return null;
  const word = String(raw.value).trim().toLowerCase();
  return STATUS_WORDS.find(([, re]) => re.test(word))?.[0] ?? "default";
});

const kind = computed<Kind>(() => {
  const v = raw.value;
  if (isEmpty(v)) return "empty";
  if (props.color || props.cell?.color) return "status";
  if (props.type !== "auto") return props.type;
  // Maps and lists are detected whatever the column says; the server types them loosely.
  const declared = typeof v !== "object" ? props.column?.type : undefined;
  if (declared && declared !== "auto" && declared !== "object") return declared;
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return "number";
  if (Array.isArray(v)) return "array";
  if (typeof v === "object") return isFlatMap(v as Record<string, unknown>) ? "labels" : "object";
  if (typeof v === "string" && ISO_DATE.test(v) && !Number.isNaN(Date.parse(v))) return "date";
  return "string";
});

const date = computed(() => (kind.value === "date" ? toDate(raw.value) : null));

const text = computed(() => {
  const v = raw.value;
  switch (kind.value) {
    case "number":
    case "integer": {
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isNaN(n)) return `${String(v)}${props.unit}`;
      return `${(kind.value === "integer" ? integerFormat : numberFormat).format(n)}${props.unit}`;
    }
    case "boolean":
      return isTrue(v) ? "true" : "false";
    case "date":
      if (!date.value) return String(v);
      return props.relative ? relativeTime(date.value, clock.value) : exactFormat.format(date.value);
    case "object":
      return objectPreview(v as Record<string, unknown>);
    default:
      return typeof v === "object" ? JSON.stringify(v) : String(v);
  }
});

const dateTip = computed(() => {
  if (!date.value) return tipText.value;
  return tipText.value || (props.relative ? exactFormat.format(date.value) : relativeTime(date.value, clock.value));
});
const textTip = computed(() => tipText.value || (overflowing.value ? text.value : ""));

const chips = computed(() => {
  const v = raw.value;
  if (kind.value === "labels") {
    return Object.entries(v as Record<string, unknown>).map(([key, value]) => ({ key, value: String(value ?? ""), text: `${key}=${value ?? ""}` }));
  }
  if (kind.value === "array") {
    return (v as unknown[]).map((item) => {
      const label = chipLabel(item);
      return { key: "", value: label, text: label };
    });
  }
  return [];
});
const shownChips = computed(() => (expanded.value ? chips.value : chips.value.slice(0, props.maxItems)));
const hiddenCount = computed(() => chips.value.length - Math.min(chips.value.length, props.maxItems));
const hasNested = computed(() => kind.value === "object" || (kind.value === "array" && (raw.value as unknown[]).some((x) => x !== null && typeof x === "object")));
const json = computed(() => (viewerMounted.value ? JSON.stringify(raw.value, null, 2) : ""));
const numeric = computed(() => kind.value === "number" || kind.value === "integer" || (kind.value === "string" && QUANTITY.test(text.value)));
const itemNoun = computed(() => (kind.value === "labels" ? "labels" : "items"));

function isEmpty(v: unknown) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return EMPTY_STRINGS.has(v.trim());
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v as object).length === 0;
  return false;
}

function isFlatMap(v: Record<string, unknown>) {
  return Object.values(v).every((x) => x === null || ["string", "number", "boolean"].includes(typeof x));
}

function isTrue(v: unknown) {
  return v === true || String(v).toLowerCase() === "true";
}

function toDate(v: unknown) {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "number") return new Date(v < 1e12 ? v * 1000 : v);
  if (typeof v === "string" && /^\d+$/.test(v)) return toDate(Number(v));
  const ms = typeof v === "string" ? Date.parse(v) : NaN;
  // Servers often send a ready-made age like "3d5h"; that shows as text.
  return Number.isNaN(ms) ? null : new Date(ms);
}

function relativeTime(d: Date, now: number) {
  const seconds = Math.round((now - d.getTime()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  const steps: [number, string][] = [
    [60, "m"],
    [3600, "h"],
    [86400, "d"],
    [2592000, "mo"],
    [31536000, "y"],
  ];
  let unit = steps[0]!;
  for (const step of steps) if (abs >= step[0]) unit = step;
  const n = Math.floor(abs / unit[0]);
  return seconds >= 0 ? `${n}${unit[1]} ago` : `in ${n}${unit[1]}`;
}

function shortValue(v: unknown) {
  if (Array.isArray(v)) return `[${v.length}]`;
  if (v !== null && typeof v === "object") return "{…}";
  return typeof v === "string" ? v : String(v);
}

function objectPreview(v: Record<string, unknown>) {
  return Object.entries(v)
    .map(([k, x]) => `${k}: ${shortValue(x)}`)
    .join(", ");
}

function chipLabel(item: unknown) {
  if (item === null || typeof item !== "object") return String(item);
  const o = item as Record<string, unknown>;
  const name = o.name ?? o.Name ?? Object.values(o)[0];
  return name === undefined || typeof name === "object" ? "{…}" : String(name);
}

function setTextEl(el: Element | ComponentPublicInstance | null) {
  textEl.value = (el && "$el" in el ? el.$el : el) as HTMLElement | null;
}

function measure() {
  const el = textEl.value;
  overflowing.value = !!el && el.scrollWidth > el.clientWidth + 1;
}

function openViewer() {
  viewerMounted.value = true;
  viewerOpen.value = true;
}

watch(textEl, (el, old) => {
  if (old) unwatchOverflow(old);
  if (el) watchOverflow(el, measure);
});
// The width stops at max-width, so a longer text doesn't resize the element.
watch(text, () => nextTick(measure));

watch(
  () => kind.value === "date",
  (isDate, was) => {
    if (isDate && !was) holdClock();
    else if (!isDate && was) releaseClock();
  },
);

onMounted(() => {
  if (kind.value === "date") holdClock();
});
onBeforeUnmount(() => {
  if (kind.value === "date") releaseClock();
  if (textEl.value) unwatchOverflow(textEl.value);
});
</script>

<template>
  <span
    class="max-w-full min-w-0 items-center gap-1.5 align-middle"
    :class="[
      alignment ? 'flex w-full' : 'inline-flex',
      alignment === 'center' && 'justify-center',
      alignment === 'right' && 'justify-end',
      isBold && 'font-semibold text-heading',
    ]"
    data-ac-ds
    data-testid="ac-cell-value"
  >
    <AcSkeleton v-if="loading" width="96px" />

    <template v-else>
      <img v-if="iconUrl" :src="iconUrl" alt="" class="size-4 shrink-0 object-contain" />

      <!-- empty -->
      <span v-if="kind === 'empty'" class="text-muted">{{ emptyText }}</span>

      <!-- status badge -->
      <component :is="linkTag" v-else-if="kind === 'status' && linkAttrs" v-bind="linkAttrs" class="inline-flex rounded-6 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring" @click.stop>
        <AcBadge :label="text" :color="badgeColor ?? 'default'" variant="light" :rounded="column?.shape !== 'Rectangle'" dot />
      </component>
      <AcTooltip v-else-if="kind === 'status'" :content="tipText">
        <span :tabindex="tipText ? 0 : undefined" class="inline-flex rounded-6 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
          <AcBadge :label="text" :color="badgeColor ?? 'default'" variant="light" :rounded="column?.shape !== 'Rectangle'" dot />
        </span>
      </AcTooltip>

      <!-- boolean -->
      <span v-else-if="kind === 'boolean'" class="inline-flex items-center gap-1">
        <Check v-if="isTrue(raw)" class="size-3.5 text-success" aria-hidden="true" />
        <Minus v-else class="size-3.5 text-muted" aria-hidden="true" />
        <span :class="!isTrue(raw) && 'text-muted'">{{ text }}</span>
      </span>

      <!-- date -->
      <AcTooltip v-else-if="kind === 'date'" :content="dateTip">
        <component :is="linkTag" v-if="linkAttrs" v-bind="linkAttrs" class="font-medium whitespace-nowrap text-primary-20 tabular-nums underline-offset-2 hover:underline focus-visible:rounded-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring" @click.stop>
          <time :datetime="date?.toISOString()">{{ text }}</time>
        </component>
        <time
          v-else
          :datetime="date?.toISOString()"
          :tabindex="dateTip ? 0 : undefined"
          class="whitespace-nowrap tabular-nums focus-visible:rounded-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          :class="dateTip && 'cursor-default decoration-border-dark decoration-dotted underline-offset-4 hover:underline'"
        >
          {{ text }}
        </time>
      </AcTooltip>

      <!-- labels and lists -->
      <span
        v-else-if="kind === 'labels' || kind === 'array'"
        class="flex w-max min-w-0 flex-wrap items-center gap-1"
        :style="{ maxWidth }"
      >
        <template v-for="(chip, i) in shownChips" :key="`${chip.text}-${i}`">
          <AcTooltip :content="chip.text.length > 28 && !expanded ? chip.text : ''" :class="!expanded && 'max-w-48'">
            <AcTag v-if="chip.key" :key-label="chip.key" :value-label="chip.value" />
            <AcTag v-else :label="chip.value" />
          </AcTooltip>
        </template>
        <button
          v-if="hiddenCount > 0"
          type="button"
          class="inline-flex h-6 shrink-0 cursor-pointer items-center rounded-6 px-1.5 text-xs font-medium whitespace-nowrap text-label transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          :aria-expanded="expanded"
          :aria-label="expanded ? `Show fewer ${itemNoun}` : `Show ${hiddenCount} more ${itemNoun}`"
          @click.stop="expanded = !expanded"
        >
          {{ expanded ? "Show less" : `+${hiddenCount} more` }}
        </button>
      </span>

      <!-- text, numbers and object previews -->
      <AcTooltip v-else :content="textTip" class="min-w-0">
        <component
          :is="linkTag"
          v-if="linkAttrs"
          :ref="setTextEl"
          v-bind="linkAttrs"
          class="block truncate font-medium text-primary-20 underline-offset-2 hover:underline focus-visible:rounded-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          :class="[(mono || kind === 'object') && 'font-mono text-xs', numeric && 'tabular-nums']"
          :style="{ maxWidth }"
          @click.stop
        >
          {{ text }}
        </component>
        <span
          v-else
          :ref="setTextEl"
          :tabindex="textTip ? 0 : undefined"
          class="block truncate focus-visible:rounded-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          :class="[(mono || kind === 'object') && 'font-mono text-xs', numeric && 'tabular-nums', kind === 'object' && 'text-label']"
          :style="{ maxWidth }"
        >
          {{ text }}
        </span>
      </AcTooltip>

      <!-- JSON viewer for nested values -->
      <AcTooltip v-if="hasNested" content="View as JSON">
        <button
          type="button"
          class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          :aria-label="title ? `View ${title} as JSON` : 'View as JSON'"
          aria-haspopup="dialog"
          @click.stop="openViewer"
        >
          <Braces class="size-3.5" aria-hidden="true" />
        </button>
      </AcTooltip>
      <AcModal v-if="viewerMounted" v-model:open="viewerOpen" :title="title || 'Value'" size="medium">
        <CodeEditor :model-value="json" language="json" readonly copyable height="auto" max-height="60vh" :label="`${title || 'Value'} as JSON`" />
      </AcModal>
    </template>
  </span>
</template>
