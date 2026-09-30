<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { ChevronRight, House } from "lucide-vue-next";
import type { Component } from "vue";

export interface BreadcrumbItem {
  /** Text of the crumb. */
  label: string;
  /** Route for `RouterLink` (needs vue-router in the app). */
  to?: string | Record<string, unknown>;
  /** Plain link, when there's no router. */
  href?: string;
  /** A Lucide icon before the label. */
  icon?: Component;
}

export interface Props {
  /** The path, from the top level down. The last item is the current page and isn't a link. */
  items: BreadcrumbItem[];
  /** Replaces the first item's label with a house icon (the label stays as its accessible name). */
  homeIcon?: boolean;
  /** With more items than this, the middle ones collapse behind "…" until clicked. */
  maxItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  homeIcon: false,
  maxItems: 4,
});

// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined;

const expanded = ref(false);

const visible = computed(() => {
  const items = props.items.map((item, index) => ({ item, index }));
  if (expanded.value || items.length <= props.maxItems) return items;
  return [items[0], null, ...items.slice(items.length - (props.maxItems - 2))];
});

function linkProps(item: BreadcrumbItem) {
  if (item.to !== undefined && routerLink) return { is: routerLink, to: item.to };
  const href = item.href ?? (typeof item.to === "string" ? item.to : undefined);
  return href ? { is: "a", href } : null;
}
</script>

<template>
  <nav aria-label="Breadcrumb" data-testid="ac-breadcrumb">
    <ol class="flex min-w-0 flex-wrap items-center gap-1 text-xs text-muted">
      <template v-for="(entry, i) in visible" :key="entry ? entry.index : 'ellipsis'">
        <li v-if="i > 0" class="flex items-center text-slate-60" aria-hidden="true"><ChevronRight class="size-3" /></li>
        <li v-if="!entry" class="flex">
          <button
            type="button"
            class="cursor-pointer rounded-4 px-1 hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
            aria-label="Show full path"
            @click="expanded = true"
          >
            …
          </button>
        </li>
        <li v-else class="flex min-w-0 items-center">
          <span
            v-if="entry.index === items.length - 1 || !linkProps(entry.item)"
            class="flex min-w-0 items-center gap-1"
            :class="entry.index === items.length - 1 && 'font-medium text-heading'"
            :aria-current="entry.index === items.length - 1 ? 'page' : undefined"
          >
            <component :is="entry.item.icon" v-if="entry.item.icon" class="size-3.5 shrink-0" aria-hidden="true" />
            <span class="truncate">{{ entry.item.label }}</span>
          </span>
          <component
            :is="linkProps(entry.item)!.is"
            v-else
            v-bind="{ ...linkProps(entry.item), is: undefined }"
            class="flex min-w-0 items-center gap-1 rounded-4 transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
            :aria-label="homeIcon && entry.index === 0 ? entry.item.label : undefined"
          >
            <House v-if="homeIcon && entry.index === 0" class="size-3.5 shrink-0" aria-hidden="true" />
            <template v-else>
              <component :is="entry.item.icon" v-if="entry.item.icon" class="size-3.5 shrink-0" aria-hidden="true" />
              <span class="truncate">{{ entry.item.label }}</span>
            </template>
          </component>
        </li>
      </template>
    </ol>
  </nav>
</template>
