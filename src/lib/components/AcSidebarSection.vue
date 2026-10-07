<script setup lang="ts">
import { computed, inject, useId } from "vue";
import { ChevronDown } from "@lucide/vue";
import type { Ref } from "vue";

interface SidebarContext {
  rail: Readonly<Ref<boolean>>;
}

export interface Props {
  /** Small uppercase heading above the items. Hidden in the collapsed rail, where a divider takes its place. */
  label?: string;
  /** Turns the heading into a button that shows and hides the items. */
  collapsible?: boolean;
}

withDefaults(defineProps<Props>(), { label: "", collapsible: false });

/** Whether the items are shown when `collapsible`. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: true });

defineSlots<{
  /** The section's `AcSidebarItem`s. */
  default?: () => unknown;
}>();

const sidebar = inject<SidebarContext | null>("ac-sidebar", null);

const id = useId();

const rail = computed(() => sidebar?.rail.value ?? false);
</script>

<template>
  <li
    class="list-none"
    :class="rail ? 'mt-2 border-t border-border-light pt-2 first:mt-0 first:border-0 first:pt-0' : 'mt-4 first:mt-0'"
    data-ac-ds
    data-testid="ac-sidebar-section"
  >
    <template v-if="label && !rail">
      <button
        v-if="collapsible"
        type="button"
        class="group flex h-7 w-full cursor-pointer items-center justify-between gap-2 rounded-6 px-2.5 text-sm font-medium tracking-wider text-muted uppercase transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        :aria-expanded="open"
        :aria-controls="`${id}-items`"
        @click="open = !open"
      >
        <span class="truncate">{{ label }}</span>
        <ChevronDown
          class="size-3.5 shrink-0 transition-transform duration-150 motion-reduce:transition-none"
          :class="!open && '-rotate-90'"
          aria-hidden="true"
        />
      </button>
      <p v-else class="h-7 truncate px-2.5 text-sm leading-7 font-medium tracking-wider text-muted uppercase">{{ label }}</p>
    </template>
    <ul
      :id="`${id}-items`"
      role="list"
      :aria-label="label || undefined"
      class="flex-col gap-0.5"
      :class="open || rail || !collapsible ? 'flex' : 'hidden'"
    >
      <slot />
    </ul>
  </li>
</template>
