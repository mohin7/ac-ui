<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { Check, Copy, Eye, EyeOff } from "@lucide/vue";

export interface InfoItem {
  /** Names the slots for this row: `#value-<key>` and `#label-<key>`. Defaults to `label`. */
  key?: string;
  /** Text in the label column. */
  label: string;
  /** The value. Empty values show a dash. */
  value?: string | number | null;
  /** Adds a copy-to-clipboard button after the value. */
  copyable?: boolean;
  /** Shows the value in the monospace font, for IDs, hashes, endpoints and resource names. */
  mono?: boolean;
  /** Hides the value behind dots with a show/hide button, e.g. a password. Copy still copies the real value. */
  secret?: boolean;
}

export interface Props {
  /** The rows: `{ key?, label, value?, copyable?, mono?, secret? }`. */
  items?: InfoItem[];
  /** Heading above the rows. */
  title?: string;
  /** Lays the rows out in two columns from 768px up. */
  columns?: 1 | 2;
  /** `horizontal` puts the label to the left of the value; `stacked` puts it above, for narrow cards. */
  layout?: "horizontal" | "stacked";
  /** Draws a bordered card around the table. Turn off inside an AcCard or panel. */
  bordered?: boolean;
  /** Shows placeholder bars in place of the values while data loads. */
  loading?: boolean;
  /** Text shown when `items` is empty. */
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  title: "",
  columns: 1,
  layout: "horizontal",
  bordered: true,
  loading: false,
  emptyText: "No details available",
});

defineSlots<{
  /** Content at the right of the title, e.g. an Edit button. */
  actions?: () => unknown;
  /** Custom value for the row with that key, e.g. `#value-status` for a badge or `#value-cluster` for a link. */
  [name: `value-${string}`]: (props: { item: InfoItem }) => unknown;
  /** Custom label for the row with that key, e.g. to add an icon or a tooltip. */
  [name: `label-${string}`]: (props: { item: InfoItem }) => unknown;
}>();

const PLACEHOLDER_WIDTHS = ["w-40", "w-28", "w-52", "w-32", "w-44", "w-24"];

const copiedKey = ref<string | null>(null);
const revealed = ref(new Set<string>());
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const rows = computed(() => props.items.map((item) => ({ item, key: item.key ?? item.label })));
const itemClass = computed(() => [
  "min-w-0 border-t border-border-light py-2.5 first:border-t-0",
  props.columns === 2 && "md:[&:nth-child(2)]:border-t-0",
  props.layout === "horizontal" ? "flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4" : "flex flex-col gap-1",
]);
const labelClass = computed(() => [
  "flex items-center gap-1.5 text-base text-muted",
  props.layout === "horizontal" && (props.columns === 2 ? "sm:w-36 sm:shrink-0" : "sm:w-48 sm:shrink-0"),
]);

function isEmpty(value: InfoItem["value"]) {
  return value === null || value === undefined || value === "";
}

function toggleReveal(key: string) {
  const next = new Set(revealed.value);
  if (!next.delete(key)) next.add(key);
  revealed.value = next;
}

async function copy(key: string, value: InfoItem["value"]) {
  try {
    await navigator.clipboard.writeText(String(value ?? ""));
    copiedKey.value = key;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copiedKey.value = null), 1500);
  } catch {
    // clipboard blocked (insecure origin or denied permission)
  }
}

onBeforeUnmount(() => clearTimeout(copiedTimer));
</script>

<template>
  <div :class="bordered && 'rounded-10 border border-border bg-surface shadow-xs'" data-ac-ds data-testid="ac-info-table">
    <div
      v-if="title || $slots.actions"
      class="flex items-center justify-between gap-4"
      :class="bordered ? 'border-b border-border-light px-5 py-3.5' : 'mb-2'"
    >
      <h3 v-if="title" class="text-lg leading-6 font-semibold tracking-[-0.01em] text-heading">{{ title }}</h3>
      <div v-if="$slots.actions" class="ml-auto flex shrink-0 items-center gap-2"><slot name="actions" /></div>
    </div>

    <p v-if="!loading && !items.length" class="py-6 text-center text-base text-muted" :class="bordered && 'px-5'">{{ emptyText }}</p>

    <dl
      v-else
      class="grid"
      :class="[columns === 2 && 'md:grid-cols-2 md:gap-x-10', bordered ? 'px-5 py-2' : '']"
      :aria-busy="loading || undefined"
    >
      <template v-if="loading && !items.length">
        <div v-for="(w, i) in PLACEHOLDER_WIDTHS" :key="i" :class="itemClass">
          <dt :class="labelClass"><span class="h-3 w-20 animate-pulse rounded-4 bg-surface-sunken" /></dt>
          <dd class="flex h-5 items-center"><span class="h-3 animate-pulse rounded-4 bg-surface-sunken" :class="w" /></dd>
        </div>
      </template>
      <div v-for="({ item, key }, i) in rows" :key="key" :class="itemClass">
        <dt :class="labelClass">
          <slot :name="`label-${key}`" :item="item">{{ item.label }}</slot>
        </dt>
        <dd class="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-base text-heading">
          <span v-if="loading" class="h-3 animate-pulse rounded-4 bg-surface-sunken" :class="PLACEHOLDER_WIDTHS[i % PLACEHOLDER_WIDTHS.length]" />
          <slot v-else :name="`value-${key}`" :item="item">
            <span v-if="isEmpty(item.value)" class="text-muted">—</span>
            <span v-else class="flex min-w-0 items-start gap-1.5">
              <span class="min-w-0 [overflow-wrap:anywhere]" :class="(item.mono || item.secret) && 'font-mono text-xs leading-5'">
                {{ item.secret && !revealed.has(key) ? "••••••••••••" : item.value }}
              </span>
              <button
                v-if="item.secret"
                type="button"
                class="-my-0.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                :aria-label="revealed.has(key) ? `Hide ${item.label}` : `Show ${item.label}`"
                :aria-pressed="revealed.has(key)"
                @click="toggleReveal(key)"
              >
                <component :is="revealed.has(key) ? EyeOff : Eye" class="size-3.5" aria-hidden="true" />
              </button>
              <button
                v-if="item.copyable"
                type="button"
                class="-my-0.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-4 text-muted transition hover:bg-surface-sunken hover:text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                :aria-label="copiedKey === key ? `${item.label} copied` : `Copy ${item.label}`"
                :title="copiedKey === key ? 'Copied' : 'Copy'"
                @click="copy(key, item.value)"
              >
                <Check v-if="copiedKey === key" class="size-3.5 text-success" aria-hidden="true" />
                <Copy v-else class="size-3.5" aria-hidden="true" />
              </button>
            </span>
          </slot>
        </dd>
      </div>
    </dl>
  </div>
</template>
