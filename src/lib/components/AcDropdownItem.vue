<script setup lang="ts">
import { computed, inject, resolveComponent } from "vue";
import type { Component } from "vue";

export interface Props {
  /** Item text. You can also pass content through the default slot. */
  label?: string;
  /** A second, muted line under the label. */
  description?: string;
  /** An icon component shown before the label, e.g. `:icon="Trash2"` from lucide-vue-next. Or use the `icon` slot. */
  icon?: Component;
  /** Keyboard shortcut hint shown at the right, e.g. "⌘D". Display only; bind the key yourself. */
  shortcut?: string;
  /** Red text for destructive actions such as Delete. Confirm them before acting. */
  danger?: boolean;
  /** Disables the item; it's skipped by the arrow keys. */
  disabled?: boolean;
  /** Renders a link to this URL instead of a button. */
  href?: string;
  /** Link target for `href`, e.g. `_blank`. */
  target?: string;
  /** Renders a `RouterLink` to this route instead of a button. Needs vue-router in the app. */
  to?: string | Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  description: "",
  icon: undefined,
  shortcut: "",
  danger: false,
  disabled: false,
  href: undefined,
  target: undefined,
  to: undefined,
});

const emit = defineEmits<{
  /** Fires when the item is chosen by click, Enter or Space. The menu then closes. */
  click: [e: MouseEvent];
}>();

defineSlots<{
  /** Item content, after the icon and `label`. */
  default?: () => unknown;
  /** A 16px icon before the label. */
  icon?: () => unknown;
}>();

const menu = inject<{ close: (refocus?: boolean) => void; focusMenu: () => void } | null>("ac-dropdown", null);
// Resolved once: only apps that pass `to` need vue-router installed.
const routerLink = props.to ? resolveComponent("RouterLink") : null;

const tag = computed(() => {
  if (props.disabled) return "button";
  if (props.to && routerLink) return routerLink;
  return props.href ? "a" : "button";
});

function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    return;
  }
  emit("click", e);
  menu?.close();
}

// Hover moves focus, so the keyboard and pointer highlight are always the same item.
function onPointerMove(e: PointerEvent) {
  if (props.disabled || e.pointerType === "touch") return;
  const el = e.currentTarget as HTMLElement;
  if (document.activeElement !== el) el.focus({ preventScroll: true });
}

function onPointerLeave(e: PointerEvent) {
  if (e.pointerType !== "touch" && document.activeElement === e.currentTarget) menu?.focusMenu();
}
</script>

<template>
  <component
    :is="tag"
    role="menuitem"
    tabindex="-1"
    :type="tag === 'button' ? 'button' : undefined"
    :href="tag === 'a' ? href : undefined"
    :target="tag === 'a' ? target : undefined"
    :to="tag === routerLink ? to : undefined"
    :disabled="(tag === 'button' && disabled) || undefined"
    :aria-disabled="disabled || undefined"
    :data-ac-label="label || undefined"
    class="flex w-full cursor-pointer items-start gap-2.5 rounded-6 px-2.5 py-1.5 text-left text-base no-underline outline-none select-none transition-colors duration-75 disabled:cursor-not-allowed disabled:opacity-40"
    :class="danger ? 'text-red-30 focus:bg-red-95 focus:text-red-20' : 'text-heading focus:bg-surface-sunken'"
    data-ac-ds
    data-testid="ac-dropdown-item"
    @click="onClick"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <span
      v-if="icon || $slots.icon"
      class="mt-0.5 inline-flex shrink-0 [&_svg]:size-4"
      :class="danger ? 'text-current' : 'text-muted'"
      aria-hidden="true"
    >
      <slot name="icon"><component :is="icon" /></slot>
    </span>
    <span class="min-w-0 flex-1">
      <span class="block truncate">
        {{ label }}<slot />
      </span>
      <span v-if="description" class="block text-xs text-muted">{{ description }}</span>
    </span>
    <kbd v-if="shortcut" class="mt-0.5 shrink-0 font-sans text-xs text-muted">{{ shortcut }}</kbd>
  </component>
</template>
