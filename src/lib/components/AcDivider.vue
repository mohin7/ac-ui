<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  /** `horizontal` separates stacked content; `vertical` separates items in a row and stretches to its height. */
  orientation?: "horizontal" | "vertical";
  /** Text in the line, e.g. "OR" or a group name. The default slot overrides it. */
  label?: string;
  /** Where the label sits on a horizontal divider. Vertical labels are always centred. */
  align?: "center" | "left";
}

const props = withDefaults(defineProps<Props>(), {
  orientation: "horizontal",
  label: "",
  align: "center",
});

const slots = defineSlots<{
  /** Label content. Replaces `label`. */
  default?: () => unknown;
}>();

const hasLabel = computed(() => !!props.label || !!slots.default);
const vertical = computed(() => props.orientation === "vertical");
</script>

<template>
  <div
    v-if="!hasLabel"
    role="separator"
    :aria-orientation="orientation"
    class="shrink-0 bg-border"
    :class="vertical ? 'min-h-4 w-px self-stretch' : 'h-px w-full'"
    data-ac-ds
    data-testid="ac-divider"
  />
  <div
    v-else
    class="flex shrink-0 items-center gap-3 text-xs font-medium text-muted"
    :class="vertical ? 'min-h-16 flex-col self-stretch' : 'w-full'"
    data-ac-ds
    data-testid="ac-divider"
  >
    <span
      v-if="vertical || align === 'center'"
      class="flex-1 bg-border"
      :class="vertical ? 'w-px' : 'h-px'"
      aria-hidden="true"
    />
    <span class="shrink-0 whitespace-nowrap"><slot>{{ label }}</slot></span>
    <span class="flex-1 bg-border" :class="vertical ? 'w-px' : 'h-px'" aria-hidden="true" />
  </div>
</template>
