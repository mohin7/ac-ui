<script setup lang="ts">
import { computed } from "vue";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-vue-next";
import AcButton from "./AcButton.vue";
import type { Component } from "vue";
import type { Tone } from "./types";

export interface Props {
  /** Status colour of the border, tint and icon. */
  color?: Tone | "neutral";
  /** Optional bold first line above the message. */
  title?: string;
  /** Shows a close button that emits `close`. */
  dismissible?: boolean;
  /** Hides the status icon, for dense inline messages. */
  hideIcon?: boolean;
  /** A Lucide icon component to replace the colour's default icon. */
  icon?: Component;
  /** Text of a small button on the right that emits `action`, such as "Retry" or "Upgrade". */
  actionLabel?: string;
  /** A Lucide icon component shown in the action button, before `action-label`. */
  actionIcon?: Component;
  /** Shows a spinner in the action button and blocks clicks while the action runs. */
  actionLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "info",
  title: "",
  dismissible: false,
  hideIcon: false,
  icon: undefined,
  actionLabel: "",
  actionIcon: undefined,
  actionLoading: false,
});

const emit = defineEmits<{ close: []; action: [event: MouseEvent] }>();

defineSlots<{
  /** The message. Links inside are underlined in the alert's colour. */
  default?: () => unknown;
  /** Replaces the status icon, e.g. with a custom SVG. */
  icon?: () => unknown;
  /** Buttons on the right of the message (wrapping below it on narrow screens). Use `AcButton size="small"`. Replaces `action-label`. */
  actions?: () => unknown;
}>();

// .ac-notification refined: a tinted surface and hairline in the status hue, text in the same hue family
// (-10 title, -20 body: 9:1 or better on the -97 tint), a status icon.
const tones = {
  primary: { box: "border-primary-90 bg-primary-97", title: "text-primary-10", body: "text-primary-20", icon: "text-primary", glyph: Info },
  info: { box: "border-blue-90 bg-blue-97", title: "text-blue-10", body: "text-blue-20", icon: "text-blue-50", glyph: Info },
  success: { box: "border-green-90 bg-green-97", title: "text-green-10", body: "text-green-20", icon: "text-green-40", glyph: CircleCheck },
  warning: { box: "border-yellow-80 bg-yellow-97", title: "text-yellow-10", body: "text-yellow-20", icon: "text-yellow-50", glyph: TriangleAlert },
  danger: { box: "border-red-90 bg-red-97", title: "text-red-10", body: "text-red-20", icon: "text-red-40", glyph: CircleAlert },
  neutral: { box: "border-border bg-surface-muted", title: "text-heading", body: "text-body", icon: "text-muted", glyph: Info },
} as const;

const tone = computed(() => tones[props.color]);
const glyph = computed(() => props.icon ?? tone.value.glyph);
const actionColor = computed(() => (props.color === "neutral" ? "white" : props.color));
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-10 border px-4 py-3 text-base [&_a]:font-medium [&_a]:underline [&_a]:decoration-current/40 [&_a]:underline-offset-2 [&_a:hover]:decoration-current"
    :class="[tone.box, tone.body]"
    :role="color === 'danger' || color === 'warning' ? 'alert' : 'status'"
    data-testid="ac-alert"
  >
    <span v-if="!hideIcon" class="mt-0.5 inline-flex shrink-0 [&_svg]:size-4" :class="tone.icon" aria-hidden="true">
      <slot name="icon"><component :is="glyph" /></slot>
    </span>
    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
      <div class="min-w-0 flex-[1_1_256px]">
        <p v-if="title" class="font-semibold" :class="tone.title">{{ title }}</p>
        <div :class="title && 'mt-0.5'"><slot /></div>
      </div>
      <div v-if="$slots.actions || actionLabel" class="-my-1 flex shrink-0 flex-wrap items-center gap-2">
        <slot name="actions">
          <AcButton
            :title="actionLabel"
            :color="actionColor"
            variant="outlined"
            size="small"
            :loading="actionLoading"
            data-testid="ac-alert-action"
            @click="emit('action', $event)"
          >
            <template v-if="actionIcon" #icon><component :is="actionIcon" /></template>
          </AcButton>
        </slot>
      </div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="-my-0.5 -mr-1.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-6 opacity-70 transition hover:bg-current/8 hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      aria-label="Dismiss"
      @click="emit('close')"
    >
      <X class="size-3.5" aria-hidden="true" />
    </button>
  </div>
</template>
