<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from "vue";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-vue-next";
import AcSelect from "./AcSelect.vue";
import type { Component, Ref } from "vue";
import type { SelectOption, Tone } from "./types";

export interface SideTabItem {
  /** Unique key. `v-model` holds the active item's key. */
  key: string;
  /** Text of the item. */
  label: string;
  /** A Lucide icon component, e.g. `:icon="Database"`. The collapsed rail shows only the icon. */
  icon?: Component;
  /** Route for `RouterLink` (needs vue-router in the app). The item for the current route becomes active by itself. */
  to?: string | Record<string, unknown>;
  /** Plain link, when there's no router. */
  href?: string;
  /** A count or short word after the label, e.g. `3` or `"New"`. */
  badge?: string | number;
  /** Colour of the badge. */
  badgeColor?: Tone | "neutral";
  /** Colours the item, e.g. `danger` for a "Danger zone" section. */
  tone?: "danger" | "warning" | "success";
  /** Greys the item out and blocks clicks. */
  disabled?: boolean;
  /** Items with the same group are listed under that heading. */
  group?: string;
  /** Nested items. Turns this item into a group that expands and collapses (one level deep). */
  children?: SideTabItem[];
}

interface RouterLike {
  currentRoute: Ref<{ path: string }>;
  resolve: (to: unknown) => { path: string };
  push: (to: unknown) => Promise<unknown>;
}

export interface Props {
  /** The sections: `{ key, label, icon?, to?, href?, badge?, tone?, disabled?, group?, children? }`. */
  items: SideTabItem[];
  /** Accessible name of the navigation, and the label of the select on phones. */
  label?: string;
  /** Sticks the list to the top while the page scrolls. */
  sticky?: boolean;
  /** Sticky offset from the top of the scroll area, e.g. `"56px"` under a navbar. */
  top?: string;
  /** Space kept free at the bottom while sticky, e.g. `"28px"` above a status bar. */
  bottom?: string;
  /** CSS selectors of fixed bars (navbar, page header) whose measured heights are added to `top`. For bars whose height changes. */
  offsetSelectors?: string[];
  /** Width of the list. */
  width?: string;
  /** Hides the list so the content takes the full width, e.g. on an edit page that needs the room. */
  hideTabs?: boolean;
  /** Shows a Collapse button that toggles `v-model:collapsed` (an icon-only rail). */
  collapsible?: boolean;
  /** Width in px below which the list turns into the phone layout: the component's own width with content beside it, otherwise its parent's. `0` keeps it vertical. */
  breakpoint?: number;
  /** Phone layout: a `select`, or a horizontal row of tabs that `scroll`s. */
  mobile?: "select" | "scroll";
}

const props = withDefaults(defineProps<Props>(), {
  label: "Sections",
  sticky: true,
  top: "0px",
  bottom: "0px",
  offsetSelectors: () => [],
  width: "220px",
  hideTabs: false,
  collapsible: false,
  breakpoint: 640,
  mobile: "select",
});

/** The active item's `key`. With router links it follows the current route. */
const model = defineModel<string>({ default: "" });
/** Icon-only rail. Bind with `v-model:collapsed`. */
const collapsed = defineModel<boolean>("collapsed", { default: false });

const emit = defineEmits<{
  /** An item was picked by click, keyboard or the phone select. */
  select: [item: SideTabItem];
}>();

defineSlots<{
  /** Page content, placed beside the list (below it on phones). Receives the active key and whether the phone layout is on. */
  default?: (props: { active: string; compact: boolean }) => unknown;
}>();

const BADGE: Record<Tone | "neutral", string> = {
  neutral: "bg-surface-sunken text-label ring-1 ring-border ring-inset",
  primary: "bg-primary-95 text-primary-20",
  info: "bg-blue-95 text-blue-20",
  success: "bg-green-95 text-green-20",
  warning: "bg-yellow-95 text-yellow-20",
  danger: "bg-red-95 text-red-30",
};
const DOT: Record<Tone | "neutral", string> = {
  neutral: "bg-slate-60",
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};
const TONE = {
  none: ["text-body hover:bg-surface-sunken hover:text-heading", "bg-primary-95 font-medium text-primary-20"],
  danger: ["text-red-30 hover:bg-red-97", "bg-red-95 font-medium text-red-20"],
  warning: ["text-yellow-30 hover:bg-yellow-97", "bg-yellow-95 font-medium text-yellow-20"],
  success: ["text-green-30 hover:bg-green-97", "bg-green-95 font-medium text-green-20"],
} as const;

const id = useId();
const slots = useSlots();
const app = getCurrentInstance()?.appContext;
// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = app?.components.RouterLink as Component | undefined;
const router = app?.config.globalProperties.$router as RouterLike | undefined;

const root = ref<HTMLElement | null>(null);
const scroller = ref<HTMLElement | null>(null);
const compact = ref(false);
const measuredOffset = ref(0);
const closed = ref<Record<string, boolean>>({});
let resizeObserver: ResizeObserver | null = null;
let offsetObserver: ResizeObserver | null = null;

const hasContent = computed(() => !!slots.default);
const rail = computed(() => collapsed.value && !compact.value);
const leaves = computed(() => props.items.flatMap((item) => (item.children?.length ? item.children : [item])));
const sections = computed(() => {
  const out: { name: string; items: SideTabItem[] }[] = [];
  for (const item of props.items) {
    const name = item.group ?? "";
    const last = out[out.length - 1];
    if (last && last.name === name) last.items.push(item);
    else out.push({ name, items: [item] });
  }
  return out;
});
const selectOptions = computed<SelectOption<string>[]>(() =>
  props.items.flatMap((item) =>
    item.children?.length
      ? item.children.map((c) => ({ value: c.key, label: c.label, group: item.label, disabled: c.disabled }))
      : [{ value: item.key, label: item.label, group: item.group, disabled: item.disabled }],
  ),
);
// Exact match wins; otherwise the longest route that the current path sits under.
const routeKey = computed(() => {
  if (!router) return "";
  const current = router.currentRoute.value.path;
  let best = "";
  let bestLength = -1;
  for (const item of leaves.value) {
    if (item.to === undefined) continue;
    let path: string;
    try {
      path = router.resolve(item.to).path;
    } catch {
      continue;
    }
    if (path === current) return item.key;
    const base = path.endsWith("/") ? path : `${path}/`;
    if (current.startsWith(base) && path.length > bestLength) {
      best = item.key;
      bestLength = path.length;
    }
  }
  return best;
});
const stickyTop = computed(() => (measuredOffset.value ? `calc(${props.top} + ${measuredOffset.value}px)` : props.top));
const panelStyle = computed(() =>
  props.sticky ? { top: stickyTop.value, maxHeight: `calc(100dvh - ${stickyTop.value} - ${props.bottom})` } : undefined,
);

function isActive(item: SideTabItem) {
  return item.key === model.value;
}

function hasActiveChild(item: SideTabItem) {
  return !!item.children?.some(isActive);
}

function isOpen(item: SideTabItem) {
  return !closed.value[item.key];
}

function toggleGroup(item: SideTabItem) {
  if (rail.value) {
    collapsed.value = false;
    closed.value[item.key] = false;
    return;
  }
  closed.value[item.key] = isOpen(item);
}

function tagOf(item: SideTabItem): Component | string {
  if (item.to !== undefined && routerLink && !item.disabled) return routerLink;
  if (item.href || typeof item.to === "string") return "a";
  return "button";
}

function linkAttrs(item: SideTabItem) {
  const tag = tagOf(item);
  const attrs: Record<string, unknown> = { "aria-current": isActive(item) ? (item.to || item.href ? "page" : "true") : undefined };
  if (tag === routerLink) attrs.to = item.to;
  else if (tag === "a") {
    if (item.disabled) {
      attrs.role = "link";
      attrs["aria-disabled"] = "true";
    } else attrs.href = item.href ?? item.to;
  } else {
    attrs.type = "button";
    attrs.disabled = item.disabled || undefined;
  }
  return attrs;
}

function itemClass(item: SideTabItem) {
  const [idle, active] = TONE[item.tone ?? "none"];
  return [
    isActive(item) ? active : idle,
    item.disabled ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer",
  ];
}

function onItemClick(item: SideTabItem, e: MouseEvent) {
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  model.value = item.key;
  emit("select", item);
}

function onSelect(value: string | string[] | null) {
  const item = leaves.value.find((i) => i.key === value);
  if (!item || item.disabled) return;
  model.value = item.key;
  emit("select", item);
  if (item.to !== undefined && router) router.push(item.to);
  else if (item.href) window.location.assign(item.href);
}

function onKeydown(e: KeyboardEvent) {
  if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  const list = e.currentTarget as HTMLElement;
  const els = [...list.querySelectorAll<HTMLElement>("[data-side-tab]")].filter(
    (el) => el.offsetParent !== null && !el.hasAttribute("disabled") && el.getAttribute("aria-disabled") !== "true",
  );
  const horizontal = compact.value;
  const next = horizontal ? "ArrowRight" : "ArrowDown";
  const prev = horizontal ? "ArrowLeft" : "ArrowUp";
  const i = els.indexOf(document.activeElement as HTMLElement);
  let target: HTMLElement | undefined;
  if (e.key === next) target = els[(i + 1) % els.length];
  else if (e.key === prev) target = els[(i - 1 + els.length) % els.length];
  else if (e.key === "Home") target = els[0];
  else if (e.key === "End") target = els[els.length - 1];
  if (!target) return;
  e.preventDefault();
  target.focus();
}

// Scrolls the row itself, not the page, so the active tab stays in view on phones.
function revealActive() {
  const list = scroller.value;
  const el = list?.querySelector<HTMLElement>("[aria-current]");
  if (!list || !el) return;
  const offset = el.getBoundingClientRect().left - list.getBoundingClientRect().left;
  list.scrollLeft += offset - (list.clientWidth - el.offsetWidth) / 2;
}

function measure() {
  const target = hasContent.value ? root.value : root.value?.parentElement;
  if (!target) return;
  compact.value = props.breakpoint > 0 && target.clientWidth < props.breakpoint;
}

function watchOffsets() {
  offsetObserver?.disconnect();
  measuredOffset.value = 0;
  if (!props.offsetSelectors.length || typeof ResizeObserver === "undefined") return;
  const els = props.offsetSelectors.map((s) => document.querySelector<HTMLElement>(s)).filter((el): el is HTMLElement => !!el);
  const sum = () => (measuredOffset.value = els.reduce((total, el) => total + el.offsetHeight, 0));
  offsetObserver = new ResizeObserver(sum);
  els.forEach((el) => offsetObserver!.observe(el));
  sum();
}

watch(
  routeKey,
  (key) => {
    if (key) model.value = key;
  },
  { immediate: true },
);

watch(model, (key) => {
  const parent = props.items.find((item) => item.children?.some((c) => c.key === key));
  if (parent) closed.value[parent.key] = false;
  if (compact.value && props.mobile === "scroll") nextTick(revealActive);
});

watch(compact, (v) => {
  if (v && props.mobile === "scroll") nextTick(revealActive);
});

watch(() => props.offsetSelectors.join(","), watchOffsets);

onMounted(() => {
  measure();
  watchOffsets();
  const target = hasContent.value ? root.value : root.value?.parentElement;
  if (target && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(target);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  offsetObserver?.disconnect();
});
</script>

<template>
  <div
    ref="root"
    :class="hasContent ? ['flex w-full min-w-0', compact ? 'flex-col' : 'flex-row'] : compact ? 'w-full' : 'flex shrink-0 self-stretch'"
    data-testid="ac-side-tabs"
  >
    <template v-if="!hideTabs">
      <!-- Phone: select -->
      <div v-if="compact && mobile === 'select'" class="border-b border-border bg-surface px-4 py-3">
        <AcSelect :model-value="model || null" :options="selectOptions" :label="label" @update:model-value="onSelect" />
      </div>

      <!-- Phone: a row of tabs that scrolls sideways -->
      <nav v-else-if="compact" :aria-label="label" class="border-b border-border bg-surface">
        <ul
          ref="scroller"
          class="flex gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          @keydown="onKeydown"
        >
          <li v-for="item in leaves" :key="item.key" class="shrink-0">
            <component
              :is="tagOf(item)"
              v-bind="linkAttrs(item)"
              data-side-tab
              class="inline-flex h-8 items-center gap-2 rounded-6 px-3 text-base whitespace-nowrap no-underline transition-colors duration-100 select-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
              :class="itemClass(item)"
              @click="onItemClick(item, $event)"
            >
              <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0 opacity-80" aria-hidden="true" />
              {{ item.label }}
              <span
                v-if="item.badge !== undefined && item.badge !== ''"
                class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-50 px-1.5 text-sm font-medium tabular-nums"
                :class="BADGE[item.badgeColor ?? 'neutral']"
                >{{ item.badge }}</span
              >
            </component>
          </li>
        </ul>
      </nav>

      <!-- Wide: a vertical list -->
      <div
        v-else
        class="shrink-0 border-r border-border bg-surface transition-[width] duration-200 ease-out-soft motion-reduce:transition-none"
        :style="{ width: rail ? '56px' : width }"
      >
        <nav
          :aria-label="label"
          class="ac-scrollbar flex flex-col gap-3 p-2"
          :class="sticky && 'sticky'"
          :style="panelStyle"
          @keydown="onKeydown"
        >
          <div v-for="(section, s) in sections" :key="section.name || `section-${s}`">
            <p
              v-if="section.name && !rail"
              class="mb-1 truncate px-2.5 pt-1 text-sm font-semibold tracking-[0.06em] text-muted uppercase"
            >
              {{ section.name }}
            </p>
            <div v-else-if="section.name && s > 0" class="mx-2 mb-2 h-px bg-border-light" aria-hidden="true" />
            <ul class="flex flex-col gap-0.5" role="list">
              <li v-for="item in section.items" :key="item.key">
                <!-- plain item -->
                <component
                  :is="tagOf(item)"
                  v-if="!item.children?.length"
                  v-bind="linkAttrs(item)"
                  data-side-tab
                  class="group relative flex h-8 w-full items-center gap-2.5 rounded-6 text-left text-base no-underline transition-colors duration-100 select-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                  :class="[itemClass(item), rail ? 'justify-center' : 'px-2.5']"
                  :title="rail ? item.label : undefined"
                  @click="onItemClick(item, $event)"
                >
                  <span
                    v-if="item.icon || rail"
                    class="inline-flex size-4 shrink-0 items-center justify-center"
                    :class="!item.tone && !isActive(item) && 'text-muted group-hover:text-heading'"
                    aria-hidden="true"
                  >
                    <component :is="item.icon" v-if="item.icon" class="size-4" />
                    <span v-else class="text-xs font-semibold">{{ item.label.charAt(0) }}</span>
                  </span>
                  <span :class="rail ? 'sr-only' : 'min-w-0 flex-1 truncate'">{{ item.label }}</span>
                  <template v-if="item.badge !== undefined && item.badge !== ''">
                    <span v-if="rail" class="absolute top-1 right-1 size-1.5 rounded-full" :class="DOT[item.badgeColor ?? 'neutral']" aria-hidden="true" />
                    <span
                      v-else
                      class="inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-50 px-1.5 text-sm font-medium tabular-nums"
                      :class="BADGE[item.badgeColor ?? 'neutral']"
                      >{{ item.badge }}</span
                    >
                  </template>
                </component>

                <!-- group with nested items -->
                <template v-else>
                  <button
                    type="button"
                    data-side-tab
                    class="group flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-6 text-left text-base transition-colors duration-100 select-none hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    :class="[
                      rail ? 'justify-center' : 'px-2.5',
                      rail && hasActiveChild(item) ? 'bg-primary-95 text-primary-20' : hasActiveChild(item) ? 'font-medium text-heading' : 'text-body hover:text-heading',
                    ]"
                    :disabled="item.disabled || undefined"
                    :aria-expanded="rail ? undefined : isOpen(item)"
                    :aria-controls="`${id}-${item.key}`"
                    :title="rail ? item.label : undefined"
                    @click="toggleGroup(item)"
                  >
                    <span
                      v-if="item.icon || rail"
                      class="inline-flex size-4 shrink-0 items-center justify-center"
                      :class="hasActiveChild(item) ? 'text-primary-30' : 'text-muted group-hover:text-heading'"
                      aria-hidden="true"
                    >
                      <component :is="item.icon" v-if="item.icon" class="size-4" />
                      <span v-else class="text-xs font-semibold">{{ item.label.charAt(0) }}</span>
                    </span>
                    <span :class="rail ? 'sr-only' : 'min-w-0 flex-1 truncate'">{{ item.label }}</span>
                    <span
                      v-if="!rail && item.badge !== undefined && item.badge !== ''"
                      class="inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-50 px-1.5 text-sm font-medium tabular-nums"
                      :class="BADGE[item.badgeColor ?? 'neutral']"
                      >{{ item.badge }}</span
                    >
                    <ChevronRight
                      v-if="!rail"
                      class="size-3.5 shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none"
                      :class="isOpen(item) && 'rotate-90'"
                      aria-hidden="true"
                    />
                  </button>
                  <ul
                    v-show="isOpen(item) && !rail"
                    :id="`${id}-${item.key}`"
                    role="list"
                    class="mt-0.5 ml-4.5 flex flex-col gap-0.5 border-l border-border pl-2"
                  >
                    <li v-for="child in item.children" :key="child.key">
                      <component
                        :is="tagOf(child)"
                        v-bind="linkAttrs(child)"
                        data-side-tab
                        class="group flex h-8 w-full items-center gap-2.5 rounded-6 px-2.5 text-left text-base no-underline transition-colors duration-100 select-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                        :class="itemClass(child)"
                        @click="onItemClick(child, $event)"
                      >
                        <component
                          :is="child.icon"
                          v-if="child.icon"
                          class="size-4 shrink-0"
                          :class="!child.tone && !isActive(child) && 'text-muted group-hover:text-heading'"
                          aria-hidden="true"
                        />
                        <span class="min-w-0 flex-1 truncate">{{ child.label }}</span>
                        <span
                          v-if="child.badge !== undefined && child.badge !== ''"
                          class="inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-50 px-1.5 text-sm font-medium tabular-nums"
                          :class="BADGE[child.badgeColor ?? 'neutral']"
                          >{{ child.badge }}</span
                        >
                      </component>
                    </li>
                  </ul>
                </template>
              </li>
            </ul>
          </div>

          <button
            v-if="collapsible"
            type="button"
            class="mt-auto flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-6 text-base text-muted transition-colors hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
            :class="rail ? 'justify-center' : 'px-2.5'"
            :aria-label="rail ? `Expand ${label}` : `Collapse ${label}`"
            :aria-expanded="!collapsed"
            :title="rail ? 'Expand' : undefined"
            @click="collapsed = !collapsed"
          >
            <PanelLeftOpen v-if="rail" class="size-4 shrink-0" aria-hidden="true" />
            <PanelLeftClose v-else class="size-4 shrink-0" aria-hidden="true" />
            <span v-if="!rail">Collapse</span>
          </button>
        </nav>
      </div>
    </template>

    <div v-if="hasContent" class="min-w-0 flex-1">
      <slot :active="model" :compact="compact" />
    </div>
  </div>
</template>
