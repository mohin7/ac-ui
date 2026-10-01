<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { ArrowRight, Bell, BellOff, CheckCheck, CircleCheck, CircleX, Info, LoaderCircle, TriangleAlert } from "lucide-vue-next";
import AcNavbarItem from "./AcNavbarItem.vue";
import AcSkeleton from "./AcSkeleton.vue";
import type { Component } from "vue";

export interface NotificationItem {
  /** Unique id. */
  id: string | number;
  /** When it happened: a `Date`, an ISO string, or epoch milliseconds (epoch seconds also work). */
  time: number | string | Date;
  /** Bold first line. Without it, `msg` is the first line. */
  title?: string;
  /** The message. Old `msg`. */
  msg?: string;
  /** Event status, e.g. `Success`, `Failed`, `Running`, `Pending`. Shown next to the time and picks the icon. */
  status?: string;
  /** Overrides the tone that `status` picks. */
  type?: "success" | "danger" | "warning" | "info" | "neutral";
  /** Read items lose the unread dot and the bold title. */
  read?: boolean;
  /** Plain URL to open. */
  href?: string;
  /** Route to open; rendered as `RouterLink` when vue-router is installed. */
  to?: string | object;
  /** A Lucide icon to replace the status icon. */
  icon?: Component;
}

export interface Props {
  /** Recent events, newest first. */
  notifications?: NotificationItem[];
  /** Number on the bell. Defaults to the items without `read: true`. Old `unreadNotification`. */
  unreadCount?: number;
  /** Shows skeleton rows in the panel. */
  loading?: boolean;
  /** Accessible name of the bell, and the panel heading. */
  label?: string;
  /** Heading of the empty state. */
  emptyText?: string;
  /** Text of the footer link. */
  viewAllLabel?: string;
  /** Plain URL of the full notifications page. Shows the footer link. */
  viewAllHref?: string;
  /** Route of the full notifications page; rendered as `RouterLink` when vue-router is installed. Shows the footer link. */
  viewAllTo?: string | object;
  /** Which edge of the bell the panel lines up with. */
  align?: "start" | "end";
}

const props = withDefaults(defineProps<Props>(), {
  notifications: () => [],
  unreadCount: undefined,
  loading: false,
  label: "Notifications",
  emptyText: "You're all caught up",
  viewAllLabel: "View all",
  viewAllHref: "",
  viewAllTo: undefined,
  align: "end",
});

/** Whether the panel is open. Bind with `v-model:open`; watch it to mark items read when the panel opens. Old `isActive` event. */
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  /** A notification was clicked. */
  select: [item: NotificationItem];
  /** "Mark all as read" was clicked. Set `read: true` on the items. */
  markAllRead: [];
  /** The footer link was clicked. */
  viewAll: [];
}>();

defineSlots<{
  /** Custom row content. */
  item?: (props: { item: NotificationItem }) => unknown;
  /** Replaces the empty state. */
  empty?: () => unknown;
  /** Replaces the footer link. Receives `close`. */
  footer?: (props: { close: () => void }) => unknown;
}>();

type Tone = NonNullable<NotificationItem["type"]>;

const TONE_BY_STATUS: Record<string, Tone> = {
  success: "success",
  succeeded: "success",
  completed: "success",
  complete: "success",
  ready: "success",
  active: "success",
  failed: "danger",
  failure: "danger",
  error: "danger",
  critical: "danger",
  warning: "warning",
  pending: "warning",
  waiting: "warning",
  running: "info",
  started: "info",
  inprogress: "info",
  progressing: "info",
  info: "info",
};
const TONES: Record<Tone, { icon: Component; tile: string; text: string }> = {
  success: { icon: CircleCheck, tile: "bg-green-95 text-green-40", text: "text-green-30" },
  danger: { icon: CircleX, tile: "bg-red-95 text-red-40", text: "text-red-30" },
  warning: { icon: TriangleAlert, tile: "bg-yellow-95 text-yellow-40", text: "text-yellow-30" },
  info: { icon: LoaderCircle, tile: "bg-blue-95 text-blue-40", text: "text-blue-30" },
  neutral: { icon: Info, tile: "bg-slate-90 text-label", text: "text-muted" },
};
const ITEM_SELECTOR = "[data-notification-item]";
const RELATIVE = new Intl.RelativeTimeFormat(undefined, { numeric: "auto", style: "narrow" });
const ABSOLUTE = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
const SHORT_DATE = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
const WEEK = 7 * 86_400_000;

// Looked up on the app instead of imported, so vue-router stays optional.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined;

const id = useId();
const panelId = `${id}-panel`;
const headingId = `${id}-heading`;
const trigger = ref<InstanceType<typeof AcNavbarItem> | null>(null);
const panel = ref<HTMLElement | null>(null);
const style = ref<Record<string, string>>({});
const fromTop = ref(true);
const now = ref(Date.now());
let clock: ReturnType<typeof setInterval> | undefined;

const unread = computed(() => props.unreadCount ?? props.notifications.filter((n) => !n.read).length);
const hasUnread = computed(() => props.notifications.some((n) => !n.read));
const showViewAll = computed(() => !!(props.viewAllHref || props.viewAllTo));

function toneOf(item: NotificationItem): Tone {
  if (item.type) return item.type;
  return TONE_BY_STATUS[(item.status ?? "").toLowerCase().replace(/[^a-z]/g, "")] ?? "neutral";
}

function toMillis(time: NotificationItem["time"]) {
  if (time instanceof Date) return time.getTime();
  if (typeof time === "number") return time < 1e11 ? time * 1000 : time;
  return new Date(time).getTime();
}

function relative(time: NotificationItem["time"]) {
  const ms = toMillis(time);
  if (Number.isNaN(ms)) return "";
  const diff = ms - now.value;
  const abs = Math.abs(diff);
  if (abs < 45_000) return "Just now";
  if (abs >= WEEK) return SHORT_DATE.format(ms);
  if (abs < 3_600_000) return RELATIVE.format(Math.round(diff / 60_000), "minute");
  if (abs < 86_400_000) return RELATIVE.format(Math.round(diff / 3_600_000), "hour");
  return RELATIVE.format(Math.round(diff / 86_400_000), "day");
}

function absolute(time: NotificationItem["time"]) {
  const ms = toMillis(time);
  return Number.isNaN(ms) ? "" : ABSOLUTE.format(ms);
}

function isoOf(time: NotificationItem["time"]) {
  const ms = toMillis(time);
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString();
}

function linkTag(to?: string | object, href?: string): Component | string {
  if (to && routerLink) return routerLink;
  if (to || href) return "a";
  return "button";
}

function linkAttrs(to?: string | object, href?: string) {
  const tag = linkTag(to, href);
  if (tag === routerLink) return { to };
  if (tag === "a") return { href: href || (typeof to === "string" ? to : undefined) };
  return { type: "button" };
}

function triggerEl() {
  return (trigger.value?.$el as HTMLElement | undefined) ?? null;
}

function rows() {
  return [...(panel.value?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [])];
}

function focusRow(index: number) {
  const list = rows();
  if (!list.length) return;
  list[(index + list.length) % list.length]!.focus();
}

function place() {
  const el = triggerEl();
  if (!el || !panel.value) return;
  const r = el.getBoundingClientRect();
  const gap = 6;
  const margin = 8;
  const { offsetWidth: w, offsetHeight: h } = panel.value;
  const below = window.innerHeight - r.bottom - gap - margin;
  const above = r.top - gap - margin;
  const up = below < h && above > below;
  const left = props.align === "end" ? r.right - w : r.left;
  fromTop.value = !up;
  style.value = {
    [up ? "bottom" : "top"]: `${up ? window.innerHeight - r.top + gap : r.bottom + gap}px`,
    left: `${Math.max(margin, Math.min(left, window.innerWidth - w - margin))}px`,
    maxHeight: `${Math.max(up ? above : below, 200)}px`,
  };
}

function close(refocus = true) {
  if (!open.value) return;
  open.value = false;
  if (refocus) triggerEl()?.focus();
}

function toggle() {
  if (open.value) close();
  else open.value = true;
}

function choose(item: NotificationItem) {
  emit("select", item);
  close(false);
}

function viewAll() {
  emit("viewAll");
  close(false);
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key !== "ArrowDown" || open.value) return;
  e.preventDefault();
  open.value = true;
}

function onPanelKeydown(e: KeyboardEvent) {
  const list = rows();
  const current = list.indexOf(document.activeElement as HTMLElement);
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && list.length) {
    e.preventDefault();
    focusRow(current < 0 ? (e.key === "ArrowDown" ? 0 : -1) : current + (e.key === "ArrowDown" ? 1 : -1));
  } else if ((e.key === "Home" || e.key === "End") && current >= 0) {
    e.preventDefault();
    focusRow(e.key === "Home" ? 0 : -1);
  } else if (e.key === "Escape") {
    // defaultPrevented tells an enclosing AcModal or AcSidePanel not to close too
    e.preventDefault();
    close();
  } else if (e.key === "Tab") {
    onTab(e);
  }
}

// Leaving the panel by Tab closes it and continues from the bell, since the panel lives at the end of <body>.
function onTab(e: KeyboardEvent) {
  const focusables = [...(panel.value?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.value)) {
    e.preventDefault();
    close();
  } else if (!e.shiftKey && (document.activeElement === last || !focusables.length)) close();
}

function onPointerDown(e: PointerEvent) {
  const t = e.target as Node;
  if (triggerEl()?.contains(t) || panel.value?.contains(t)) return;
  close(false);
}

function onViewportChange(e?: Event) {
  if (e && panel.value?.contains(e.target as Node)) return;
  place();
}

function listen(on: boolean) {
  const method = on ? "addEventListener" : "removeEventListener";
  document[method]("pointerdown", onPointerDown as EventListener, true);
  window[method]("scroll", onViewportChange, true);
  window[method]("resize", onViewportChange);
  clearInterval(clock);
  if (on) clock = setInterval(() => (now.value = Date.now()), 30_000);
}

watch(open, async (v) => {
  listen(v);
  if (!v) return;
  now.value = Date.now();
  await nextTick();
  place();
  const first = rows()[0];
  if (first) first.focus();
  else panel.value?.focus();
});

watch(
  () => [props.notifications.length, props.loading],
  () => open.value && nextTick(place),
);

onBeforeUnmount(() => listen(false));
</script>

<template>
  <div class="inline-flex" data-testid="ac-notification-menu">
    <AcNavbarItem
      ref="trigger"
      :label="label"
      :icon="Bell"
      icon-only
      :badge="unread"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? panelId : undefined"
      :class="open && 'bg-surface-sunken text-heading'"
      data-testid="ac-notification-menu-trigger"
      @click="toggle"
      @keydown="onTriggerKeydown"
    />

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        :enter-from-class="`opacity-0 motion-safe:scale-[0.98] ${fromTop ? 'motion-safe:-translate-y-1' : 'motion-safe:translate-y-1'}`"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          :id="panelId"
          ref="panel"
          role="dialog"
          tabindex="-1"
          :aria-labelledby="headingId"
          class="fixed z-[90] flex w-[380px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-10 border border-border bg-surface shadow-lg outline-none"
          :class="fromTop ? 'origin-top-right' : 'origin-bottom-right'"
          :style="style"
          data-testid="ac-notification-menu-panel"
          @keydown="onPanelKeydown"
        >
          <div class="flex h-12 shrink-0 items-center gap-2 border-b border-border-light pr-2 pl-4">
            <h2 :id="headingId" class="text-lg font-semibold tracking-normal text-heading">{{ label }}</h2>
            <span
              v-if="unread"
              class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-50 bg-primary-95 px-1.5 text-sm font-semibold text-primary-20 tabular-nums"
            >
              {{ unread > 999 ? "999+" : unread }}<span class="sr-only">&nbsp;unread</span>
            </span>
            <button
              v-if="hasUnread || unread"
              type="button"
              class="ml-auto inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-6 px-2 text-xs font-medium text-label transition-colors hover:bg-surface-muted hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
              data-testid="ac-notification-menu-mark-all"
              @click="emit('markAllRead')"
            >
              <CheckCheck class="size-3.5" aria-hidden="true" />
              Mark all as read
            </button>
          </div>

          <div v-if="loading" class="flex flex-col gap-4 px-4 py-4" aria-busy="true" role="status" aria-label="Loading notifications">
            <div v-for="n in 3" :key="n" class="flex gap-3">
              <AcSkeleton shape="rect" width="28px" height="28px" label="" class="shrink-0" />
              <AcSkeleton shape="text" :lines="2" height="10px" label="" class="flex-1" />
            </div>
          </div>

          <div v-else-if="!notifications.length" class="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <slot name="empty">
              <span class="inline-flex size-10 items-center justify-center rounded-10 border border-border bg-surface-muted text-muted" aria-hidden="true">
                <BellOff class="size-4.5" />
              </span>
              <p class="text-lg font-medium text-heading">{{ emptyText }}</p>
              <p class="max-w-64 text-base text-muted">Backups, upgrades and alerts from your clusters show up here.</p>
            </slot>
          </div>

          <ul v-else role="list" class="ac-scrollbar min-h-0 flex-1 divide-y divide-border-light" data-testid="ac-notification-menu-list">
            <li v-for="item in notifications" :key="item.id">
              <component
                :is="linkTag(item.to, item.href)"
                v-bind="linkAttrs(item.to, item.href)"
                data-notification-item
                class="relative flex w-full cursor-pointer gap-3 px-4 py-3 text-left no-underline outline-none transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset"
                :class="!item.read && 'bg-primary-97'"
                data-testid="ac-notification-menu-item"
                @click="choose(item)"
              >
                <slot name="item" :item="item">
                  <span class="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-8" :class="TONES[toneOf(item)].tile" aria-hidden="true">
                    <component :is="item.icon ?? TONES[toneOf(item)].icon" class="size-4" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="line-clamp-2 text-base text-heading" :class="!item.read && 'font-medium'">{{ item.title || item.msg }}</span>
                    <span v-if="item.title && item.msg" class="mt-0.5 line-clamp-2 text-xs text-body">{{ item.msg }}</span>
                    <span class="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <span v-if="item.status" class="font-medium" :class="TONES[toneOf(item)].text">{{ item.status }}</span>
                      <span v-if="item.status" aria-hidden="true">·</span>
                      <time :datetime="isoOf(item.time)" :title="absolute(item.time)">{{ relative(item.time) }}</time>
                    </span>
                  </span>
                  <span v-if="!item.read" class="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span v-if="!item.read" class="sr-only">(unread)</span>
                </slot>
              </component>
            </li>
          </ul>

          <div v-if="$slots.footer || showViewAll" class="shrink-0 border-t border-border-light p-1">
            <slot name="footer" :close="close">
              <component
                :is="linkTag(viewAllTo, viewAllHref)"
                v-bind="linkAttrs(viewAllTo, viewAllHref)"
                class="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-6 text-base font-medium text-heading no-underline outline-none transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-[3px] focus-visible:ring-ring"
                data-testid="ac-notification-menu-view-all"
                @click="viewAll"
              >
                {{ viewAllLabel }}
                <ArrowRight class="size-3.5" aria-hidden="true" />
              </component>
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
