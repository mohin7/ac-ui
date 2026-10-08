<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, useId, watch } from "vue";
import { ChevronDown, EllipsisVertical } from "@lucide/vue";
import AcButton from "./AcButton.vue";

export interface Props {
  /** Text of the default trigger button. Without it (and without a `trigger` slot) a ⋮ icon button is shown. */
  label?: string;
  /** Accessible name of the menu and of the ⋮ trigger, e.g. "Actions for demo-postgres". */
  menuLabel?: string;
  /** Which edge of the trigger the menu lines up with. Use `end` for menus at the right of a row. Old `is-right`. */
  align?: "start" | "end";
  /** Preferred side. The menu flips when there isn't room. Old `is-up`. */
  placement?: "bottom" | "top";
  /** Disables the default trigger and stops the menu opening. */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  menuLabel: "Actions",
  align: "start",
  placement: "bottom",
  disabled: false,
});

/** Whether the menu is open. Bind with `v-model:open` to open or close it from code. */
const open = defineModel<boolean>("open", { default: false });

const slots = defineSlots<{
  /** Custom trigger, usually an `AcButton`. It gets the menu-button ARIA attributes and keys; don't add your own click toggle. */
  trigger?: (props: { open: boolean }) => unknown;
  /** The menu: `AcDropdownItem`s and `AcDropdownDivider`s. */
  default?: () => unknown;
}>();

const ITEM = '[role="menuitem"]:not([aria-disabled="true"])';

const id = useId();
const menuId = `${id}-menu`;
const root = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const style = ref<Record<string, string>>({});
const fromTop = ref(false);
const triggerId = ref("");
let triggerEl: HTMLElement | null = null;
let focusOnOpen: "menu" | "first" | "last" = "menu";
let typeahead = "";
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

function linkTrigger() {
  triggerEl = root.value?.querySelector<HTMLElement>("button, a[href], [tabindex]") ?? null;
  if (!triggerEl) return;
  if (!triggerEl.id) triggerEl.id = `${id}-trigger`;
  triggerId.value = triggerEl.id;
  triggerEl.setAttribute("aria-haspopup", "menu");
  triggerEl.setAttribute("aria-expanded", String(open.value));
  if (open.value) triggerEl.setAttribute("aria-controls", menuId);
  else triggerEl.removeAttribute("aria-controls");
}

function items() {
  return [...(panel.value?.querySelectorAll<HTMLElement>(ITEM) ?? [])];
}

function focusItem(which: "first" | "last" | number) {
  const list = items();
  if (!list.length) return panel.value?.focus();
  const i = which === "first" ? 0 : which === "last" ? list.length - 1 : (which + list.length) % list.length;
  list[i]?.focus();
}

function show(focus: typeof focusOnOpen) {
  if (props.disabled) return;
  focusOnOpen = focus;
  open.value = true;
}

function close(refocus = true) {
  if (!open.value) return;
  open.value = false;
  if (refocus) triggerEl?.focus();
}

function place() {
  if (!triggerEl || !panel.value) return;
  const r = triggerEl.getBoundingClientRect();
  const gap = 4;
  const margin = 8;
  // Set the width floor before measuring, so the measured width is the one that will render.
  const minWidth = `${Math.min(Math.max(r.width, 192), window.innerWidth - margin * 2)}px`;
  panel.value.style.minWidth = minWidth;
  const { offsetWidth: w, offsetHeight: h } = panel.value;
  const below = window.innerHeight - r.bottom - gap - margin;
  const above = r.top - gap - margin;
  const up = props.placement === "top" ? above >= h || above > below : below < h && above > below;
  const left = props.align === "end" ? r.right - w : r.left;
  fromTop.value = !up;
  style.value = {
    [up ? "bottom" : "top"]: `${up ? window.innerHeight - r.top + gap : r.bottom + gap}px`,
    left: `${Math.max(margin, Math.min(left, window.innerWidth - w - margin))}px`,
    minWidth,
    maxHeight: `${Math.max(up ? above : below, 120)}px`,
  };
}

function onTriggerClick(e: MouseEvent) {
  if (!triggerEl?.contains(e.target as Node)) return;
  if (open.value) return close();
  // detail is 0 when Enter or Space fired the click
  show(e.detail === 0 ? "first" : "menu");
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  e.preventDefault();
  if (open.value) return focusItem(e.key === "ArrowDown" ? "first" : "last");
  show(e.key === "ArrowDown" ? "first" : "last");
}

function onMenuKeydown(e: KeyboardEvent) {
  const list = items();
  const current = list.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const delta = e.key === "ArrowDown" ? 1 : -1;
    focusItem(current < 0 ? (delta > 0 ? "first" : "last") : current + delta);
  } else if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    focusItem(e.key === "Home" ? "first" : "last");
  } else if (e.key === "Escape") {
    // defaultPrevented tells an enclosing AcModal or AcSidePanel not to close too
    e.preventDefault();
    close();
  } else if (e.key === "Tab") {
    // Focusing the trigger first makes Tab continue from it rather than from the end of <body>.
    close();
  } else if (e.key === " " && current >= 0 && list[current]!.tagName !== "BUTTON") {
    e.preventDefault();
    list[current]!.click();
  } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && e.key !== " ") {
    jumpTo(e.key, list, current);
  }
}

function jumpTo(key: string, list: HTMLElement[], current: number) {
  typeahead += key.toLowerCase();
  clearTimeout(typeaheadTimer);
  typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
  const labelOf = (el: HTMLElement) => (el.dataset.acLabel || el.textContent || "").trim().toLowerCase();
  // A repeated single letter cycles through the items that start with it.
  const start = typeahead.length === 1 ? current + 1 : Math.max(current, 0);
  const ordered = [...list.slice(start), ...list.slice(0, start)];
  ordered.find((el) => labelOf(el).startsWith(typeahead))?.focus();
}

function onPointerDown(e: PointerEvent) {
  const t = e.target as Node;
  if (root.value?.contains(t) || panel.value?.contains(t)) return;
  close(false);
}

function onViewportChange(e?: Event) {
  if (e && panel.value?.contains(e.target as Node)) return;
  place();
}

function listen(on: boolean) {
  if (on) {
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
  } else {
    document.removeEventListener("pointerdown", onPointerDown, true);
    window.removeEventListener("scroll", onViewportChange, true);
    window.removeEventListener("resize", onViewportChange);
  }
}

provide("ac-dropdown", { close, focusMenu: () => panel.value?.focus() });

watch(open, async (v) => {
  linkTrigger();
  listen(v);
  if (!v) return;
  await nextTick();
  place();
  if (focusOnOpen === "menu") panel.value?.focus();
  else focusItem(focusOnOpen);
  focusOnOpen = "menu";
});

onMounted(linkTrigger);
onUpdated(linkTrigger);
onBeforeUnmount(() => {
  listen(false);
  clearTimeout(typeaheadTimer);
});
</script>

<template>
  <div ref="root" class="inline-flex" data-ac-ds data-testid="ac-dropdown" @click="onTriggerClick" @keydown="onTriggerKeydown">
    <slot v-if="slots.trigger" name="trigger" :open="open" />
    <AcButton v-else-if="label" :title="label" color="white" :disabled="disabled">
      <ChevronDown class="-mr-1 text-muted transition-transform duration-200" :class="open && 'rotate-180'" aria-hidden="true" />
    </AcButton>
    <button
      v-else
      type="button"
      :aria-label="menuLabel"
      :disabled="disabled"
      class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      :class="open && 'bg-surface-sunken text-heading'"
    >
      <EllipsisVertical class="size-4" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        :enter-from-class="`opacity-0 motion-safe:scale-[0.98] ${fromTop ? 'motion-safe:-translate-y-1' : 'motion-safe:translate-y-1'}`"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          :id="menuId"
          ref="panel"
          role="menu"
          tabindex="-1"
          aria-orientation="vertical"
          :aria-labelledby="(slots.trigger || label) && triggerId ? triggerId : undefined"
          :aria-label="slots.trigger || label ? undefined : menuLabel"
          class="ac-scrollbar fixed z-[90] flex w-max max-w-[min(320px,calc(100vw-16px))] flex-col rounded-8 border border-border bg-surface p-1 shadow-lg outline-none"
          :class="fromTop ? 'origin-top' : 'origin-bottom'"
          :style="style"
          data-ac-ds
          data-testid="ac-dropdown-menu"
          @keydown="onMenuKeydown"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
