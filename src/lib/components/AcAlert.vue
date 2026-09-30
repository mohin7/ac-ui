<script setup lang="ts">
import { computed } from "vue";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-vue-next";
import type { Tone } from "./types";

export interface Props {
  /** Status colour of the border, tint and icon. */
  color?: Tone | "neutral";
  /** Optional bold first line above the message. */
  title?: string;
  /** Shows a close button that emits `close`. */
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "info",
  title: "",
  dismissible: false,
});

const emit = defineEmits<{ close: [] }>();

defineSlots<{
  /** The message. Links inside are underlined in primary. */
  default?: () => unknown;
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
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-10 border px-4 py-3 text-base [&_a]:font-medium [&_a]:underline [&_a]:decoration-current/40 [&_a]:underline-offset-2 [&_a:hover]:decoration-current"
    :class="[tone.box, tone.body]"
    :role="color === 'danger' || color === 'warning' ? 'alert' : 'status'"
    data-testid="ac-alert"
  >
    <component :is="tone.glyph" class="mt-0.5 size-4 shrink-0" :class="tone.icon" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-semibold" :class="tone.title">{{ title }}</p>
      <div :class="title && 'mt-0.5'"><slot /></div>
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
