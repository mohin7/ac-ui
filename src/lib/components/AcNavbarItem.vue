<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import type { Component } from "vue";

export interface Props {
  /** Text of the item. With `iconOnly` it becomes the tooltip and the accessible name. */
  label: string;
  /** A Lucide icon component, e.g. `:icon="Terminal"`. */
  icon?: Component;
  /** Shows only the icon in a 32px square button, for navbar actions such as Terminal or Notifications. */
  iconOnly?: boolean;
  /** Route to link to. Renders `RouterLink` when vue-router is installed in the app, otherwise a plain link (string routes only). */
  to?: string | object;
  /** Plain URL, for pages outside the app. */
  href?: string;
  /** Marks the current section: highlighted and `aria-current="page"`. With `to` and vue-router, an exact route match does this for you. */
  active?: boolean;
  /** A count, e.g. unread notifications. Shown as a red bubble on icon-only items; above 999 it reads `999+`. */
  badge?: string | number;
  /** Greys the item out and blocks clicks. */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  iconOnly: false,
  to: undefined,
  href: undefined,
  active: false,
  badge: undefined,
  disabled: false,
});

const emit = defineEmits<{ click: [e: MouseEvent] }>();

defineSlots<{
  /** Replaces the label text. */
  default?: () => unknown;
}>();

// Looked up on the app instead of imported, so vue-router stays optional.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined;

const tag = computed<Component | string>(() => {
  if (props.to && routerLink && !props.disabled) return routerLink;
  if (props.to || props.href) return "a";
  return "button";
});
const badgeText = computed(() => {
  if (props.badge === undefined || props.badge === "" || props.badge === 0) return "";
  return typeof props.badge === "number" && props.badge > 999 ? "999+" : String(props.badge);
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
  if (props.iconOnly) attrs["aria-label"] = badgeText.value ? `${props.label} (${badgeText.value})` : props.label;
  return attrs;
});

function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    return;
  }
  emit("click", e);
}
</script>

<template>
  <component
    :is="tag"
    v-bind="linkAttrs"
    class="relative inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-6 text-base font-medium whitespace-nowrap text-label no-underline transition-colors duration-100 select-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring aria-[current=page]:bg-surface-sunken aria-[current=page]:text-heading"
    :class="[
      iconOnly ? 'w-8' : 'px-3',
      disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-surface-sunken hover:text-heading',
    ]"
    :title="iconOnly ? label : undefined"
    data-ac-ds
    data-testid="ac-navbar-item"
    @click="onClick"
  >
    <component :is="icon" v-if="icon" class="size-4 shrink-0" aria-hidden="true" />
    <span v-if="!iconOnly"><slot>{{ label }}</slot></span>
    <template v-if="badgeText">
      <span
        v-if="iconOnly"
        class="absolute -top-0.5 left-4 inline-flex h-4 min-w-4 items-center justify-center rounded-50 bg-danger px-1 text-xm font-semibold text-white tabular-nums ring-2 ring-surface"
        aria-hidden="true"
      >
        {{ badgeText }}
      </span>
      <span
        v-else
        class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-50 bg-slate-90 px-1.5 text-sm font-medium text-label tabular-nums ring-1 ring-border ring-inset"
      >
        {{ badgeText }}
      </span>
    </template>
  </component>
</template>
