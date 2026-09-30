<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useId, watch } from "vue";

export interface Props {
  /** The hint text. Keep it to a few words; use the `content` slot for richer text. */
  content?: string;
  /** Preferred side of the trigger. It flips to the opposite side when there isn't room. */
  placement?: "top" | "bottom" | "left" | "right";
  /** Milliseconds to wait on hover before showing. Keyboard focus shows it immediately. */
  delay?: number;
  /** Turns the tooltip off, e.g. while a menu from the same button is open. */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  placement: "top",
  delay: 300,
  disabled: false,
});

const slots = defineSlots<{
  /** The trigger: a button, icon button, link or any focusable element. It gets `aria-describedby`. */
  default?: () => unknown;
  /** Tooltip content instead of the `content` prop. Text only; no links or buttons, since it can't be reached by Tab. */
  content?: () => unknown;
}>();

const OPPOSITE = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
const GAP = 6;
const MARGIN = 8;

const id = useId();
const tipId = `${id}-tip`;
const root = ref<HTMLElement | null>(null);
const tip = ref<HTMLElement | null>(null);
const visible = ref(false);
const side = ref<Props["placement"]>(props.placement);
const position = ref({ top: 0, left: 0 });
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let described: HTMLElement | null = null;

const enabled = computed(() => !props.disabled && !!(props.content || slots.content));

function target() {
  const el = root.value;
  return el?.querySelector<HTMLElement>("button, a[href], input, select, textarea, [tabindex]") ?? (el?.firstElementChild as HTMLElement | null) ?? null;
}

// Adds our id to the trigger's aria-describedby without dropping ids it already has.
function linkTrigger() {
  const el = target();
  if (described && described !== el) unlink(described);
  described = el;
  if (!el) return;
  const ids = (el.getAttribute("aria-describedby") ?? "").split(" ").filter((x) => x && x !== tipId);
  if (enabled.value) ids.push(tipId);
  if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
  else el.removeAttribute("aria-describedby");
}

function unlink(el: HTMLElement) {
  const ids = (el.getAttribute("aria-describedby") ?? "").split(" ").filter((x) => x && x !== tipId);
  if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
  else el.removeAttribute("aria-describedby");
}

function show(wait: number) {
  clearTimeout(hideTimer);
  if (!enabled.value || visible.value) return;
  clearTimeout(showTimer);
  showTimer = setTimeout(async () => {
    visible.value = true;
    await nextTick();
    place();
  }, wait);
}

function hide(wait = 0) {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  if (!wait) visible.value = false;
  else hideTimer = setTimeout(() => (visible.value = false), wait);
}

function fits(s: NonNullable<Props["placement"]>, r: DOMRect, w: number, h: number) {
  if (s === "top") return r.top - GAP - h >= MARGIN;
  if (s === "bottom") return r.bottom + GAP + h <= window.innerHeight - MARGIN;
  if (s === "left") return r.left - GAP - w >= MARGIN;
  return r.right + GAP + w <= window.innerWidth - MARGIN;
}

function place() {
  const el = target() ?? root.value;
  if (!el || !tip.value) return;
  const r = el.getBoundingClientRect();
  const { offsetWidth: w, offsetHeight: h } = tip.value;
  const wanted = props.placement;
  const s = fits(wanted, r, w, h) || !fits(OPPOSITE[wanted], r, w, h) ? wanted : OPPOSITE[wanted];
  const clamp = (v: number, max: number) => Math.max(MARGIN, Math.min(v, max - MARGIN));
  side.value = s;
  position.value =
    s === "top" || s === "bottom"
      ? { top: s === "top" ? r.top - GAP - h : r.bottom + GAP, left: clamp(r.left + r.width / 2 - w / 2, window.innerWidth - w) }
      : { top: clamp(r.top + r.height / 2 - h / 2, window.innerHeight - h), left: s === "left" ? r.left - GAP - w : r.right + GAP };
}

function onPointerEnter(e: PointerEvent) {
  if (e.pointerType !== "touch") show(props.delay);
}

function onFocusIn(e: FocusEvent) {
  // Only keyboard focus shows it at once; a mouse click already went through the hover delay.
  if ((e.target as HTMLElement).matches(":focus-visible")) show(0);
}

function onScroll() {
  hide();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && visible.value) hide();
}

watch(visible, (v) => {
  if (v) {
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("scroll", onScroll, true);
  } else {
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("scroll", onScroll, true);
  }
});
watch(enabled, (v) => {
  linkTrigger();
  if (!v) hide();
});

onMounted(linkTrigger);
onUpdated(linkTrigger);
onBeforeUnmount(() => {
  hide();
  document.removeEventListener("keydown", onKeydown);
  window.removeEventListener("scroll", onScroll, true);
  if (described) unlink(described);
});
</script>

<template>
  <span
    ref="root"
    class="inline-flex max-w-full"
    data-testid="ac-tooltip"
    @pointerenter="onPointerEnter"
    @pointerleave="hide(100)"
    @pointerdown="hide()"
    @focusin="onFocusIn"
    @focusout="hide()"
  >
    <slot />
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-100 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-75 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-show="visible"
          :id="tipId"
          ref="tip"
          role="tooltip"
          class="fixed z-[100] w-max max-w-64 rounded-6 bg-slate-10 px-2 py-1 text-xs font-medium text-slate-95 shadow-md dark:bg-slate-80 dark:text-slate-10 dark:ring-1 dark:ring-slate-70"
          :data-side="side"
          :style="{ top: `${position.top}px`, left: `${position.left}px` }"
          @pointerenter="show(0)"
          @pointerleave="hide(100)"
        >
          <slot name="content">{{ content }}</slot>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
