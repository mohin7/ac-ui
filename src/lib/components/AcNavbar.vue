<script setup lang="ts">
import { Menu } from "lucide-vue-next";

export interface Props {
  /** When the menu button shows: `mobile` below 768px, `always`, or `never`. It emits `menu`; wire it to the sidebar's `v-model:mobile-open` or its `toggle()`. */
  menuButton?: "mobile" | "always" | "never";
  /** Accessible name of the menu button. */
  menuLabel?: string;
  /** Short product tag after the logo, e.g. `"Console"` or `"DB"`. */
  productName?: string;
  /** Sticks to the top of its scroll container. */
  sticky?: boolean;
  /** Accessible name of the navigation that holds the default slot. */
  label?: string;
}

withDefaults(defineProps<Props>(), {
  menuButton: "mobile",
  menuLabel: "Open navigation",
  productName: "",
  sticky: true,
  label: "Primary",
});

const emit = defineEmits<{ menu: [] }>();

defineSlots<{
  /** The logo, usually a link home. */
  brand?: () => unknown;
  /** Top-level links (`AcNavbarItem`). Hidden below 768px; put them in the sidebar for phones. */
  default?: () => unknown;
  /** A search field, centred. Hidden below 640px. */
  search?: () => unknown;
  /** Right side: icon actions, notifications, theme and `AcUserMenu` last. */
  actions?: () => unknown;
}>();
</script>

<template>
  <header
    class="top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border-light bg-surface/90 px-3 backdrop-blur-md sm:gap-3 sm:px-4"
    :class="sticky && 'sticky'"
    data-ac-ds
    data-testid="ac-navbar"
  >
    <button
      v-if="menuButton !== 'never'"
      type="button"
      class="-ml-1.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-6 text-label transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      :class="menuButton === 'mobile' && 'md:hidden'"
      :aria-label="menuLabel"
      data-ac-ds
      data-testid="ac-navbar-menu"
      @click="emit('menu')"
    >
      <Menu class="size-4.5" aria-hidden="true" />
    </button>

    <div v-if="$slots.brand || productName" class="flex shrink-0 items-center gap-2">
      <slot name="brand" />
      <span
        v-if="productName"
        class="inline-flex h-5 items-center rounded-4 bg-primary-95 px-1.5 text-sm font-semibold tracking-wide text-primary-20 uppercase"
      >
        {{ productName }}
      </span>
    </div>

    <nav v-if="$slots.default" :aria-label="label" class="hidden items-center gap-0.5 md:flex">
      <slot />
    </nav>

    <div class="flex min-w-0 flex-1 justify-center">
      <div v-if="$slots.search" class="hidden w-full max-w-md sm:block">
        <slot name="search" />
      </div>
    </div>

    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-1">
      <slot name="actions" />
    </div>
  </header>
</template>
