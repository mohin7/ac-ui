<script setup lang="ts">
import { Check } from "@lucide/vue";

export interface SubStep {
  /** Unique across all steps, e.g. `"credentials"` or `3`. */
  id: number | string;
  title: string;
}

export interface Step {
  id: number;
  title: string;
  description?: string;
  /** Smaller steps inside this one. Only the current step lists them, and only with `orientation="vertical"`. */
  substeps?: SubStep[];
}

export interface Props {
  /** The steps: `{ id, title, description? }`, with ids 1…n in order. */
  options: Step[];
  /** Id of the current step. Lower ids show a check mark. */
  active: number;
  /** `horizontal` fits a wizard's header. `vertical` fits a side panel and can list `substeps`. */
  orientation?: "horizontal" | "vertical";
  /** With `orientation="vertical"`, the id of the current sub-step of the current step. Earlier sub-steps show a check mark. */
  activeSubstep?: number | string;
}

const props = withDefaults(defineProps<Props>(), { orientation: "horizontal", activeSubstep: undefined });

// Position of the current sub-step in this step's list; -1 when none is set.
const substepIndex = (step: Step) => (props.activeSubstep === undefined ? -1 : (step.substeps ?? []).findIndex((s) => s.id === props.activeSubstep));
</script>

<template>
  <ol v-if="orientation === 'horizontal'" class="flex w-full" data-ac-ds data-testid="ac-steps">
    <li
      v-for="(step, i) in options"
      :key="step.id"
      class="relative flex flex-1 flex-col items-center px-2 text-center"
      :aria-current="active === step.id ? 'step' : undefined"
    >
      <!-- connector to the next step -->
      <span
        v-if="i < options.length - 1"
        class="absolute top-3.5 left-[calc(50%+22px)] h-0.5 w-[calc(100%-44px)] -translate-y-1/2 rounded-full transition-colors duration-300"
        :class="active > step.id ? 'bg-primary' : 'bg-border'"
        aria-hidden="true"
      />
      <span
        class="relative inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-all duration-200"
        :class="
          active > step.id
            ? 'bg-primary text-white shadow-button'
            : active === step.id
              ? 'bg-surface text-primary-20 ring-2 ring-primary shadow-[0_0_0_5px_var(--color-ring)]'
              : 'bg-surface text-muted ring-1 ring-border-dark'
        "
      >
        <Check v-if="active > step.id" class="size-3.5" :stroke-width="2.5" aria-hidden="true" />
        <span v-else>{{ step.id }}</span>
      </span>
      <p class="mt-3 text-base font-medium" :class="active >= step.id ? 'text-heading' : 'text-muted'">{{ step.title }}</p>
      <p v-if="step.description" class="mt-0.5 text-xs" :class="active >= step.id ? 'text-label' : 'text-muted'">
        {{ step.description }}
      </p>
    </li>
  </ol>

  <ol v-else class="flex w-full flex-col" data-ac-ds data-testid="ac-steps">
    <li
      v-for="(step, i) in options"
      :key="step.id"
      class="relative flex gap-3 pb-6 last:pb-0"
      :aria-current="active === step.id ? 'step' : undefined"
    >
      <!-- connector to the next step -->
      <span
        v-if="i < options.length - 1"
        class="absolute top-9 bottom-1 left-3.5 w-0.5 -translate-x-1/2 rounded-full transition-colors duration-300"
        :class="active > step.id ? 'bg-primary' : 'bg-border'"
        aria-hidden="true"
      />
      <span
        class="relative inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-all duration-200"
        :class="
          active > step.id
            ? 'bg-primary text-white shadow-button'
            : active === step.id
              ? 'bg-surface text-primary-20 ring-2 ring-primary shadow-[0_0_0_5px_var(--color-ring)]'
              : 'bg-surface text-muted ring-1 ring-border-dark'
        "
      >
        <Check v-if="active > step.id" class="size-3.5" :stroke-width="2.5" aria-hidden="true" />
        <span v-else>{{ step.id }}</span>
      </span>
      <div class="min-w-0 flex-1 pt-1">
        <p class="text-base font-medium" :class="active >= step.id ? 'text-heading' : 'text-muted'">{{ step.title }}</p>
        <p v-if="step.description" class="mt-0.5 text-xs" :class="active >= step.id ? 'text-label' : 'text-muted'">
          {{ step.description }}
        </p>
        <ul v-if="step.substeps?.length && active === step.id" class="mt-2 space-y-0.5 border-l border-dashed border-border-dark pl-3" data-testid="ac-steps-substeps">
          <li
            v-for="(sub, j) in step.substeps"
            :key="sub.id"
            class="flex items-center gap-2 py-1"
            :aria-current="sub.id === activeSubstep ? 'step' : undefined"
          >
            <span
              class="inline-flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
              :class="
                j < substepIndex(step)
                  ? 'bg-primary text-white'
                  : j === substepIndex(step)
                    ? 'bg-surface text-primary ring-2 ring-primary'
                    : 'bg-surface text-muted ring-1 ring-border-dark'
              "
              aria-hidden="true"
            >
              <Check v-if="j < substepIndex(step)" class="size-3" :stroke-width="3" />
              <span v-else-if="j === substepIndex(step)" class="size-1.5 rounded-full bg-primary" />
            </span>
            <span class="min-w-0 truncate text-base" :class="j < substepIndex(step) ? 'text-label' : j === substepIndex(step) ? 'font-medium text-heading' : 'text-muted'">
              {{ sub.title }}
            </span>
          </li>
        </ul>
      </div>
    </li>
  </ol>
</template>
