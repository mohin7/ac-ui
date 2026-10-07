<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeft } from "@lucide/vue";
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
  /** `normal` suits a page's main header. `compact` has a 14px title and less padding, for dense pages and forms. */
  size?: "normal" | "compact";
}

const props = withDefaults(defineProps<Props>(), { title: "", subtitle: "", backButton: false, sticky: false, top: "0px", size: "normal" });
const compact = computed(() => props.size === "compact");
const emit = defineEmits<{ back: [] }>();

defineSlots<{
  /** A logo or icon before the title, e.g. the database engine's logo on a resource page. Shown in a 40px tile. */
  icon?: () => unknown;
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
    class="z-20 border-b border-border-light bg-surface/85 shadow-[0_1px_2px_0_rgb(15_23_42/0.03)] backdrop-blur-md backdrop-saturate-150"
    :class="sticky && 'sticky'"
    :style="sticky ? { top } : undefined"
    data-ac-ds
    data-testid="ac-header"
  >
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3" :class="compact ? 'px-5 py-2.5' : 'px-6 py-3.5'">
      <div class="flex min-w-0 items-center gap-3.5">
        <button
          v-if="backButton"
          type="button"
          class="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-8 border border-border bg-surface text-label shadow-xs transition hover:border-border-dark hover:bg-surface-muted hover:text-heading active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          aria-label="Back"
          data-ac-ds
          data-testid="ac-header-back"
          @click="emit('back')"
        >
          <ArrowLeft class="size-4" aria-hidden="true" />
        </button>
        <span
          v-if="$slots.icon"
          class="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-10 border border-border-light bg-surface p-2 text-label shadow-xs ring-1 ring-black/[0.02] [&_img]:size-full [&_img]:object-contain [&_svg]:size-5"
          aria-hidden="true"
        >
          <slot name="icon" />
        </span>
        <div class="min-w-0">
          <div v-if="$slots.breadcrumb" class="mb-1 text-xs text-muted"><slot name="breadcrumb" /></div>
          <slot name="title">
            <div class="flex min-w-0 items-center gap-2.5">
              <h4 class="truncate font-semibold text-heading" :class="compact ? 'text-lg leading-6 tracking-[-0.01em]' : 'text-xl leading-7 tracking-tight'">{{ title }}</h4>
              <slot name="title-extra" />
            </div>
            <p v-if="subtitle" class="mt-px truncate text-sm leading-5 text-muted">{{ subtitle }}</p>
          </slot>
        </div>
      </div>
      <div v-if="$slots.default" class="flex flex-wrap items-center gap-2"><slot /></div>
    </div>
  </header>
</template>
