<script setup lang="ts">
export interface Props {
  /** Page title. */
  title?: string;
  /** Line under the title. */
  subtitle?: string;
  /** Shows a back button that emits `back`. */
  backButton?: boolean;
  /** Sticks to the top while the page scrolls. */
  sticky?: boolean;
  /** Distance from the top when sticky, e.g. `"56px"` under an app navbar. */
  top?: string;
}

withDefaults(defineProps<Props>(), { title: "", subtitle: "", backButton: false, sticky: false, top: "0px" });
const emit = defineEmits<{ back: [] }>();

defineSlots<{
  /** Breadcrumb above the title. */
  breadcrumb?: () => unknown;
  /** Replaces the title and subtitle. */
  title?: () => unknown;
  /** Next to the title, e.g. a status badge. */
  "title-extra"?: () => unknown;
  /** Right side: the page's actions. The primary action goes last. */
  default?: () => unknown;
}>();
</script>

<template>
  <header
    class="z-20 border-b border-border-light bg-white/90 backdrop-blur-md"
    :class="sticky && 'sticky'"
    :style="sticky ? { top } : undefined"
    data-testid="ac-header"
  >
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
      <div class="flex min-w-0 items-center gap-3">
        <button
          v-if="backButton"
          type="button"
          class="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-6 border border-border bg-white text-label shadow-xs transition hover:border-border-dark hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          aria-label="Back"
          data-testid="ac-header-back"
          @click="emit('back')"
        >
          <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9.5 3.5 5 8l4.5 4.5" />
          </svg>
        </button>
        <div class="min-w-0">
          <div v-if="$slots.breadcrumb" class="mb-1 text-xs text-muted"><slot name="breadcrumb" /></div>
          <slot name="title">
            <div class="flex min-w-0 items-center gap-2.5">
              <h4 class="truncate">{{ title }}</h4>
              <slot name="title-extra" />
            </div>
            <p v-if="subtitle" class="mt-0.5 truncate text-base text-muted">{{ subtitle }}</p>
          </slot>
        </div>
      </div>
      <div v-if="$slots.default" class="flex flex-wrap items-center gap-2"><slot /></div>
    </div>
  </header>
</template>
