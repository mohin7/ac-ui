<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import { CircleCheck, CircleMinus, CircleX, Info, TriangleAlert } from "lucide-vue-next";
import AcSpinner from "./AcSpinner.vue";
import type { Component } from "vue";

export type StatusBarStatus = "success" | "warning" | "danger" | "info" | "pending" | "neutral";

export interface StatusBarItem {
  /** Unique key; falls back to the label. */
  key?: string;
  /** The name, e.g. `"Version"`. Shown muted before `value`, or on its own for a status such as `"TLS"`. */
  label?: string;
  /** The value, e.g. `"6.0.12"`. */
  value?: string | number;
  /** A Lucide icon component before the text. */
  icon?: Component;
  /** Colours the icon and picks a default one: check, warning, cross, info, spinner (`pending`) or minus. */
  status?: StatusBarStatus;
  /** Shows a status dot instead of an icon, e.g. for the connection. `pending` pulses. */
  dot?: boolean;
  /** A 0–100 usage meter after the text. It turns yellow at 75 and red at 90 unless `status` is set. */
  meter?: number;
  /** Which end of the bar the item sits at. */
  align?: "left" | "right";
  /** On narrow bars, `low` items hide first (under 768px), then `normal` ones (under 512px). `high` items always show. */
  priority?: "high" | "normal" | "low";
  /** Sets the value in the monospace font, for versions, names and IDs. */
  mono?: boolean;
  /** Shows only the icon; the label becomes the accessible name and hover title. */
  iconOnly?: boolean;
  /** Hover text. */
  title?: string;
  /** Route for `RouterLink` (needs vue-router in the app). */
  to?: string | Record<string, unknown>;
  /** Plain link. */
  href?: string;
  /** Makes the item a button. */
  onClick?: (e: MouseEvent) => void;
  /** Greys out an item that's a link or button. */
  disabled?: boolean;
}

export interface Props {
  /** The items: `{ label?, value?, icon?, status?, dot?, meter?, align?, priority?, mono?, iconOnly?, to?, href?, onClick? }`. */
  items?: StatusBarItem[];
  /** Accessible name of the bar. */
  label?: string;
  /** Dark bar on `bg-sidebar` in both themes, like the old footer. Everything inside uses the dark tokens. */
  dark?: boolean;
  /** Sticks the bar to the bottom of its scroll area. */
  sticky?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  label: "Status bar",
  dark: false,
  sticky: false,
});

defineSlots<{
  /** Extra content at the left end, after the left items. */
  left?: () => unknown;
  /** Extra content at the right end, after the right items: a badge or small buttons. */
  right?: () => unknown;
}>();

const ICONS: Record<Exclude<StatusBarStatus, "pending">, Component> = {
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
  info: Info,
  neutral: CircleMinus,
};
const TEXT: Record<StatusBarStatus, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  pending: "text-muted",
  neutral: "text-muted",
};
const DOT: Record<StatusBarStatus, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  pending: "bg-warning",
  neutral: "bg-slate-60",
};
const METER: Record<StatusBarStatus, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  pending: "bg-slate-60",
  neutral: "bg-slate-60",
};
// Container-query classes, written out in full so Tailwind finds them.
const PRIORITY = { high: "", normal: "@max-lg:hidden", low: "@max-3xl:hidden" } as const;

// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined;

const left = computed(() => props.items.filter((i) => i.align !== "right"));
const right = computed(() => props.items.filter((i) => i.align === "right"));

function keyOf(item: StatusBarItem, i: number) {
  return item.key ?? `${item.label ?? ""}-${i}`;
}

function tagOf(item: StatusBarItem): Component | string {
  if (item.to !== undefined && routerLink && !item.disabled) return routerLink;
  if (item.href || typeof item.to === "string") return "a";
  if (item.onClick) return "button";
  return "span";
}

function isInteractive(item: StatusBarItem) {
  return tagOf(item) !== "span";
}

function attrsOf(item: StatusBarItem) {
  const tag = tagOf(item);
  const attrs: Record<string, unknown> = {
    title: item.title ?? (item.iconOnly ? item.label : undefined),
    "aria-label": item.iconOnly ? item.label : undefined,
  };
  if (tag === routerLink) attrs.to = item.to;
  else if (tag === "a") {
    if (item.disabled) {
      attrs.role = "link";
      attrs["aria-disabled"] = "true";
    } else attrs.href = item.href ?? item.to;
  } else if (tag === "button") {
    attrs.type = "button";
    attrs.disabled = item.disabled || undefined;
  }
  return attrs;
}

function onItemClick(item: StatusBarItem, e: MouseEvent) {
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  item.onClick?.(e);
}

function meterColor(item: StatusBarItem) {
  if (item.status) return METER[item.status];
  const v = item.meter ?? 0;
  return v >= 90 ? "bg-danger" : v >= 75 ? "bg-warning" : "bg-primary";
}

function clamp(v: number) {
  return Math.min(100, Math.max(0, v));
}
</script>

<template>
  <footer
    :aria-label="label"
    class="@container z-10 w-full border-t"
    :class="[dark ? 'dark border-border-light bg-sidebar text-body' : 'border-border bg-surface-muted text-body', sticky && 'sticky bottom-0']"
    data-ac-ds
    data-testid="ac-status-bar"
  >
    <div class="flex h-7 items-center justify-between gap-4 px-2 @lg:px-3">
      <div v-for="side in (['left', 'right'] as const)" :key="side" class="flex min-w-0 items-center gap-1" :class="side === 'left' ? 'flex-1' : 'shrink-0'">
        <!-- Wraps into a clipped second line, so items that don't fit disappear whole instead of being cut. -->
        <ul
          v-if="(side === 'left' ? left : right).length"
          class="flex h-6 min-w-0 flex-wrap items-center gap-x-1 overflow-hidden @lg:gap-x-2"
          role="list"
        >
          <li
            v-for="(item, i) in side === 'left' ? left : right"
            :key="keyOf(item, i)"
            class="flex min-w-0 shrink-0 items-center"
            :class="PRIORITY[item.priority ?? 'normal']"
          >
            <component
              :is="tagOf(item)"
              v-bind="attrsOf(item)"
              class="inline-flex h-6 min-w-0 items-center gap-1.5 rounded-4 px-1.5 text-xs whitespace-nowrap no-underline"
              :class="
                isInteractive(item) &&
                (item.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer transition-colors hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring')
              "
              @click="isInteractive(item) && onItemClick(item, $event)"
            >
              <span v-if="item.dot" class="relative inline-flex size-2 shrink-0" aria-hidden="true">
                <span
                  v-if="item.status === 'pending'"
                  class="absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping"
                  :class="DOT.pending"
                />
                <span class="relative size-2 rounded-full" :class="DOT[item.status ?? 'neutral']" />
              </span>
              <AcSpinner v-else-if="item.status === 'pending' && !item.icon" size="xs" label="" class="text-muted" />
              <component
                :is="item.icon ?? ICONS[item.status as Exclude<StatusBarStatus, 'pending'>]"
                v-else-if="item.icon || item.status"
                class="size-3.5 shrink-0"
                :class="item.status ? TEXT[item.status] : 'text-muted'"
                aria-hidden="true"
              />
              <template v-if="!item.iconOnly">
                <span v-if="item.label" class="shrink-0" :class="item.value !== undefined ? 'text-muted' : 'font-medium text-body'">{{ item.label }}</span>
                <span
                  v-if="item.value !== undefined"
                  class="max-w-48 truncate font-medium text-heading"
                  :class="item.mono && 'font-mono text-[length:calc(11.5px*var(--ac-scale))]'"
                  >{{ item.value }}</span
                >
              </template>
              <span
                v-if="item.meter !== undefined"
                role="meter"
                :aria-valuenow="clamp(item.meter)"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="item.label ? `${item.label} usage` : 'Usage'"
                class="h-1.5 w-8 shrink-0 overflow-hidden rounded-full bg-slate-80"
              >
                <span class="block h-full rounded-full" :class="meterColor(item)" :style="{ width: `${clamp(item.meter)}%` }" />
              </span>
            </component>
          </li>
        </ul>
        <slot :name="side" />
      </div>
    </div>
  </footer>
</template>
