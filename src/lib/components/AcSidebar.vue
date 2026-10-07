<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { PanelLeftClose, PanelLeftOpen, X } from "@lucide/vue";

export interface Props {
  /** Accessible name of the navigation landmark. */
  label?: string;
  /** Dark sidebar on `bg-sidebar` in both themes, like the old library's default look. Everything inside uses the dark tokens. */
  dark?: boolean;
  /** Shows a Collapse button at the bottom that toggles `v-model:collapsed`. It's hidden in the mobile drawer. */
  collapsible?: boolean;
  /** Keeps the sidebar inside its parent instead of the viewport: the mobile drawer and backdrop use `absolute`, and the mobile layout follows the parent's width. Give the parent `relative`, `overflow-hidden` and a height. For previews and embedded shells. */
  contained?: boolean;
  /** Width in px below which the sidebar becomes an off-canvas drawer: the window's width, or the parent's with `contained`. `0` keeps it docked. */
  breakpoint?: number;
  /** With the sidebar collapsed to the rail, opens it to full width over the page while the pointer or keyboard focus is inside, then folds it back. The page doesn't shift. */
  hoverExpand?: boolean;
  /** Offset from the top of the viewport on desktop, e.g. `"56px"` under a full-width navbar. The height shrinks to match. */
  top?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  label: "Main",
  dark: false,
  collapsible: true,
  contained: false,
  breakpoint: 768,
  hoverExpand: false,
  top: "0px",
});

/** Icon-only 56px rail on desktop. Bind with `v-model:collapsed`. */
const collapsed = defineModel<boolean>("collapsed", { default: false });
/** Whether the off-canvas drawer is open (below `breakpoint`). Bind with `v-model:mobile-open`. */
const mobileOpen = defineModel<boolean>("mobileOpen", { default: false });

defineSlots<{
  /** The 56px top bar: logo or cluster switcher. Receives `collapsed` so you can show a small logo in the rail. */
  header?: (props: { collapsed: boolean }) => unknown;
  /** Sections (`AcSidebarSection`) and items (`AcSidebarItem`). Rendered inside a list. */
  default?: () => unknown;
  /** Items pinned to the bottom, such as Help. Rendered inside a list, above the Collapse button. */
  footer?: (props: { collapsed: boolean }) => unknown;
}>();

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const root = ref<HTMLElement | null>(null);
const nav = ref<HTMLElement | null>(null);
// Read synchronously so a phone never paints the desktop layout first.
const isMobile = ref(!props.contained && typeof window !== "undefined" && window.matchMedia(mobileQuery()).matches);
let returnFocus: HTMLElement | null = null;
let media: MediaQueryList | null = null;
let observer: ResizeObserver | null = null;

// Hover-expand: the pointer or focus is inside a collapsed sidebar, so it opens over the page.
const hovering = ref(false);
const peek = computed(() => props.hoverExpand && collapsed.value && !isMobile.value && hovering.value);
const rail = computed(() => collapsed.value && !isMobile.value && !peek.value);
// The sidebar is set to the rail, even while it's opened over the page.
const railSet = computed(() => collapsed.value && !isMobile.value);
// After the Collapse button is used, don't reopen until the pointer has left and come back.
let suppressPeek = false;
const PEEK_IN_MS = 120;
const PEEK_OUT_MS = 180;
let peekTimer: ReturnType<typeof setTimeout> | undefined;

function setHovering(on: boolean) {
  if (!props.hoverExpand) return;
  if (on && suppressPeek) return;
  clearTimeout(peekTimer);
  peekTimer = setTimeout(() => (hovering.value = on), on ? PEEK_IN_MS : PEEK_OUT_MS);
}

function toggleCollapsed() {
  suppressPeek = true;
  clearTimeout(peekTimer);
  hovering.value = false;
  collapsed.value = !collapsed.value;
}

function onMouseleave() {
  suppressPeek = false;
  setHovering(false);
}

function onFocusout(e: FocusEvent) {
  // Focus moving to another element inside the sidebar keeps it open.
  if (!root.value?.contains(e.relatedTarget as Node | null)) setHovering(false);
}
const drawerOpen = computed(() => isMobile.value && mobileOpen.value);
const dark = computed(() => props.dark);
const rootStyle = computed(() =>
  isMobile.value || props.contained ? undefined : { top: props.top, height: `calc(100dvh - ${props.top})` },
);

const rootClass = computed(() => {
  const look = props.dark ? "dark border-r border-border-light bg-sidebar text-body" : "border-r border-border-light bg-surface-muted text-body";
  if (isMobile.value) {
    return [
      look,
      props.contained ? "absolute" : "fixed",
      "inset-y-0 left-0 z-[80] w-60 max-w-[85%] shadow-xl duration-200 ease-out-soft motion-reduce:transition-none",
      // Visible at once when opening so focus can move in; hidden only after the slide-out.
      mobileOpen.value ? "visible translate-x-0 transition-[translate]" : "invisible -translate-x-full transition-[translate,visibility]",
    ];
  }
  return [
    look,
    // Open over the page; the spacer in the template keeps the page's 56px.
    peek.value ? [props.contained ? "absolute inset-y-0 left-0" : "fixed left-0", "z-30 shadow-xl"] : props.contained ? "relative h-full" : "sticky",
    "transition-[width] duration-200 ease-out-soft motion-reduce:transition-none",
    rail.value ? "w-14" : "w-60",
  ];
});

function mobileQuery() {
  return `(max-width: ${props.breakpoint - 0.02}px)`;
}

/** Collapses or expands on desktop, and opens or closes the drawer on mobile. Wire it to a navbar menu button. */
function toggle() {
  if (isMobile.value) mobileOpen.value = !mobileOpen.value;
  else collapsed.value = !collapsed.value;
}

function expand() {
  collapsed.value = false;
}

function navigate() {
  if (isMobile.value) mobileOpen.value = false;
}

function closeDrawer() {
  mobileOpen.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (!drawerOpen.value || !root.value) return;
  if (e.key === "Escape") {
    e.stopPropagation();
    closeDrawer();
  } else if (e.key === "Tab") {
    const items = [...root.value.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0]!;
    const last = items[items.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function onMediaChange(e: MediaQueryListEvent) {
  isMobile.value = e.matches;
}

// Shares AcModal's counter so a modal opened from the drawer doesn't unlock the page early.
function lockScroll(on: boolean) {
  const body = document.body;
  const count = Number(body.dataset.acModals ?? 0) + (on ? 1 : -1);
  body.dataset.acModals = String(Math.max(count, 0));
  if (on && count === 1) body.style.overflow = "hidden";
  else if (!on && count <= 0) body.style.overflow = "";
}

// Scrolls only the nav, never the page, so the current item is visible in long menus.
function revealActive() {
  const list = nav.value;
  const el = list?.querySelector<HTMLElement>('[aria-current="page"]');
  if (!list || !el) return;
  const offset = el.getBoundingClientRect().top - list.getBoundingClientRect().top;
  if (offset < 0 || offset > list.clientHeight - el.offsetHeight) list.scrollTop += offset - list.clientHeight / 2;
}

provide("ac-sidebar", { rail, isMobile, dark, expand, navigate });

watch(drawerOpen, async (open, was) => {
  if (open) {
    returnFocus = document.activeElement as HTMLElement | null;
    if (!props.contained) lockScroll(true);
    await nextTick();
    const target = root.value?.querySelector<HTMLElement>('[aria-current="page"]') ?? root.value?.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();
  } else if (was) {
    if (!props.contained) lockScroll(false);
    returnFocus?.focus?.();
  }
});

watch(isMobile, (mobile) => {
  if (!mobile) mobileOpen.value = false;
});

onMounted(() => {
  if (props.contained) {
    const parent = root.value?.parentElement;
    if (parent) {
      observer = new ResizeObserver(([entry]) => (isMobile.value = (entry?.contentRect.width ?? 0) < props.breakpoint));
      observer.observe(parent);
    }
  } else {
    media = window.matchMedia(mobileQuery());
    isMobile.value = media.matches;
    media.addEventListener("change", onMediaChange);
  }
  revealActive();
});

onBeforeUnmount(() => {
  clearTimeout(peekTimer);
  media?.removeEventListener("change", onMediaChange);
  observer?.disconnect();
  if (drawerOpen.value && !props.contained) lockScroll(false);
});

defineExpose({ toggle });
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-150"
    leave-to-class="opacity-0"
  >
    <div
      v-if="drawerOpen"
      class="inset-0 z-[79] bg-overlay"
      :class="contained ? 'absolute' : 'fixed'"
      aria-hidden="true"
      data-ac-ds
      data-testid="ac-sidebar-backdrop"
      @click="closeDrawer"
    />
  </Transition>

  <!-- keeps the page where it was while the sidebar opens over it -->
  <div v-if="peek" class="w-14 shrink-0" :class="contained && 'h-full'" aria-hidden="true" data-ac-ds />

  <aside
    ref="root"
    v-bind="$attrs"
    class="flex shrink-0 flex-col overflow-hidden"
    :class="rootClass"
    :style="rootStyle"
    :role="drawerOpen ? 'dialog' : undefined"
    :aria-modal="drawerOpen || undefined"
    :aria-label="drawerOpen ? label : undefined"
    data-ac-ds
    data-testid="ac-sidebar"
    @keydown="onKeydown"
    @mouseenter="setHovering(true)"
    @mouseleave="onMouseleave"
    @focusin="setHovering(true)"
    @focusout="onFocusout"
  >
    <div
      v-if="$slots.header || isMobile"
      class="flex h-14 shrink-0 items-center gap-2 overflow-hidden border-b border-border-light"
      :class="rail ? 'justify-center px-2' : 'px-4'"
    >
      <div class="flex min-w-0 flex-1 items-center" :class="rail && 'justify-center'">
        <slot name="header" :collapsed="rail" />
      </div>
      <button
        v-if="isMobile"
        type="button"
        class="-mr-1.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        :class="dark ? 'hover:bg-white/8' : 'hover:bg-slate-90'"
        aria-label="Close navigation"
        data-ac-ds
        data-testid="ac-sidebar-close"
        @click="closeDrawer"
      >
        <X class="size-4" aria-hidden="true" />
      </button>
    </div>

    <nav ref="nav" :aria-label="label" class="ac-scrollbar min-h-0 flex-1 overflow-x-hidden py-3" :class="rail ? 'px-2' : 'px-3'">
      <ul role="list" class="flex flex-col gap-0.5">
        <slot />
      </ul>
    </nav>

    <div
      v-if="$slots.footer || (collapsible && !isMobile)"
      class="flex shrink-0 flex-col gap-0.5 border-t border-border-light py-2"
      :class="rail ? 'px-2' : 'px-3'"
    >
      <ul v-if="$slots.footer" role="list" class="flex flex-col gap-0.5">
        <slot name="footer" :collapsed="rail" />
      </ul>
      <button
        v-if="collapsible && !isMobile"
        type="button"
        class="flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-6 text-base text-label transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        :class="[rail ? 'justify-center' : 'px-2.5', dark ? 'hover:bg-white/8' : 'hover:bg-slate-90']"
        :aria-label="railSet ? 'Expand sidebar' : 'Collapse sidebar'"
        :title="rail ? 'Expand sidebar' : undefined"
        data-ac-ds
        data-testid="ac-sidebar-collapse"
        @click="toggleCollapsed"
      >
        <component :is="railSet ? PanelLeftOpen : PanelLeftClose" class="size-4 shrink-0 text-muted" aria-hidden="true" />
        <span v-if="!rail">{{ railSet ? "Expand" : "Collapse" }}</span>
      </button>
    </div>
  </aside>
</template>
