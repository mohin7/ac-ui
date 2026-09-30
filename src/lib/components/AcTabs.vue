<script setup lang="ts">
export interface TabItem {
  key: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface Props {
  /** The tabs: `{ key, label, count?, disabled? }`. `v-model` holds the active `key`. */
  items: TabItem[];
}

defineProps<Props>();
defineSlots<{
  /** Panel content, rendered under the tab list. Receives the active key. */
  default?: (props: { active: string }) => unknown;
}>();

const active = defineModel<string>({ required: true });
</script>

<template>
  <div data-testid="ac-tabs">
    <div role="tablist" class="flex gap-5 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none]">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        role="tab"
        :aria-selected="active === item.key"
        :disabled="item.disabled"
        class="relative -mb-px inline-flex h-10 cursor-pointer items-center gap-2 border-b-2 text-base font-medium whitespace-nowrap transition-colors duration-150 focus-visible:rounded-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
        :class="
          active === item.key
            ? 'border-primary text-heading'
            : 'border-transparent text-muted hover:border-border-dark hover:text-heading'
        "
        @click="active = item.key"
      >
        {{ item.label }}
        <span
          v-if="item.count !== undefined"
          class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-50 px-1.5 text-[11px] leading-none tabular-nums"
          :class="active === item.key ? 'bg-primary-95 text-primary-10' : 'bg-surface-sunken text-label'"
          >{{ item.count }}</span
        >
      </button>
    </div>
    <div v-if="$slots.default" role="tabpanel" class="pt-5">
      <slot :active="active" />
    </div>
  </div>
</template>
