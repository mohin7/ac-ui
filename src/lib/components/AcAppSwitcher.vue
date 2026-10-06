<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { Check, ChartLine, Database, GraduationCap, Grip, Receipt, Server, ServerCog, Telescope } from "lucide-vue-next";
import AcLogo from "./AcLogo.vue";
import AcNavbarItem from "./AcNavbarItem.vue";
import type { Component } from "vue";

export interface AppSwitcherApp {
  /** Key of the app. Also the URL path: `db` opens `${baseUrl}/db/`. */
  name: string;
  /** Product name on the tile. */
  title: string;
  /** One line about the app. Old `sub_title`. */
  subtitle?: string;
  /** Full URL. Without it the URL is built from `baseUrl`, `name` and `port`. */
  url?: string;
  /** Dev-server port, used when `baseUrl` is `localhost` or `bb.test`. */
  port?: string;
  /** A Lucide icon component for the tile. */
  icon?: Component;
  /** Image URL for the tile, e.g. a product logo PNG. Wins over `icon`. Old `icon_url`. */
  iconUrl?: string;
  /** Tint of the icon tile. */
  color?: "primary" | "blue" | "green" | "yellow" | "purple" | "red" | "slate";
}

export interface Props {
  /** The app this is rendered in. It's marked as current (or hidden with `hideCurrent`). `id` is accepted as `platform`. */
  currentApp?: "console" | "db" | "platform" | "id" | "billing" | "selfhost" | "learn" | "grafana" | "observe" | (string & {});
  /** Origin the app URLs are built on, e.g. `https://appscode.com`. `localhost` and `bb.test` use each app's dev port. Any other origin counts as self-hosted. */
  baseUrl?: string;
  /** Organization to open Grafana in; written to the `gorg` cookie when Grafana is clicked. */
  activeOrganization?: string;
  /** Cookie domain for `gorg`, e.g. `.appscode.com`. */
  rootDomain?: string;
  /** Type of the active organization. Type `3` (client org) has no Console; type `6` keeps Billing on an offline installer. */
  activeOrgType?: number;
  /** Air-gapped offline installer: on a self-hosted origin, Billing stays in the list for org type `6`. */
  isOfflineInstaller?: boolean;
  /** Replaces the built-in AppsCode list. Entries without `url` get one built from `baseUrl`; the self-host and org-type rules aren't applied. */
  apps?: AppSwitcherApp[];
  /** Leaves the current app out of the grid, as the old component did. */
  hideCurrent?: boolean;
  /** Accessible name of the grid button, and the panel heading. */
  label?: string;
  /** Which edge of the button the panel lines up with. `end` suits the right side of the navbar. */
  align?: "start" | "end";
}

const props = withDefaults(defineProps<Props>(), {
  currentApp: "platform",
  baseUrl: "https://appscode.com",
  activeOrganization: "",
  rootDomain: "",
  activeOrgType: 0,
  isOfflineInstaller: false,
  apps: undefined,
  hideCurrent: false,
  label: "AppsCode apps",
  align: "end",
});

/** Whether the panel is open. Bind with `v-model:open`. */
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  /** An app was clicked, before the browser follows its link. */
  select: [app: AppSwitcherApp & { url: string }];
}>();

defineSlots<{
  /** Content under the grid, e.g. a link to all products. */
  footer?: (props: { close: () => void }) => unknown;
}>();

const PLATFORM = "id";
const BUILT_IN: AppSwitcherApp[] = [
  { name: PLATFORM, title: "Platform", port: "8080", subtitle: "Manage your platform & accounts" },
  { name: "db", title: "KubeDB", port: "5996", subtitle: "Manage your databases", icon: Database, color: "purple" },
  { name: "grafana", title: "Grafana", port: "3005", subtitle: "Analyze your activities", icon: ChartLine, color: "yellow" },
  { name: "observe", title: "Observe", port: "5992", subtitle: "Observe your system", icon: Telescope, color: "green" },
  { name: "selfhost", title: "SelfHost", port: "5993", subtitle: "Host AppsCode on your own cluster", icon: ServerCog, color: "slate" },
  { name: "billing", title: "Billing", port: "5995", subtitle: "Manage your contracts, licenses & billings", icon: Receipt, color: "primary" },
  { name: "learn", title: "Learn", port: "5988", subtitle: "Be an Expert in Cloud Native technologies", icon: GraduationCap, color: "red" },
];
const CONSOLE: AppSwitcherApp = { name: "console", title: "Console", port: "5990", subtitle: "Manage your kubernetes clusters", icon: Server, color: "blue" };
const HOSTED_ORIGINS = ["https://appscode.ninja", "https://appscode.com", "http://bb.test:8080"];
const HOSTED_ONLY = ["billing", "selfhost", "learn"];
const CLIENT_ORG = 3;
const OFFLINE_BILLING_ORG = 6;
const TILE: Record<NonNullable<AppSwitcherApp["color"]>, string> = {
  primary: "bg-primary-95 text-primary-30",
  blue: "bg-blue-95 text-blue-40",
  green: "bg-green-95 text-green-30",
  yellow: "bg-yellow-95 text-yellow-30",
  purple: "bg-purple-95 text-purple-40",
  red: "bg-red-95 text-red-40",
  slate: "bg-slate-90 text-label",
};

const id = useId();
const panelId = `${id}-panel`;
const headingId = `${id}-heading`;
const trigger = ref<InstanceType<typeof AcNavbarItem> | null>(null);
const panel = ref<HTMLElement | null>(null);
const style = ref<Record<string, string>>({});
const fromTop = ref(true);

const currentName = computed(() => (props.currentApp === "platform" ? PLATFORM : props.currentApp));
const isSelfHosted = computed(() => !HOSTED_ORIGINS.includes(props.baseUrl));

const builtInList = computed(() => {
  const list = [...BUILT_IN];
  if (props.activeOrgType !== CLIENT_ORG) list.splice(1, 0, CONSOLE);
  return list.filter((app) => {
    if (!isSelfHosted.value || !HOSTED_ONLY.includes(app.name)) return true;
    return app.name === "billing" && props.isOfflineInstaller && props.activeOrgType === OFFLINE_BILLING_ORG;
  });
});

const appList = computed(() =>
  (props.apps ?? builtInList.value)
    .filter((app) => !props.hideCurrent || app.name !== currentName.value)
    .map((app) => ({ ...app, url: app.url ?? urlFor(app) })),
);

function urlFor(app: AppSwitcherApp) {
  if (props.baseUrl.includes("bb.test")) return `http://bb.test:${app.port}/${app.name}/`;
  if (props.baseUrl.includes("localhost")) return `http://localhost:${app.port}/${app.name}/`;
  return `${props.baseUrl}/${app.name}/`;
}

function isCurrent(app: AppSwitcherApp) {
  return app.name === currentName.value;
}

function triggerEl() {
  return (trigger.value?.$el as HTMLElement | undefined) ?? null;
}

function tiles() {
  return [...(panel.value?.querySelectorAll<HTMLElement>("[data-app-tile]") ?? [])];
}

function columns(list: HTMLElement[]) {
  const top = list[0]?.offsetTop;
  const count = list.filter((el) => el.offsetTop === top).length;
  return Math.max(count, 1);
}

function focusTile(index: number) {
  const list = tiles();
  if (!list.length) return;
  list[Math.max(0, Math.min(index, list.length - 1))]!.focus();
}

function place() {
  const el = triggerEl();
  if (!el || !panel.value) return;
  const r = el.getBoundingClientRect();
  const gap = 6;
  const margin = 8;
  const { offsetWidth: w, offsetHeight: h } = panel.value;
  const below = window.innerHeight - r.bottom - gap - margin;
  const above = r.top - gap - margin;
  const up = below < h && above > below;
  const left = props.align === "end" ? r.right - w : r.left;
  fromTop.value = !up;
  style.value = {
    [up ? "bottom" : "top"]: `${up ? window.innerHeight - r.top + gap : r.bottom + gap}px`,
    left: `${Math.max(margin, Math.min(left, window.innerWidth - w - margin))}px`,
    maxHeight: `${Math.max(up ? above : below, 160)}px`,
  };
}

function close(refocus = true) {
  if (!open.value) return;
  open.value = false;
  if (refocus) triggerEl()?.focus();
}

function toggle() {
  if (open.value) close();
  else open.value = true;
}

function setGrafanaCookie() {
  const parts = [`gorg=${encodeURIComponent(props.activeOrganization)}`, "path=/"];
  if (props.rootDomain) parts.push(`domain=${props.rootDomain}`);
  document.cookie = parts.join("; ");
}

function choose(app: AppSwitcherApp & { url: string }) {
  if (app.name === "grafana") setGrafanaCookie();
  emit("select", app);
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key !== "ArrowDown" || open.value) return;
  e.preventDefault();
  open.value = true;
}

function onPanelKeydown(e: KeyboardEvent) {
  const list = tiles();
  const current = list.indexOf(document.activeElement as HTMLElement);
  const cols = columns(list);
  const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
  if (e.key in moves && current >= 0) {
    e.preventDefault();
    focusTile(current + moves[e.key]!);
  } else if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    focusTile(e.key === "Home" ? 0 : list.length - 1);
  } else if (e.key === "Escape") {
    // defaultPrevented tells an enclosing AcModal or AcSidePanel not to close too
    e.preventDefault();
    close();
  } else if (e.key === "Tab") {
    onTab(e);
  }
}

// Leaving the panel by Tab closes it and continues from the button, since the panel lives at the end of <body>.
function onTab(e: KeyboardEvent) {
  const focusables = [...(panel.value?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    close();
  } else if (!e.shiftKey && document.activeElement === last) close();
}

function onPointerDown(e: PointerEvent) {
  const t = e.target as Node;
  if (triggerEl()?.contains(t) || panel.value?.contains(t)) return;
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
  await nextTick();
  place();
  const list = tiles();
  const currentIndex = appList.value.findIndex(isCurrent);
  focusTile(currentIndex >= 0 && list[currentIndex] ? currentIndex : 0);
});

onBeforeUnmount(() => listen(false));
</script>

<template>
  <div class="inline-flex" data-ac-ds data-testid="ac-app-switcher">
    <AcNavbarItem
      ref="trigger"
      :label="label"
      :icon="Grip"
      icon-only
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? panelId : undefined"
      :class="open && 'bg-surface-sunken text-heading'"
      data-ac-ds
      data-testid="ac-app-switcher-trigger"
      @click="toggle"
      @keydown="onTriggerKeydown"
    />

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        :enter-from-class="`opacity-0 motion-safe:scale-[0.98] ${fromTop ? 'motion-safe:-translate-y-1' : 'motion-safe:translate-y-1'}`"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          :id="panelId"
          ref="panel"
          role="dialog"
          :aria-labelledby="headingId"
          class="ac-scrollbar fixed z-[90] flex w-[calc(340px*var(--ac-scale))] max-w-[calc(100vw-16px)] flex-col rounded-10 border border-border bg-surface shadow-lg"
          :class="fromTop ? 'origin-top-right' : 'origin-bottom-right'"
          :style="style"
          data-ac-ds
          data-testid="ac-app-switcher-panel"
          @keydown="onPanelKeydown"
        >
          <p :id="headingId" class="px-4 pt-3.5 pb-1 text-xs font-medium text-label">{{ label }}</p>
          <ul role="list" class="grid grid-cols-3 gap-1 p-2">
            <li v-for="app in appList" :key="app.name">
              <a
                :href="app.url"
                data-app-tile
                :aria-current="isCurrent(app) ? 'page' : undefined"
                :title="app.subtitle || undefined"
                class="group relative flex h-full flex-col items-center gap-2 rounded-8 px-1.5 pt-3 pb-2.5 text-center no-underline outline-none transition-colors hover:bg-surface-muted focus-visible:ring-[3px] focus-visible:ring-ring aria-[current=page]:bg-primary-97"
                data-ac-ds
                data-testid="ac-app-switcher-app"
                @click="choose(app)"
              >
                <span
                  class="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-10 ring-1 ring-border-light transition-transform duration-150 ring-inset motion-safe:group-hover:-translate-y-px"
                  :class="app.iconUrl || (app.name === PLATFORM && !app.icon) ? 'bg-surface' : TILE[app.color ?? 'slate']"
                  aria-hidden="true"
                >
                  <img v-if="app.iconUrl" :src="app.iconUrl" alt="" class="size-7 object-contain" />
                  <component :is="app.icon" v-else-if="app.icon" class="size-5" />
                  <AcLogo v-else-if="app.name === PLATFORM" variant="mark" :size="28" label="" />
                  <span v-else class="text-lg font-semibold">{{ app.title.charAt(0) }}</span>
                </span>
                <span class="w-full truncate text-xs font-medium text-heading">{{ app.title }}</span>
                <span v-if="app.subtitle" class="sr-only">{{ app.subtitle }}</span>
                <span
                  v-if="isCurrent(app)"
                  class="absolute top-1.5 right-1.5 inline-flex size-4 items-center justify-center rounded-full bg-primary text-white"
                  aria-hidden="true"
                >
                  <Check class="size-2.5" :stroke-width="3" />
                </span>
              </a>
            </li>
          </ul>
          <div v-if="$slots.footer" class="border-t border-border-light p-2">
            <slot name="footer" :close="close" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
