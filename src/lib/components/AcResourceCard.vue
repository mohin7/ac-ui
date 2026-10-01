<script setup lang="ts">
import { computed, getCurrentInstance, useId } from "vue";
import AcBadge from "./AcBadge.vue";
import AcDropdown from "./AcDropdown.vue";
import AcSkeleton from "./AcSkeleton.vue";
import AcSpinner from "./AcSpinner.vue";
import AcTag from "./AcTag.vue";
import type { Component } from "vue";
import type { Tone } from "./types";

export interface ResourceTag {
  /** Tag text, or the value of a key–value tag. */
  label: string;
  /** Makes it a key–value tag, e.g. `env` for `env=prod`. */
  key?: string;
  /** Tag colour, e.g. `warning` for an outdated version. */
  color?: Tone | "neutral";
  /** Shows a spinner before the text, e.g. while the status is still loading. */
  loading?: boolean;
}

export interface ResourceDetail {
  /** Name of the detail, e.g. "Provider" or "Nodes". Old `title`. */
  label: string;
  /** The value. Empty values show as "—". */
  value?: string | number;
  /** Slot name for a custom value: `#detail-<key>`. */
  key?: string;
  /** Sets the value in Geist Mono, for versions, IPs and IDs. */
  mono?: boolean;
}

export interface Props {
  /** Name of the cluster, database, node or organization. Also the card's accessible name. Old `clusterData.name`. */
  name: string;
  /** A muted line under the name, e.g. "Postgres 16.1 · demo" or "Last active 2 days ago". */
  subtitle?: string;
  /** Logo image URL, e.g. the cloud provider or database engine. Old `clusterData.providerIcon`. */
  logo?: string;
  /** Alt text for `logo`. Leave empty when `subtitle` or a detail already names it. */
  logoAlt?: string;
  /** A Lucide icon to show instead of a logo. */
  icon?: Component;
  /** Status shown as a badge before the tags, e.g. "Ready" or "Provisioning". */
  status?: string;
  /** Colour of the `status` badge. */
  statusColor?: Tone | "default";
  /** Shows a spinner in the status badge while the status is being worked out. */
  statusLoading?: boolean;
  /** Tags after the status: `{ label, key?, color?, loading? }`, or plain strings. Old `clusterData.tags`. */
  tags?: (ResourceTag | string)[];
  /** Key facts as label–value pairs: `{ label, value?, key?, mono? }`. Keep it to about four. Old `clusterData.details`. */
  details?: ResourceDetail[];
  /** Columns of the details grid. Three and four drop to two on phones. */
  columns?: 1 | 2 | 3 | 4;
  /** Sets `name` in Geist Mono, for Kubernetes object names. */
  mono?: boolean;
  /** Shows a skeleton card while the resource loads. */
  loading?: boolean;
  /** Greys the card out and turns off its link and click, e.g. for a cluster that isn't active yet. */
  disabled?: boolean;
  /** Makes the card a `RouterLink` to this route. Needs vue-router in the app; without it a string is used as `href`. */
  to?: string | Record<string, unknown>;
  /** Makes the card a plain link. */
  href?: string;
  /** Link target for `href`, e.g. `_blank`. */
  target?: string;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: "",
  logo: "",
  logoAlt: "",
  icon: undefined,
  status: "",
  statusColor: "default",
  statusLoading: false,
  tags: () => [],
  details: () => [],
  columns: 2,
  mono: false,
  loading: false,
  disabled: false,
  to: undefined,
  href: undefined,
  target: undefined,
});

const emit = defineEmits<{
  /** Fires when the card is clicked. Listening to it turns the card into a button. */
  click: [e: MouseEvent];
}>();

const slots = defineSlots<{
  /** Replaces the logo or icon. */
  logo?: () => unknown;
  /** Replaces the status badge and tags. */
  tags?: () => unknown;
  /** Buttons at the top right, e.g. a "Trigger drill" button. Old `custom-option` / `header-right`. */
  actions?: () => unknown;
  /** `AcDropdownItem`s for the ⋮ actions menu. The card renders the menu. Old `options` with `showOptions`. */
  menu?: () => unknown;
  /** Custom value for the detail with that key, e.g. `#detail-age`. */
  [name: `detail-${string}`]: (props: { detail: ResourceDetail }) => unknown;
  /** Extra content under the details. */
  default?: () => unknown;
  /** A row at the bottom, above a divider, e.g. a compliance note and a link. */
  footer?: () => unknown;
}>();

const GRID = { 1: "", 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" } as const;

const instance = getCurrentInstance();
// Looked up at runtime so the library doesn't depend on vue-router.
const routerLink = instance?.appContext.components.RouterLink as Component | undefined;
const id = useId();

const normalTags = computed<ResourceTag[]>(() => props.tags.map((t) => (typeof t === "string" ? { label: t } : t)));

const link = computed(() => {
  if (props.disabled) return null;
  if (props.to !== undefined && routerLink) return { is: routerLink, to: props.to };
  const href = props.href ?? (typeof props.to === "string" ? props.to : undefined);
  if (href) return { is: "a", href, target: props.target, rel: props.target === "_blank" ? "noopener noreferrer" : undefined };
  return null;
});

function isButton() {
  return !link.value && !props.disabled && !!instance?.vnode.props?.onClick;
}

function isEmpty(value: ResourceDetail["value"]) {
  return value === undefined || value === null || value === "";
}

function onClick(e: MouseEvent) {
  emit("click", e);
}
</script>

<template>
  <AcSkeleton v-if="loading" shape="info-card" :label="`Loading ${name || 'resource'}`" data-testid="ac-resource-card" />
  <article
    v-else
    class="group relative flex min-w-0 flex-col rounded-10 border border-border bg-surface shadow-xs transition-[border-color,box-shadow] duration-150 has-[[data-ac-card-link]:focus-visible]:ring-[3px] has-[[data-ac-card-link]:focus-visible]:ring-ring"
    :class="[(link || isButton()) && 'hover:border-border-dark hover:shadow-sm', disabled && 'opacity-60']"
    :aria-labelledby="`${id}-name`"
    :aria-disabled="disabled || undefined"
    data-testid="ac-resource-card"
  >
    <div class="flex min-w-0 items-start gap-3 p-4">
      <span
        v-if="slots.logo || logo || icon"
        class="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-8 border border-border-light bg-surface-muted"
        :class="logo ? 'p-1.5' : 'text-label [&_svg]:size-5'"
        :aria-hidden="logo && logoAlt ? undefined : 'true'"
      >
        <slot name="logo">
          <img v-if="logo" :src="logo" :alt="logoAlt" class="size-full object-contain" />
          <component :is="icon" v-else />
        </slot>
      </span>

      <div class="min-w-0 flex-1">
        <h3
          :id="`${id}-name`"
          class="truncate text-lg leading-6 font-semibold tracking-[-0.01em] text-heading"
          :class="mono && 'font-mono text-base tracking-tight'"
          :title="name"
        >
          <component
            :is="link.is"
            v-if="link"
            v-bind="{ ...link, is: undefined }"
            data-ac-card-link
            class="outline-none after:absolute after:inset-0 after:rounded-10"
            @click="onClick"
          >
            {{ name }}
          </component>
          <button
            v-else-if="isButton()"
            type="button"
            data-ac-card-link
            class="max-w-full cursor-pointer truncate text-left outline-none after:absolute after:inset-0 after:rounded-10"
            @click="onClick"
          >
            {{ name }}
          </button>
          <template v-else>{{ name }}</template>
        </h3>
        <p v-if="subtitle" class="line-clamp-2 text-xs text-muted" :title="subtitle">{{ subtitle }}</p>

        <div v-if="slots.tags || status || statusLoading || normalTags.length" class="mt-2 flex flex-wrap items-center gap-1.5">
          <slot name="tags">
            <AcBadge v-if="statusLoading" color="default" variant="light" rounded>
              <AcSpinner size="xs" label="" />
              {{ status || "Loading" }}
            </AcBadge>
            <AcBadge v-else-if="status" :label="status" :color="statusColor" variant="light" rounded dot />
            <AcTag
              v-for="(tag, i) in normalTags"
              :key="`${tag.key ?? ''}${tag.label}${i}`"
              :label="tag.key ? '' : tag.label"
              :key-label="tag.key ?? ''"
              :value-label="tag.key ? tag.label : ''"
              :color="tag.color ?? 'neutral'"
              rounded
            >
              <template v-if="tag.loading" #icon><AcSpinner size="xs" label="" /></template>
            </AcTag>
          </slot>
        </div>
      </div>

      <div v-if="slots.actions || slots.menu" class="relative z-10 -mt-1 -mr-1.5 flex shrink-0 items-center gap-1.5">
        <slot name="actions" />
        <AcDropdown v-if="slots.menu" align="end" :menu-label="`Actions for ${name}`">
          <slot name="menu" />
        </AcDropdown>
      </div>
    </div>

    <dl
      v-if="details.length"
      class="grid gap-x-4 gap-y-3 border-t border-border-light px-4 py-3.5"
      :class="GRID[columns]"
    >
      <div v-for="(detail, i) in details" :key="detail.key ?? `${detail.label}${i}`" class="min-w-0">
        <dt class="truncate text-xs text-muted">{{ detail.label }}</dt>
        <dd class="mt-0.5 flex min-w-0 flex-wrap items-center gap-1.5 text-base font-medium text-heading">
          <slot :name="`detail-${detail.key}`" :detail="detail">
            <span v-if="isEmpty(detail.value)" class="text-muted" aria-label="Not set">—</span>
            <span v-else class="min-w-0 break-words" :class="detail.mono && 'font-mono text-[12.5px]'">{{ detail.value }}</span>
          </slot>
        </dd>
      </div>
    </dl>

    <div v-if="slots.default" class="border-t border-border-light px-4 py-3.5 text-base text-body" :class="details.length > 0 && 'border-t-0 pt-0'">
      <slot />
    </div>

    <div
      v-if="slots.footer"
      class="relative z-10 mt-auto flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-border-light px-4 py-3 text-xs text-muted"
    >
      <slot name="footer" />
    </div>
  </article>
</template>
