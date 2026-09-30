<script setup lang="ts">
import { Check } from "lucide-vue-next";

export interface Step {
  id: number;
  title: string;
  description?: string;
}

export interface Props {
  /** The steps: `{ id, title, description? }`, with ids 1…n in order. */
  options: Step[];
  /** Id of the current step. Lower ids show a check mark. */
  active: number;
}

defineProps<Props>();
</script>

<template>
  <ol class="flex w-full" data-testid="ac-steps">
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
</template>
