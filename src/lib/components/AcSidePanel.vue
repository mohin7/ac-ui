<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { X } from "@lucide/vue";

export interface Props {
  /** Heading of the panel. */
  title?: string;
  /** Optional line under the title. */
  description?: string;
  /** Edge the panel slides in from. */
  side?: "right" | "left";
  /** Width: `small` 400px, `normal` 520px, `large` 800px, `full` the whole viewport. Phones always get the full width. */
  size?: "small" | "normal" | "large" | "full";
  /** Shows the close button and allows Escape to close. Turn off while a required action runs. Old `disable-modal-close` inverted. */
  closable?: boolean;
  /** Closes when the backdrop is clicked. Old `ignore-outside-click` inverted. */
  closeOnOutsideClick?: boolean;
  /** Hides the footer bar. Old `hide-action-footer`. */
  hideFooter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  side: "right",
  size: "normal",
  closable: true,
  closeOnOutsideClick: true,
  hideFooter: false,
});

/** Whether the panel is open. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  /** Fires when the viewer closes the panel (close button, Escape or backdrop). */
  close: [];
}>();

defineSlots<{
  /** Panel body. Scrolls when it's taller than the viewport. Old `#custom-message`. */
  default?: () => unknown;
  /** Replaces the title and description. */
  header?: () => unknown;
  /** Buttons next to the close button, e.g. a docs link. */
  "header-actions"?: () => unknown;
  /** Right-aligned footer buttons: Cancel, then the primary action. Old `#footer-button`. */
  footer?: () => unknown;
  /** Left side of the footer, e.g. a status line. */
  "footer-left"?: () => unknown;
}>();

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const WIDTHS = {
  small: "sm:max-w-100",
  normal: "sm:max-w-130",
  large: "sm:max-w-200",
  full: "",
};

const id = useId();
const panel = ref<HTMLElement | null>(null);
let returnFocus: HTMLElement | null = null;

function close() {
  if (!props.closable) return;
  open.value = false;
  emit("close");
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    // an open select or menu inside handles its own Escape first
    if (e.defaultPrevented) return;
    e.stopPropagation();
    close();
  } else if (e.key === "Tab" && panel.value) {
    const items = [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
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

// Body scroll lock, shared with AcModal through the same counter.
function lock(on: boolean) {
  const body = document.body;
  const count = Number(body.dataset.acModals ?? 0) + (on ? 1 : -1);
  body.dataset.acModals = String(Math.max(count, 0));
  if (on && count === 1) {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
  } else if (!on && count <= 0) {
    body.style.overflow = "";
    body.style.paddingRight = "";
  }
}

watch(
  open,
  async (v, was) => {
    if (v) {
      returnFocus = document.activeElement as HTMLElement | null;
      lock(true);
      await nextTick();
      // `autofocus` may sit on a component's wrapper (e.g. AcInput), so focus the first control inside it.
      const auto = panel.value?.querySelector<HTMLElement>("[autofocus]");
      const target =
        (auto && (auto.matches(FOCUSABLE) ? auto : auto.querySelector<HTMLElement>(FOCUSABLE))) ??
        panel.value?.querySelector<HTMLElement>(`[data-panel-body] ${FOCUSABLE}`) ??
        panel.value;
      target?.focus();
    } else if (was) {
      lock(false);
      returnFocus?.focus?.();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (open.value) lock(false);
});
</script>

<template>
  <Teleport to="body">
    <!-- The root fades; the panel's own transform transition slides it, and is switched off for reduced motion. -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      :enter-from-class="side === 'right' ? 'opacity-0 [&_[data-panel]]:translate-x-full' : 'opacity-0 [&_[data-panel]]:-translate-x-full'"
      leave-active-class="transition-opacity duration-200 ease-in"
      :leave-to-class="side === 'right' ? 'opacity-0 [&_[data-panel]]:translate-x-full' : 'opacity-0 [&_[data-panel]]:-translate-x-full'"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[80] bg-overlay backdrop-blur-[2px]"
        data-ac-ds
        data-testid="ac-side-panel"
        @keydown="onKeydown"
        @mousedown.self="closeOnOutsideClick && close()"
      >
        <div
          ref="panel"
          data-panel
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? `${id}-title` : undefined"
          :aria-describedby="description ? `${id}-desc` : undefined"
          tabindex="-1"
          class="absolute inset-y-0 flex w-full flex-col bg-surface shadow-xl outline-none transition-transform duration-300 ease-out-soft motion-reduce:transition-none"
          :class="[
            side === 'right' ? 'right-0' : 'left-0',
            size !== 'full' && (side === 'right' ? 'border-border sm:border-l' : 'border-border sm:border-r'),
            WIDTHS[size],
          ]"
        >
          <header class="flex shrink-0 items-start gap-4 border-b border-border-light px-5 py-4">
            <div class="min-w-0 flex-1">
              <slot name="header">
                <h4 :id="`${id}-title`" class="text-[16px] leading-6 tracking-[-0.015em]">{{ title }}</h4>
                <p v-if="description" :id="`${id}-desc`" class="mt-0.5 text-base text-muted">{{ description }}</p>
              </slot>
            </div>
            <div class="-mt-0.5 -mr-1.5 flex shrink-0 items-center gap-1">
              <slot name="header-actions" />
              <button
                v-if="closable"
                type="button"
                class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                aria-label="Close"
                data-ac-ds
                data-testid="ac-side-panel-close"
                @click="close"
              >
                <X class="size-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div data-panel-body class="ac-scrollbar min-h-0 flex-1 px-5 py-5">
            <slot />
          </div>

          <footer
            v-if="!hideFooter && ($slots.footer || $slots['footer-left'])"
            class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border-light bg-surface-muted px-5 py-3"
          >
            <div class="flex min-w-0 items-center gap-2"><slot name="footer-left" /></div>
            <div class="ml-auto flex items-center gap-2"><slot name="footer" /></div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
