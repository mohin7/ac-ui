<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { Check, ChevronsUpDown, Cloud, Plus, Search } from "lucide-vue-next";
import AcSkeleton from "./AcSkeleton.vue";
import type { Ref } from "vue";

interface SidebarContext {
  rail: Readonly<Ref<boolean>>;
  dark: Readonly<Ref<boolean>>;
}

export interface SwitchCluster {
  /** Cluster name; the `v-model` value. */
  name: string;
  /** Name shown in the list. Falls back to `name`. */
  displayName?: string;
  /** Cloud provider, e.g. `AWS`, `GKE`, `Akamai`, `Generic`. Picks the provider icon. */
  provider?: string;
  /** Region or zone, shown under the name. */
  location?: string;
  /** Cluster status such as `Active`, `NotReady`, `Lost` or `NotImported`. Sets the status dot. */
  status?: string;
  /** Shows the cluster but blocks choosing it, e.g. while it isn't `Active`. */
  disabled?: boolean;
  /** Old vue-multiselect name for `disabled`. Still honoured. */
  $isDisabled?: boolean;
}

export interface Props {
  /** The clusters to choose from. */
  clusterOptions?: SwitchCluster[];
  /** Shows only the provider icon, for the collapsed sidebar rail. Inside `AcSidebar` it follows the rail on its own. */
  sidebarCollapsed?: boolean;
  /** Shows a skeleton while the cluster list loads. Old `ClusterSwitcherLoader`. */
  loading?: boolean;
  /** Blocks opening the list, e.g. on pages where the cluster can't change. */
  disabled?: boolean;
  /** Adds a search box above the list. */
  searchable?: boolean;
  /** Placeholder of the search box. */
  searchPlaceholder?: string;
  /** Text in the trigger when no cluster is selected. */
  placeholder?: string;
  /** Text of the footer action. Pass an empty string to hide it. Emits `import`. */
  importLabel?: string;
  /** Makes the footer action a link, e.g. to the import-cluster page. `import` is emitted either way. */
  importUrl?: string;
  /** Base URL of the provider PNGs: `${providerIconBase}/${provider}.png`. Pass an empty string (offline installers) to use a generic icon. */
  providerIconBase?: string;
}

const props = withDefaults(defineProps<Props>(), {
  clusterOptions: () => [],
  sidebarCollapsed: undefined,
  loading: false,
  disabled: false,
  searchable: true,
  searchPlaceholder: "Search clusters",
  placeholder: "Select a cluster",
  importLabel: "Import cluster",
  importUrl: "",
  providerIconBase: "https://cdn.appscode.com/images/cloud-provider-icons",
});

/** Name of the active cluster. */
const model = defineModel<string>({ default: "" });
/** Whether the list is open. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  /** A cluster was chosen. `v-model` is already updated. */
  select: [cluster: SwitchCluster];
  /** The footer action was clicked. */
  import: [];
}>();

defineSlots<{
  /** Custom row content. */
  option?: (props: { cluster: SwitchCluster; selected: boolean; active: boolean }) => unknown;
  /** Replaces the footer action, e.g. with several links. Receives `close`. */
  footer?: (props: { close: () => void }) => unknown;
  /** Shown when no cluster matches the search, or the list is empty. */
  empty?: (props: { query: string }) => unknown;
}>();

const TONES = {
  success: ["active", "ready", "connected", "running", "healthy", "true"],
  danger: ["notready", "lost", "notconnected", "disconnected", "error", "failed", "critical", "unhealthy", "false"],
  warning: ["pending", "connecting", "provisioning", "importing", "registered", "updating", "deleting", "unknown"],
} as const;
const DOT = { success: "bg-success", danger: "bg-danger", warning: "bg-warning", neutral: "bg-slate-60" } as const;
const TEXT = { success: "text-green-30", danger: "text-red-30", warning: "text-yellow-30", neutral: "text-muted" } as const;

const sidebar = inject<SidebarContext | null>("ac-sidebar", null);

const id = useId();
const panelId = `${id}-panel`;
const listId = `${id}-list`;
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const query = ref("");
const activeIndex = ref(-1);
const failedIcons = ref(new Set<string>());
const style = ref<Record<string, string>>({});
const fromTop = ref(true);

const rail = computed(() => props.sidebarCollapsed ?? sidebar?.rail.value ?? false);
const onDark = computed(() => sidebar?.dark.value ?? false);
const selected = computed<SwitchCluster | null>(() => {
  if (!model.value) return null;
  return props.clusterOptions.find((c) => c.name === model.value) ?? { name: model.value };
});
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.clusterOptions;
  return props.clusterOptions.filter((c) =>
    [c.name, c.displayName, c.provider, c.location].some((v) => v?.toLowerCase().includes(q)),
  );
});
const triggerLabel = computed(() =>
  selected.value ? `Cluster: ${nameOf(selected.value)}${selected.value.status ? `, ${selected.value.status}` : ""}. Switch cluster` : "Select a cluster",
);

function nameOf(c: SwitchCluster) {
  return c.displayName || c.name;
}

function isDisabled(c: SwitchCluster) {
  return !!(c.disabled || c.$isDisabled);
}

function toneOf(status?: string) {
  const key = (status ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (!key) return "neutral";
  for (const tone of ["success", "danger", "warning"] as const) if ((TONES[tone] as readonly string[]).includes(key)) return tone;
  return "neutral";
}

function iconUrl(provider?: string) {
  if (!props.providerIconBase || !provider || failedIcons.value.has(provider)) return "";
  return `${props.providerIconBase}/${provider}.png`;
}

function onIconError(provider?: string) {
  if (provider) failedIcons.value = new Set(failedIcons.value).add(provider);
}

function optionId(i: number) {
  return `${id}-opt-${i}`;
}

function firstEnabled(from = 0, step = 1) {
  const list = filtered.value;
  for (let i = from; i >= 0 && i < list.length; i += step) if (!isDisabled(list[i]!)) return i;
  return -1;
}

function move(step: number) {
  const list = filtered.value;
  if (!list.length) return;
  let i = activeIndex.value;
  for (let n = 0; n < list.length; n++) {
    i = (i + step + list.length) % list.length;
    if (!isDisabled(list[i]!)) break;
  }
  activeIndex.value = i;
  scrollActiveIntoView();
}

function scrollActiveIntoView() {
  nextTick(() => listEl.value?.querySelector(`#${CSS.escape(optionId(activeIndex.value))}`)?.scrollIntoView({ block: "nearest" }));
}

function place() {
  const el = trigger.value;
  if (!el || !panel.value) return;
  const r = el.getBoundingClientRect();
  const gap = 6;
  const margin = 8;
  const width = Math.min(Math.max(rail.value ? 288 : r.width, 288), window.innerWidth - margin * 2);
  panel.value.style.width = `${width}px`;
  const h = panel.value.offsetHeight;
  if (rail.value) {
    const fits = r.top + h <= window.innerHeight - margin;
    fromTop.value = fits;
    style.value = {
      ...(fits ? { top: `${r.top}px` } : { bottom: `${margin}px` }),
      left: `${Math.min(r.right + gap, window.innerWidth - width - margin)}px`,
      width: `${width}px`,
      maxHeight: `${window.innerHeight - margin * 2}px`,
    };
    return;
  }
  const below = window.innerHeight - r.bottom - gap - margin;
  const above = r.top - gap - margin;
  const up = below < h && above > below;
  fromTop.value = !up;
  style.value = {
    [up ? "bottom" : "top"]: `${up ? window.innerHeight - r.top + gap : r.bottom + gap}px`,
    left: `${Math.max(margin, Math.min(r.left, window.innerWidth - width - margin))}px`,
    width: `${width}px`,
    maxHeight: `${Math.max(up ? above : below, 200)}px`,
  };
}

function show() {
  if (props.disabled || props.loading) return;
  open.value = true;
}

function close(refocus = true) {
  if (!open.value) return;
  open.value = false;
  if (refocus) trigger.value?.focus();
}

function choose(c: SwitchCluster) {
  if (isDisabled(c)) return;
  model.value = c.name;
  emit("select", c);
  close();
}

function onImport() {
  emit("import");
  close(false);
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (open.value || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
  e.preventDefault();
  show();
}

function onListKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    move(e.key === "ArrowDown" ? 1 : -1);
  } else if ((e.key === "Home" || e.key === "End") && !props.searchable) {
    e.preventDefault();
    activeIndex.value = e.key === "Home" ? firstEnabled() : firstEnabled(filtered.value.length - 1, -1);
    scrollActiveIntoView();
  } else if (e.key === "Enter" || (e.key === " " && !props.searchable)) {
    e.preventDefault();
    const c = filtered.value[activeIndex.value];
    if (c) choose(c);
  }
}

function onPanelKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    // defaultPrevented tells an enclosing AcModal or AcSidePanel not to close too
    e.preventDefault();
    close();
  } else if (e.key === "Tab") {
    onTab(e);
  }
}

// Leaving the panel by Tab closes it and continues from the trigger, since the panel lives at the end of <body>.
function onTab(e: KeyboardEvent) {
  const focusables = [...(panel.value?.querySelectorAll<HTMLElement>('input, a[href], button:not([disabled]), [tabindex="0"]') ?? [])];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    close();
  } else if (!e.shiftKey && document.activeElement === last) close();
}

function onPointerDown(e: PointerEvent) {
  const t = e.target as Node;
  if (trigger.value?.contains(t) || panel.value?.contains(t)) return;
  close(false);
}

function onViewportChange(e?: Event) {
  if (e && panel.value?.contains(e.target as Node)) return;
  place();
}

function listen(on: boolean) {
  const method = on ? "addEventListener" : "removeEventListener";
  document[method]("pointerdown", onPointerDown as EventListener, true);
  window[method]("scroll", onViewportChange, true);
  window[method]("resize", onViewportChange);
}

watch(open, async (v) => {
  listen(v);
  if (!v) return;
  query.value = "";
  const current = filtered.value.findIndex((c) => c.name === model.value);
  activeIndex.value = current >= 0 ? current : firstEnabled();
  await nextTick();
  place();
  (props.searchable ? searchInput.value : listEl.value)?.focus();
  scrollActiveIntoView();
});

watch(query, () => {
  activeIndex.value = firstEnabled();
  nextTick(place);
});

onBeforeUnmount(() => listen(false));

defineExpose({
  /** Moves focus to the trigger. */
  focus: () => trigger.value?.focus(),
});
</script>

<template>
  <div class="min-w-0" :class="rail ? 'inline-flex' : 'flex w-full'" data-ac-ds data-testid="ac-cluster-switcher">
    <div
      v-if="loading"
      role="status"
      aria-label="Loading clusters"
      class="flex h-10 items-center rounded-8 border"
      :class="[rail ? 'size-10 justify-center' : 'w-full gap-2.5 px-2', onDark ? 'border-white/10' : 'border-border']"
      data-ac-ds
      data-testid="ac-cluster-switcher-loading"
    >
      <AcSkeleton shape="rect" width="28px" height="28px" label="" class="shrink-0" />
      <AcSkeleton v-if="!rail" shape="text" width="60%" height="10px" label="" />
    </div>

    <button
      v-else
      :id="`${id}-trigger`"
      ref="trigger"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? panelId : undefined"
      :aria-label="triggerLabel"
      :title="rail && selected ? nameOf(selected) : undefined"
      :disabled="disabled"
      class="group relative flex h-10 min-w-0 cursor-pointer items-center rounded-8 border text-left transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      :class="[
        rail ? 'size-10 justify-center' : 'w-full gap-2.5 pr-2 pl-2',
        onDark
          ? 'border-white/10 bg-white/4 enabled:hover:bg-white/8'
          : 'border-border bg-surface shadow-xs enabled:hover:border-border-dark',
        open && (onDark ? 'bg-white/8' : 'border-border-dark'),
      ]"
      data-ac-ds
      data-testid="ac-cluster-switcher-trigger"
      @click="open ? close() : show()"
      @keydown="onTriggerKeydown"
    >
      <span
        class="relative inline-flex size-7 shrink-0 items-center justify-center rounded-6 bg-surface ring-1 ring-border-light ring-inset"
        aria-hidden="true"
      >
        <img
          v-if="iconUrl(selected?.provider)"
          :src="iconUrl(selected?.provider)"
          alt=""
          class="size-5 object-contain"
          @error="onIconError(selected?.provider)"
        />
        <Cloud v-else class="size-4 text-muted" />
        <span
          v-if="selected"
          class="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2"
          :class="[DOT[toneOf(selected.status)], onDark ? 'ring-sidebar' : 'ring-surface']"
        />
      </span>
      <template v-if="!rail">
        <span class="min-w-0 flex-1">
          <span class="block truncate text-base leading-5 font-medium" :class="selected ? 'text-heading' : 'text-muted'">
            {{ selected ? nameOf(selected) : placeholder }}
          </span>
          <span v-if="selected?.location" class="block truncate text-sm text-muted">{{ selected.location }}</span>
        </span>
        <ChevronsUpDown class="size-4 shrink-0 text-muted transition-colors group-hover:text-heading" aria-hidden="true" />
      </template>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        :enter-from-class="`opacity-0 motion-safe:scale-[0.98] ${rail ? 'motion-safe:-translate-x-1' : fromTop ? 'motion-safe:-translate-y-1' : 'motion-safe:translate-y-1'}`"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          :id="panelId"
          ref="panel"
          role="dialog"
          aria-label="Switch cluster"
          class="fixed z-[90] flex max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-10 border border-border bg-surface shadow-lg"
          :class="rail ? 'origin-left' : fromTop ? 'origin-top' : 'origin-bottom'"
          :style="style"
          data-ac-ds
          data-testid="ac-cluster-switcher-panel"
          @keydown="onPanelKeydown"
        >
          <div v-if="searchable" class="border-b border-border-light p-1.5">
            <div class="relative">
              <Search class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="true"
                :aria-controls="listId"
                :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
                :aria-label="searchPlaceholder"
                :placeholder="searchPlaceholder"
                autocomplete="off"
                spellcheck="false"
                class="h-8 w-full rounded-6 bg-surface-muted pr-2 pl-8 text-base text-heading outline-none placeholder:text-muted focus:bg-surface focus:ring-1 focus:ring-border"
                data-ac-ds
                data-testid="ac-cluster-switcher-search"
                @keydown="onListKeydown"
              />
            </div>
          </div>

          <ul
            :id="listId"
            ref="listEl"
            role="listbox"
            aria-label="Clusters"
            :tabindex="searchable ? -1 : 0"
            :aria-activedescendant="!searchable && activeIndex >= 0 ? optionId(activeIndex) : undefined"
            class="ac-scrollbar max-h-72 min-h-0 flex-1 p-1 outline-none"
            @keydown="onListKeydown"
          >
            <li
              v-for="(cluster, index) in filtered"
              :id="optionId(index)"
              :key="cluster.name"
              role="option"
              :aria-selected="cluster.name === model"
              :aria-disabled="isDisabled(cluster) || undefined"
              class="flex items-center gap-2.5 rounded-6 px-2 py-1.5 transition-colors duration-75"
              :class="[isDisabled(cluster) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', index === activeIndex && 'bg-surface-muted']"
              data-ac-ds
              data-testid="ac-cluster-switcher-option"
              @mouseenter="!isDisabled(cluster) && (activeIndex = index)"
              @mousedown.prevent
              @click="choose(cluster)"
            >
              <slot name="option" :cluster="cluster" :selected="cluster.name === model" :active="index === activeIndex">
                <span
                  class="inline-flex size-7 shrink-0 items-center justify-center rounded-6 bg-surface ring-1 ring-border ring-inset"
                  aria-hidden="true"
                >
                  <img
                    v-if="iconUrl(cluster.provider)"
                    :src="iconUrl(cluster.provider)"
                    alt=""
                    class="size-5 object-contain"
                    @error="onIconError(cluster.provider)"
                  />
                  <Cloud v-else class="size-4 text-muted" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-base leading-5 text-heading" :class="cluster.name === model && 'font-medium'">
                    {{ nameOf(cluster) }}
                  </span>
                  <span class="flex min-w-0 items-center gap-1.5 text-xs text-muted">
                    <span v-if="cluster.status" class="inline-flex shrink-0 items-center gap-1" :class="TEXT[toneOf(cluster.status)]">
                      <span class="size-1.5 rounded-full" :class="DOT[toneOf(cluster.status)]" aria-hidden="true" />
                      {{ cluster.status }}
                    </span>
                    <span v-if="cluster.status && (cluster.location || cluster.provider)" aria-hidden="true">·</span>
                    <span class="truncate">{{ [cluster.provider, cluster.location].filter(Boolean).join(" · ") }}</span>
                  </span>
                </span>
                <Check v-if="cluster.name === model" class="size-4 shrink-0 text-primary" aria-hidden="true" />
              </slot>
            </li>
            <li v-if="!filtered.length" role="presentation" class="px-3 py-6 text-center text-base text-muted">
              <slot name="empty" :query="query">{{ query ? `No clusters match “${query}”` : "No clusters yet" }}</slot>
            </li>
          </ul>

          <div v-if="$slots.footer || importLabel" class="border-t border-border-light p-1">
            <slot name="footer" :close="close">
              <component
                :is="importUrl ? 'a' : 'button'"
                :href="importUrl || undefined"
                :type="importUrl ? undefined : 'button'"
                class="flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-6 px-2 text-base text-body no-underline outline-none transition-colors hover:bg-surface-muted hover:text-heading focus-visible:bg-surface-muted focus-visible:text-heading focus-visible:ring-[3px] focus-visible:ring-ring"
                data-ac-ds
                data-testid="ac-cluster-switcher-import"
                @click="onImport"
              >
                <Plus class="size-4 shrink-0 text-muted" aria-hidden="true" />
                {{ importLabel }}
              </component>
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
