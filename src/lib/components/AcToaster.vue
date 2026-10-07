<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "@lucide/vue";
import AcButton from "./AcButton.vue";
import { useToast } from "../composables/useToast";
import type { Toast, ToastTone } from "../composables/useToast";

export interface Props {
  /** Corner of the screen. On phones (under 640px) toasts span the width at the same top or bottom edge. */
  position?: "bottom-right" | "bottom-center" | "top-right" | "top-center";
  /** How many toasts show at once (phones show at most 3). Newer ones queue behind and their timers wait until they're shown. */
  max?: number;
  /** Accessible name of the notification region. */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom-right",
  max: 5,
  label: "Notifications",
});

// A tinted surface and hairline in the status hue, like AcAlert. The tint is a gradient laid over the solid
// surface colour, so a toast stays opaque in dark mode where the tint tokens are translucent.
const tint = (shade: string) => `bg-surface bg-[image:linear-gradient(var(--color-${shade}),var(--color-${shade}))]`;
const TONES: Record<ToastTone, { icon?: typeof Info; icon_class: string; box: string; title: string; text: string }> = {
  neutral: { icon_class: "", box: "border-border bg-surface", title: "text-heading", text: "text-muted" },
  success: { icon: CircleCheck, icon_class: "text-green-40", box: `border-green-80 ${tint("green-95")}`, title: "text-green-10", text: "text-green-20" },
  error: { icon: CircleAlert, icon_class: "text-red-40", box: `border-red-80 ${tint("red-95")}`, title: "text-red-10", text: "text-red-20" },
  warning: { icon: TriangleAlert, icon_class: "text-yellow-50", box: `border-yellow-70 ${tint("yellow-95")}`, title: "text-yellow-10", text: "text-yellow-20" },
  info: { icon: Info, icon_class: "text-blue-50", box: `border-blue-80 ${tint("blue-95")}`, title: "text-blue-10", text: "text-blue-20" },
};
// Phones show only the newest few so the stack doesn't cover the page.
const PHONE_MAX = 3;
const POSITIONS = {
  "bottom-right": "bottom-3 sm:bottom-6 sm:right-6",
  "bottom-center": "bottom-3 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2",
  "top-right": "top-3 sm:top-6 sm:right-6",
  "top-center": "top-3 sm:top-6 sm:left-1/2 sm:-translate-x-1/2",
} as const;

const { toasts, dismiss } = useToast();

const politeText = ref("");
const assertiveText = ref("");
const timers = new Map<string, { version: number; remaining: number; started: number; handle?: ReturnType<typeof setTimeout> }>();
let paused = false;
let announced = new Set<string>();

const atTop = computed(() => props.position.startsWith("top"));
// Newest toast sits nearest the screen edge.
const shown = computed(() => {
  const visible = toasts.value.slice(-props.max);
  return atTop.value ? [...visible].reverse() : visible;
});

function start(id: string) {
  const t = timers.get(id);
  if (!t || paused) return;
  t.started = Date.now();
  t.handle = setTimeout(() => dismiss(id), t.remaining);
}

function stop(id: string) {
  const t = timers.get(id);
  if (!t?.handle) return;
  clearTimeout(t.handle);
  t.handle = undefined;
  t.remaining -= Date.now() - t.started;
}

function pause() {
  paused = true;
  timers.forEach((_, id) => stop(id));
}

function resume() {
  paused = false;
  timers.forEach((_, id) => start(id));
}

function onFocusOut(e: FocusEvent) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) resume();
}

function sync(list: readonly Toast[]) {
  const ids = new Set(list.map((t) => t.id));
  for (const [id] of timers) {
    if (!ids.has(id)) {
      stop(id);
      timers.delete(id);
    }
  }
  for (const t of list) {
    const current = timers.get(t.id);
    if (current?.version === t.version) continue;
    stop(t.id);
    timers.delete(t.id);
    if (t.duration > 0) {
      timers.set(t.id, { version: t.version, remaining: t.duration, started: 0 });
      start(t.id);
    }
  }
}

// Text goes to hidden live regions that always exist, so each toast is read exactly once, errors assertively.
async function announce(list: readonly Toast[]) {
  const fresh = list.filter((t) => !announced.has(`${t.id}:${t.version}`));
  announced = new Set(list.map((t) => `${t.id}:${t.version}`));
  if (!fresh.length) return;
  const sentence = (s: string) => (/[.!?…]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);
  const text = (items: Toast[]) => items.flatMap((t) => [t.title, t.description ?? ""].filter(Boolean).map(sentence)).join(" ");
  const errors = fresh.filter((t) => t.tone === "error");
  const others = fresh.filter((t) => t.tone !== "error");
  politeText.value = "";
  assertiveText.value = "";
  await nextTick();
  if (others.length) politeText.value = text(others);
  if (errors.length) assertiveText.value = text(errors);
}

function runAction(t: Toast) {
  t.action?.onClick();
  dismiss(t.id);
}

watch(
  shown,
  (list) => {
    sync(list);
    announce(list);
  },
  { immediate: true },
);

onBeforeUnmount(() => timers.forEach((t) => clearTimeout(t.handle)));
</script>

<template>
  <Teleport to="body">
    <section :aria-label="label" data-ac-ds data-testid="ac-toaster">
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ politeText }}</div>
      <div class="sr-only" role="alert" aria-live="assertive" aria-atomic="true">{{ assertiveText }}</div>
      <TransitionGroup
        tag="ol"
        class="pointer-events-none fixed inset-x-3 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:w-89"
        :class="POSITIONS[position]"
        enter-active-class="transition duration-200 ease-out"
        :enter-from-class="`opacity-0 ${atTop ? 'motion-safe:-translate-y-2' : 'motion-safe:translate-y-2'}`"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0 motion-safe:scale-95"
        move-class="motion-safe:transition-transform motion-safe:duration-200"
        @pointerenter="pause"
        @pointerleave="resume"
        @focusin="pause"
        @focusout="onFocusOut"
      >
        <li
          v-for="(t, i) in shown"
          :key="t.id"
          class="pointer-events-auto flex items-start gap-3 rounded-10 border py-3 pr-2.5 pl-3.5 shadow-lg"
          :class="[TONES[t.tone].box, (atTop ? i : shown.length - 1 - i) >= PHONE_MAX && 'max-sm:hidden']"
          data-ac-ds
          data-testid="ac-toast"
          :data-tone="t.tone"
        >
          <component :is="TONES[t.tone].icon" v-if="TONES[t.tone].icon" class="mt-0.5 size-4 shrink-0" :class="TONES[t.tone].icon_class" aria-hidden="true" />
          <div class="min-w-0 flex-1 py-px">
            <p class="text-base font-medium" :class="TONES[t.tone].title">{{ t.title }}</p>
            <p v-if="t.description" class="mt-0.5 text-base" :class="TONES[t.tone].text">{{ t.description }}</p>
          </div>
          <AcButton v-if="t.action" :title="t.action.label" size="small" color="white" class="shrink-0" @click="runAction(t)" />
          <button
            v-if="t.dismissible"
            type="button"
            class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-6 opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
            :aria-label="`Dismiss: ${t.title}`"
            @click="dismiss(t.id)"
          >
            <X class="size-3.5" aria-hidden="true" />
          </button>
        </li>
      </TransitionGroup>
    </section>
  </Teleport>
</template>
