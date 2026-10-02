<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight, CircleAlert, Info, Megaphone, TriangleAlert, X } from "lucide-vue-next";
import type { Component } from "vue";

export interface Props {
  /** Colour of the strip. `danger` and `warning` are announced to screen readers as alerts. */
  color?: "info" | "warning" | "danger" | "primary" | "neutral";
  /** `subtle` tinted strip with a hairline, or `solid` full-colour fill for app-wide announcements. */
  variant?: "subtle" | "solid";
  /** Bold lead-in before the message, e.g. "Scheduled maintenance". */
  title?: string;
  /** Text of the action after the message. Renders a link with `actionHref`, otherwise a button that emits `action`. */
  actionLabel?: string;
  /** URL for the action link. */
  actionHref?: string;
  /** Shows a close button. Closing sets `v-model:open` to `false` and emits `close`. */
  dismissible?: boolean;
  /** A Lucide icon component to replace the colour's default icon. */
  icon?: Component;
  /** Hides the leading icon. */
  hideIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "info",
  variant: "subtle",
  title: "",
  actionLabel: "",
  actionHref: "",
  dismissible: false,
  icon: undefined,
  hideIcon: false,
});

/** Whether the banner shows. Bind with `v-model:open` to remember a dismissal. */
const open = defineModel<boolean>("open", { default: true });

const emit = defineEmits<{
  /** The action button was clicked (only when there's no `actionHref`). */
  action: [];
  /** The close button was clicked. */
  close: [];
}>();

defineSlots<{
  /** The message. Keep it to one sentence. */
  default?: () => unknown;
  /** Replaces the action link or button, e.g. with two buttons. */
  action?: () => unknown;
}>();

const tones = {
  info: {
    subtle: "border-blue-90 bg-blue-97 text-blue-20",
    solid: "border-black/15 bg-info text-white",
    icon: "text-blue-50",
    glyph: Info,
  },
  warning: {
    subtle: "border-yellow-80 bg-yellow-97 text-yellow-20",
    solid: "border-black/15 bg-warning text-on-warning",
    icon: "text-yellow-50",
    glyph: TriangleAlert,
  },
  danger: {
    subtle: "border-red-90 bg-red-97 text-red-20",
    solid: "border-black/15 bg-danger text-white",
    icon: "text-red-40",
    glyph: CircleAlert,
  },
  primary: {
    subtle: "border-primary-90 bg-primary-97 text-primary-20",
    solid: "border-black/15 bg-primary text-white",
    icon: "text-primary",
    glyph: Megaphone,
  },
  neutral: {
    subtle: "border-border bg-surface-muted text-body",
    solid: "border-black/15 bg-heading text-surface",
    icon: "text-muted",
    glyph: Info,
  },
} as const;

const tone = computed(() => tones[props.color]);
const glyph = computed(() => props.icon ?? tone.value.glyph);

function dismiss() {
  open.value = false;
  emit("close");
}
</script>

<template>
  <div
    v-if="open"
    class="flex w-full items-start gap-3 border-b px-4 py-2.5 text-base sm:items-center sm:px-6"
    :class="[tone[variant], variant === 'solid' ? '[&_a]:text-inherit [&_strong]:text-inherit' : '[&_strong]:text-heading']"
    :role="color === 'danger' || color === 'warning' ? 'alert' : 'status'"
    data-ac-ds
    data-testid="ac-banner"
  >
    <component
      :is="glyph"
      v-if="!hideIcon"
      class="mt-0.5 size-4 shrink-0 sm:mt-0"
      :class="variant === 'subtle' ? tone.icon : 'opacity-90'"
      aria-hidden="true"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-x-4 gap-y-1.5 sm:flex-row sm:flex-wrap sm:items-center">
      <p class="min-w-0">
        <strong v-if="title" class="font-semibold" :class="variant === 'subtle' && 'text-heading'">{{ title }}</strong>
        <span v-if="title && $slots.default" aria-hidden="true"> · </span>
        <slot />
      </p>
      <slot name="action">
        <a
          v-if="actionLabel && actionHref"
          :href="actionHref"
          class="inline-flex shrink-0 items-center gap-1 font-medium whitespace-nowrap underline decoration-current/40 underline-offset-2 transition hover:decoration-current focus-visible:rounded-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          {{ actionLabel }}<ArrowRight class="size-3.5" aria-hidden="true" />
        </a>
        <button
          v-else-if="actionLabel"
          type="button"
          class="inline-flex h-7 shrink-0 cursor-pointer items-center self-start rounded-6 border px-2.5 text-xs font-medium whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring sm:self-auto"
          :class="variant === 'solid' ? 'border-current/30 bg-current/10 hover:bg-current/20' : 'border-current/25 bg-surface text-heading shadow-xs hover:bg-surface-muted'"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </button>
      </slot>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="-my-1 -mr-1.5 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-6 opacity-75 transition hover:bg-current/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      aria-label="Dismiss"
      @click="dismiss"
    >
      <X class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
