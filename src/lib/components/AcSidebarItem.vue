<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref, useId, watch } from "vue";
import { ChevronRight } from "lucide-vue-next";
import type { Component, Ref } from "vue";
import type { Tone } from "./types";

interface SidebarContext {
  rail: Readonly<Ref<boolean>>;
  isMobile: Readonly<Ref<boolean>>;
  dark: Readonly<Ref<boolean>>;
  expand: () => void;
  navigate: () => void;
}

export interface Props {
  /** Text of the item. In the collapsed rail it becomes the tooltip and the accessible name. */
  label: string;
  /** A Lucide icon component, e.g. `:icon="Database"`. The collapsed rail shows only the icon. */
  icon?: Component;
  /** Route to link to. Renders `RouterLink` when vue-router is installed in the app, otherwise a plain link (string routes only). */
  to?: string | object;
  /** Plain URL, for pages outside the app. Takes over from `to` when vue-router isn't installed. */
  href?: string;
  /** Marks the current page: highlighted and `aria-current="page"`. With `to` and vue-router, an exact route match does this for you. */
  active?: boolean;
  /** A count or short word after the label, e.g. `3` or `"New"`. Shown as a dot in the collapsed rail. */
  badge?: string | number;
  /** Colour of the badge. */
  badgeColor?: Tone | "neutral";
  /** Greys the item out and blocks clicks. */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  to: undefined,
  href: undefined,
  active: false,
  badge: undefined,
  badgeColor: "neutral",
  disabled: false,
});

/** Whether the nested items are shown. Opens by itself when a nested item is the current page. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{ click: [e: MouseEvent] }>();

const slots = defineSlots<{
  /** Nested `AcSidebarItem`s. Turns this item into a group that expands and collapses. */
  default?: () => unknown;
  /** A custom 16px icon, e.g. an `<img>` from the AppsCode CDN. Replaces `icon`. */
  icon?: () => unknown;
}>();

const BADGE: Record<Tone | "neutral", string> = {
  neutral: "bg-slate-90 text-label ring-1 ring-border ring-inset",
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

const sidebar = inject<SidebarContext | null>("ac-sidebar", null);
const depth = inject<number>("ac-sidebar-depth", 0);
// Looked up on the app instead of imported, so vue-router stays optional.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined;

const id = useId();
const list = ref<HTMLElement | null>(null);
const childActive = ref(false);
let observer: MutationObserver | null = null;

const hasChildren = computed(() => !!slots.default);
const rail = computed(() => (sidebar?.rail.value ?? false) && depth === 0);
const hover = computed(() =>
  sidebar?.dark.value
    ? "not-aria-[current=page]:hover:bg-white/8 not-aria-[current=page]:hover:text-heading"
    : "not-aria-[current=page]:hover:bg-slate-90 not-aria-[current=page]:hover:text-heading",
);
const tag = computed<Component | string>(() => {
  if (props.to && routerLink && !props.disabled) return routerLink;
  if (props.to || props.href) return "a";
  return "button";
});
const linkAttrs = computed(() => {
  const attrs: Record<string, unknown> = {};
  if (tag.value === routerLink) attrs.to = props.to;
  else if (tag.value === "a") {
    if (props.disabled) {
      attrs.role = "link";
      attrs["aria-disabled"] = "true";
    } else attrs.href = props.href ?? (typeof props.to === "string" ? props.to : undefined);
  } else {
    attrs.type = "button";
    attrs.disabled = props.disabled || undefined;
  }
  // Only set when true, so RouterLink's own exact-match aria-current isn't overwritten.
  if (props.active) attrs["aria-current"] = "page";
  return attrs;
});
const badgeText = computed(() => (props.badge === undefined || props.badge === "" ? "" : String(props.badge)));

function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    return;
  }
  emit("click", e);
  sidebar?.navigate();
}

function onGroupClick() {
  if (rail.value) {
    sidebar?.expand();
    open.value = true;
  } else open.value = !open.value;
}

function syncChildActive() {
  childActive.value = !!list.value?.querySelector('[aria-current="page"]');
}

provide("ac-sidebar-depth", depth + 1);

watch(childActive, (v) => {
  if (v) open.value = true;
});

onMounted(() => {
  if (!list.value) return;
  syncChildActive();
  observer = new MutationObserver(syncChildActive);
  observer.observe(list.value, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-current"] });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <li class="m-0 list-none" data-testid="ac-sidebar-item">
    <component
      :is="tag"
      v-if="!hasChildren"
      v-bind="linkAttrs"
      class="group relative flex w-full items-center gap-2.5 rounded-6 text-left text-base font-normal text-body no-underline transition-colors duration-100 select-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring aria-[current=page]:bg-primary-95 aria-[current=page]:font-medium aria-[current=page]:text-primary-20"
      :class="[
        rail ? 'h-9 justify-center' : 'h-8 px-2.5',
        disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : ['cursor-pointer', hover],
      ]"
      :title="rail ? (badgeText ? `${label} (${badgeText})` : label) : undefined"
      data-testid="ac-sidebar-link"
      @click="onClick"
    >
      <span
        v-if="$slots.icon || icon || rail"
        class="inline-flex size-4 shrink-0 items-center justify-center text-muted transition-colors group-hover:text-heading group-aria-[current=page]:text-primary-30! [&>img]:size-4"
        aria-hidden="true"
      >
        <slot name="icon">
          <component :is="icon" v-if="icon" class="size-4" />
          <span v-else class="text-xs font-semibold">{{ label.charAt(0) }}</span>
        </slot>
      </span>
      <span :class="rail ? 'sr-only' : 'min-w-0 flex-1 truncate'">{{ label }}</span>
      <template v-if="badgeText">
        <span v-if="rail" class="absolute top-1 right-1 size-1.5 rounded-full" :class="DOT[badgeColor]" aria-hidden="true" />
        <span
          v-else
          class="inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-50 px-1.5 text-sm font-medium tabular-nums"
          :class="BADGE[badgeColor]"
        >
          {{ badgeText }}
        </span>
      </template>
    </component>

    <template v-else>
      <button
        type="button"
        class="group relative flex w-full items-center gap-2.5 rounded-6 text-left text-base transition-colors duration-100 select-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        :class="[
          rail ? 'h-9 justify-center' : 'h-8 px-2.5',
          rail && childActive ? 'bg-primary-95 text-primary-20' : childActive ? 'font-medium text-heading' : 'text-body',
          disabled ? 'cursor-not-allowed opacity-50' : ['cursor-pointer', hover],
        ]"
        :disabled="disabled || undefined"
        :aria-expanded="rail ? undefined : open"
        :aria-controls="`${id}-list`"
        :title="rail ? label : undefined"
        data-testid="ac-sidebar-group"
        @click="onGroupClick"
      >
        <span
          v-if="$slots.icon || icon || rail"
          class="inline-flex size-4 shrink-0 items-center justify-center transition-colors group-hover:text-heading [&>img]:size-4"
          :class="childActive ? 'text-primary-30' : 'text-muted'"
          aria-hidden="true"
        >
          <slot name="icon">
            <component :is="icon" v-if="icon" class="size-4" />
            <span v-else class="text-xs font-semibold">{{ label.charAt(0) }}</span>
          </slot>
        </span>
        <span :class="rail ? 'sr-only' : 'min-w-0 flex-1 truncate'">{{ label }}</span>
        <span
          v-if="badgeText && !rail"
          class="inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-50 px-1.5 text-sm font-medium tabular-nums"
          :class="BADGE[badgeColor]"
        >
          {{ badgeText }}
        </span>
        <ChevronRight
          v-if="!rail"
          class="size-3.5 shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none"
          :class="open && 'rotate-90'"
          aria-hidden="true"
        />
      </button>
      <ul
        v-show="open && !rail"
        :id="`${id}-list`"
        ref="list"
        role="list"
        class="mt-0.5 ml-4.5 flex flex-col gap-0.5 border-l border-border pl-2"
      >
        <slot />
      </ul>
    </template>
  </li>
</template>
