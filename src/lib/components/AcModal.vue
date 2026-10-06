<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { X } from "lucide-vue-next";

export interface Props {
  /** Heading of the dialog. */
  title?: string;
  /** Optional line under the title. */
  description?: string;
  /** Width: `small` 440px, `normal` 520px, `medium` 800px, `large` 1000px, `full` viewport minus 64px. */
  size?: "small" | "normal" | "medium" | "large" | "full";
  /** Shows the close button and allows Escape to close. Turn off while a required action runs. */
  closable?: boolean;
  /** Closes when the backdrop is clicked. */
  closeOnOutsideClick?: boolean;
  /** Hides the footer bar. */
  hideFooter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  size: "normal",
  closable: true,
  closeOnOutsideClick: true,
  hideFooter: false,
});

const emit = defineEmits<{ close: [] }>();

defineSlots<{
  /** Dialog body. Scrolls when it's taller than the viewport. */
  default?: () => unknown;
  /** Replaces the title and description. */
  header?: () => unknown;
  /** Buttons next to the close button, e.g. a docs link. */
  "header-actions"?: () => unknown;
  /** Right-aligned footer buttons: Cancel, then the primary action. */
  footer?: () => unknown;
  /** Left side of the footer, e.g. a "Don't show again" checkbox. */
  "footer-left"?: () => unknown;
}>();

/** Whether the dialog is open. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: false });

const id = useId();
const panel = ref<HTMLElement | null>(null);
let returnFocus: HTMLElement | null = null;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const close = () => {
  if (!props.closable) return;
  open.value = false;
  emit("close");
};

const onKeydown = (e: KeyboardEvent) => {
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
};

// Body scroll lock, shared by every open modal.
const lock = (on: boolean) => {
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
};

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
        panel.value?.querySelector<HTMLElement>(`[data-modal-body] ${FOCUSABLE}`) ??
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

const widths = {
  small: "max-w-110",
  normal: "max-w-130",
  medium: "max-w-200",
  large: "max-w-250",
  full: "max-w-[calc(100vw-64px)]",
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[80] overflow-y-auto bg-overlay backdrop-blur-[2px]"
        data-ac-ds
        data-testid="ac-modal"
        @keydown="onKeydown"
        @mousedown.self="closeOnOutsideClick && close()"
      >
        <div class="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-8" @mousedown.self="closeOnOutsideClick && close()">
          <div
            ref="panel"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? `${id}-title` : undefined"
            :aria-describedby="description ? `${id}-desc` : undefined"
            tabindex="-1"
            class="relative flex max-h-[calc(100dvh-32px)] w-full animate-pop-in flex-col rounded-12 border border-border bg-surface shadow-xl outline-none sm:max-h-[calc(100dvh-64px)]"
            :class="widths[size]"
          >
            <header class="flex shrink-0 items-start gap-4 border-b border-border-light px-5 py-4">
              <div class="min-w-0 flex-1">
                <slot name="header">
                  <h4 :id="`${id}-title`" class="text-xl leading-6 tracking-[-0.015em]">{{ title }}</h4>
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
                  data-testid="ac-modal-close"
                  @click="close"
                >
                  <X class="size-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div data-modal-body class="ac-scrollbar min-h-0 flex-1 px-5 py-5">
              <slot />
            </div>

            <footer
              v-if="!hideFooter && ($slots.footer || $slots['footer-left'])"
              class="flex shrink-0 items-center justify-between gap-3 rounded-b-12 border-t border-border-light bg-surface-muted px-5 py-3"
            >
              <div class="flex min-w-0 items-center gap-2"><slot name="footer-left" /></div>
              <div class="flex items-center gap-2"><slot name="footer" /></div>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
