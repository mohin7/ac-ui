<script setup lang="ts">
import { computed, getCurrentInstance, watch } from "vue";
import type { Component, Ref } from "vue";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
  disabled?: boolean;
  /** Makes the tab a `RouterLink` to this route (needs vue-router in the app). The tab for the current route becomes active by itself. */
  to?: string | Record<string, unknown>;
  /** Plain link, when there's no router. */
  href?: string;
  /** Sets `data-testid` on the tab, e.g. for Cypress. */
  testid?: string;
}

interface RouterLike {
  currentRoute: Ref<{ path: string }>;
  resolve: (to: unknown) => { path: string };
}

export interface Props {
  /** The tabs: `{ key, label, count?, disabled?, to?, href?, testid? }`. `v-model` holds the active `key`. With `to`, it follows the current route. */
  items: TabItem[];
}

const props = defineProps<Props>();
defineSlots<{
  /** Panel content, rendered under the tab list. Receives the active key. */
  default?: (props: { active: string }) => unknown;
}>();

const active = defineModel<string>({ default: "" });

const app = getCurrentInstance()?.appContext;
// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = app?.components.RouterLink as Component | undefined;
const router = app?.config.globalProperties.$router as RouterLike | undefined;

// Exact match wins; otherwise the longest route that the current path sits under.
const routeKey = computed(() => {
  if (!router) return "";
  const current = router.currentRoute.value.path;
  let best = "";
  let bestLength = -1;
  for (const item of props.items) {
    if (item.to === undefined || item.disabled) continue;
    let path: string;
    try {
      path = router.resolve(item.to).path;
    } catch {
      continue;
    }
    if (path === current) return item.key;
    const base = path.endsWith("/") ? path : `${path}/`;
    if (current.startsWith(base) && path.length > bestLength) {
      best = item.key;
      bestLength = path.length;
    }
  }
  return best;
});
watch(routeKey, (key) => key && (active.value = key), { immediate: true });

function tagOf(item: TabItem): Component | string {
  if (item.to !== undefined && routerLink && !item.disabled) return routerLink;
  if (item.href || typeof item.to === "string") return "a";
  return "button";
}

function tabAttrs(item: TabItem) {
  const tag = tagOf(item);
  const attrs: Record<string, unknown> = { "data-testid": item.testid };
  if (tag === routerLink) attrs.to = item.to;
  else if (tag === "a") {
    if (item.disabled) {
      attrs["aria-disabled"] = "true";
    } else attrs.href = item.href ?? item.to;
  } else {
    attrs.type = "button";
    attrs.disabled = item.disabled || undefined;
  }
  return attrs;
}

function onTabClick(item: TabItem, e: MouseEvent) {
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  active.value = item.key;
}
</script>

<template>
  <div data-ac-ds data-testid="ac-tabs">
    <div role="tablist" class="flex gap-5 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none]">
      <component
        :is="tagOf(item)"
        v-for="item in items"
        :key="item.key"
        v-bind="tabAttrs(item)"
        role="tab"
        :aria-selected="active === item.key"
        class="relative -mb-px inline-flex h-10 cursor-pointer items-center gap-2 border-b-2 text-base font-medium whitespace-nowrap transition-colors duration-150 focus-visible:rounded-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring no-underline disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
        :class="
          active === item.key
            ? 'border-primary text-heading'
            : 'border-transparent text-muted hover:border-border-dark hover:text-heading'
        "
        @click="onTabClick(item, $event)"
      >
        {{ item.label }}
        <span
          v-if="item.count !== undefined"
          class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-50 px-1.5 text-sm leading-none tabular-nums"
          :class="active === item.key ? 'bg-primary-95 text-primary-10' : 'bg-surface-sunken text-label'"
          >{{ item.count }}</span
        >
      </component>
    </div>
    <div v-if="$slots.default" role="tabpanel" class="pt-5">
      <slot :active="active" />
    </div>
  </div>
</template>
