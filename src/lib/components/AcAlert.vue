<script setup lang="ts">
import { computed } from "vue";
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
// (-10 title, -20 body: 9:1 or better on the -97 tint), a solid status icon.
const tones = {
  primary: { box: "border-primary-90 bg-primary-97", title: "text-primary-10", body: "text-primary-20", icon: "text-primary" },
  info: { box: "border-blue-90 bg-blue-97", title: "text-blue-10", body: "text-blue-20", icon: "text-blue-50" },
  success: { box: "border-green-90 bg-green-97", title: "text-green-10", body: "text-green-20", icon: "text-green-40" },
  warning: { box: "border-yellow-80 bg-yellow-97", title: "text-yellow-10", body: "text-yellow-20", icon: "text-yellow-50" },
  danger: { box: "border-red-90 bg-red-97", title: "text-red-10", body: "text-red-20", icon: "text-red-40" },
  neutral: { box: "border-border bg-surface-muted", title: "text-heading", body: "text-body", icon: "text-muted" },
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
    <svg class="mt-0.5 size-4 shrink-0" :class="tone.icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        v-if="color === 'success'"
        fill-rule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clip-rule="evenodd"
      />
      <path
        v-else-if="color === 'warning' || color === 'danger'"
        fill-rule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clip-rule="evenodd"
      />
      <path
        v-else
        fill-rule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-semibold" :class="tone.title">{{ title }}</p>
      <div :class="title && 'mt-0.5'"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="-my-0.5 -mr-1.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-6 opacity-70 transition hover:bg-black/5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      aria-label="Dismiss"
      @click="emit('close')"
    >
      <svg class="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <path d="M2 2l8 8M10 2l-8 8" />
      </svg>
    </button>
  </div>
</template>
