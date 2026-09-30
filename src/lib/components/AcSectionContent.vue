<script setup lang="ts">
import { useId } from "vue";

export interface Props {
  /** Section title. */
  title?: string;
  /** Line under the title. */
  subtitle?: string;
  /** Shows a back button that emits `back`. */
  backButton?: boolean;
  /** Lets people collapse the body with a chevron button. */
  collapsible?: boolean;
  /** Pads the body. Turn off for flush tables and lists. */
  padded?: boolean;
  /** Drops the card surface so the section blends into its parent. */
  plain?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "",
  subtitle: "",
  backButton: false,
  collapsible: false,
  padded: true,
  plain: false,
});

const emit = defineEmits<{ back: [] }>();

defineSlots<{
  /** Replaces the title area. */
  header?: () => unknown;
  /** Next to the title, e.g. a badge. */
  "title-extra"?: () => unknown;
  /** Buttons on the right of the header. */
  actions?: () => unknown;
  /** Section body. */
  default?: () => unknown;
}>();

/** Whether the body is shown. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: true });
const bodyId = useId();
</script>

<template>
  <section :class="!plain && 'rounded-10 border border-border bg-white shadow-xs'" data-testid="ac-section-content">
    <header
      class="flex items-center justify-between gap-4"
      :class="[plain ? 'mb-3' : 'px-5 py-3.5', !plain && open && 'border-b border-border-light']"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <button
          v-if="backButton"
          type="button"
          class="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-6 text-label transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          aria-label="Back"
          @click="emit('back')"
        >
          <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9.5 3.5 5 8l4.5 4.5" />
          </svg>
        </button>
        <div class="min-w-0">
          <slot name="header">
            <div class="flex items-center gap-2">
              <h5 class="truncate">{{ title }}</h5>
              <slot name="title-extra" />
            </div>
            <p v-if="subtitle" class="mt-0.5 truncate text-xs text-muted">{{ subtitle }}</p>
          </slot>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
        <button
          v-if="collapsible"
          type="button"
          class="inline-flex size-7 cursor-pointer items-center justify-center rounded-6 border border-border bg-white text-label shadow-xs transition hover:border-border-dark hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          :aria-expanded="open"
          :aria-controls="bodyId"
          :aria-label="open ? 'Collapse section' : 'Expand section'"
          @click="open = !open"
        >
          <svg class="size-3.5 transition-transform duration-200" :class="!open && '-rotate-90'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </div>
    </header>
    <div v-show="open" :id="bodyId" :class="padded && !plain && 'p-5'">
      <slot />
    </div>
  </section>
</template>
