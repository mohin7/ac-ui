<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Activity,
  Bell,
  Building2,
  CircleHelp,
  Database,
  DatabaseBackup,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Monitor,
  Plus,
  Settings,
  Smartphone,
  Terminal,
} from "lucide-vue-next";
import {
  AcBadge,
  AcButton,
  AcCard,
  AcHeader,
  AcNavbar,
  AcNavbarItem,
  AcSearchBar,
  AcSegmentedControl,
  AcSidebar,
  AcSidebarItem,
  AcSidebarSection,
  AcTable,
  AcUserMenu,
} from "@/lib";

interface Database extends Record<string, unknown> {
  name: string;
  engine: "Postgres" | "MongoDB" | "Redis";
  version: string;
  namespace: string;
  status: "Ready" | "Provisioning" | "Critical";
}

const PAGES: Record<string, string> = {
  overview: "Overview",
  postgres: "Postgres",
  mongodb: "MongoDB",
  redis: "Redis",
  backups: "Backups",
  monitoring: "Monitoring",
  settings: "Settings",
};
const DATABASES: Database[] = [
  { name: "demo-postgres", engine: "Postgres", version: "16.1", namespace: "demo", status: "Ready" },
  { name: "billing-pg", engine: "Postgres", version: "15.5", namespace: "billing", status: "Ready" },
  { name: "analytics-pg", engine: "Postgres", version: "16.1", namespace: "data", status: "Provisioning" },
  { name: "orders-mongo", engine: "MongoDB", version: "7.0.5", namespace: "shop", status: "Ready" },
  { name: "catalog-mongo", engine: "MongoDB", version: "6.0.12", namespace: "shop", status: "Ready" },
  { name: "cache-redis", engine: "Redis", version: "7.2.4", namespace: "shop", status: "Critical" },
];
const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "engine", label: "Engine" },
  { key: "namespace", label: "Namespace" },
  { key: "status", label: "Status" },
];
const STATUS = { Ready: "success", Provisioning: "info", Critical: "danger" } as const;
const MENU_ITEMS = [
  { label: "Organizations", icon: Building2 },
  { label: "API tokens", icon: KeyRound },
];

const sidebar = ref<InstanceType<typeof AcSidebar> | null>(null);
const collapsed = ref(false);
const menuOpen = ref(false);
const look = ref<"light" | "dark">("dark");
const width = ref<"desktop" | "phone">("desktop");
const current = ref("postgres");
const query = ref("");

const title = computed(() => PAGES[current.value] ?? "Overview");
const rows = computed(() => {
  const engine = ["Postgres", "MongoDB", "Redis"].find((e) => e.toLowerCase() === current.value);
  return DATABASES.filter((d) => !engine || d.engine === engine).filter((d) => d.name.includes(query.value.trim().toLowerCase()));
});
const stats = computed(() => [
  { label: "Databases", value: rows.value.length },
  { label: "Ready", value: rows.value.filter((d) => d.status === "Ready").length },
  { label: "Needs attention", value: rows.value.filter((d) => d.status !== "Ready").length },
]);

function count(engine: Database["engine"]) {
  return DATABASES.filter((d) => d.engine === engine).length;
}

function tone(status: unknown) {
  return STATUS[status as Database["status"]];
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 border-b border-border-light px-4 py-3">
    <AcSegmentedControl
      v-model="look"
      size="small"
      aria-label="Sidebar style"
      :options="[
        { value: 'light', label: 'Light sidebar' },
        { value: 'dark', label: 'Dark sidebar' },
      ]"
    />
    <AcSegmentedControl
      v-model="width"
      size="small"
      aria-label="Preview width"
      :options="[
        { value: 'desktop', label: 'Desktop', icon: Monitor },
        { value: 'phone', label: 'Phone', icon: Smartphone },
      ]"
    />
  </div>

  <div class="bg-surface-sunken p-2 sm:p-4">
    <!-- `relative` + `contained` keep the drawer inside this box; the box is narrower than a laptop window, so the drawer starts at 640px. -->
    <div
      class="@container relative mx-auto flex h-[640px] overflow-hidden rounded-10 border border-border bg-surface shadow-sm transition-[max-width] duration-300 motion-reduce:transition-none"
      :class="width === 'phone' ? 'max-w-[375px]' : 'max-w-full'"
    >
      <AcSidebar
        ref="sidebar"
        v-model:collapsed="collapsed"
        v-model:mobile-open="menuOpen"
        :dark="look === 'dark'"
        contained
        :breakpoint="640"
        label="Console"
      >
        <template #header="{ collapsed: rail }">
          <span class="flex items-center gap-2.5">
            <img src="/logos/appscode-mark.png" alt="" class="size-6 shrink-0 rounded-6" />
            <span v-if="!rail" class="text-lg font-semibold tracking-[-0.01em] text-heading">KubeDB</span>
          </span>
        </template>

        <AcSidebarSection>
          <AcSidebarItem label="Overview" :icon="LayoutDashboard" :active="current === 'overview'" @click="current = 'overview'" />
          <AcSidebarItem label="Databases" :icon="Database">
            <AcSidebarItem label="Postgres" :badge="count('Postgres')" :active="current === 'postgres'" @click="current = 'postgres'" />
            <AcSidebarItem label="MongoDB" :badge="count('MongoDB')" :active="current === 'mongodb'" @click="current = 'mongodb'" />
            <AcSidebarItem label="Redis" :badge="count('Redis')" :active="current === 'redis'" @click="current = 'redis'" />
          </AcSidebarItem>
          <AcSidebarItem label="Backups" :icon="DatabaseBackup" :active="current === 'backups'" @click="current = 'backups'" />
          <AcSidebarItem label="Monitoring" :icon="Activity" badge="1" badge-color="danger" :active="current === 'monitoring'" @click="current = 'monitoring'" />
        </AcSidebarSection>
        <AcSidebarSection label="Admin">
          <AcSidebarItem label="Settings" :icon="Settings" :active="current === 'settings'" @click="current = 'settings'" />
        </AcSidebarSection>

        <template #footer>
          <AcSidebarItem label="Help & docs" :icon="LifeBuoy" href="https://kubedb.com/docs" />
        </template>
      </AcSidebar>

      <div class="flex min-w-0 flex-1 flex-col">
        <AcNavbar menu-button="always" menu-label="Toggle navigation" :sticky="false" @menu="sidebar?.toggle()">
          <template #search>
            <AcSearchBar v-model="query" placeholder="Search databases" :debounce="0" class="@max-xl:hidden" />
          </template>
          <template #actions>
            <AcNavbarItem label="Create database" :icon="Plus" icon-only />
            <AcNavbarItem label="Terminal" :icon="Terminal" icon-only class="@max-xl:hidden" />
            <AcNavbarItem label="Notifications" :icon="Bell" icon-only :badge="3" />
            <AcNavbarItem label="Help" :icon="CircleHelp" icon-only class="@max-xl:hidden" />
            <AcUserMenu name="Mohin Uddin" email="mohin@appscode.com" :items="MENU_ITEMS" :show-name="false" show-theme-mode class="ml-1" />
          </template>
        </AcNavbar>

        <main class="ac-scrollbar min-h-0 flex-1 bg-surface-muted">
          <AcHeader :title="title" subtitle="demo-cluster · all namespaces" sticky>
            <template #breadcrumb>demo-cluster / Databases</template>
            <AcButton title="Create" size="small">
              <template #icon><Plus aria-hidden="true" /></template>
            </AcButton>
          </AcHeader>

          <div class="space-y-5 p-4 sm:p-6">
            <div class="grid grid-cols-3 gap-3">
              <div v-for="s in stats" :key="s.label" class="rounded-10 border border-border bg-surface px-4 py-3 shadow-xs">
                <p class="text-xs text-muted">{{ s.label }}</p>
                <p class="mt-1 text-2xl font-semibold text-heading tabular-nums">{{ s.value }}</p>
              </div>
            </div>

            <AcCard title="Instances" :padded="false">
              <AcTable :columns="COLUMNS" :rows="rows" row-key="name" empty-text="No databases match.">
                <template #cell-name="{ value }">
                  <span class="font-mono text-[12.5px] font-medium text-heading">{{ value }}</span>
                </template>
                <template #cell-status="{ value }">
                  <AcBadge :label="String(value)" :color="tone(value)" variant="light" rounded dot />
                </template>
              </AcTable>
            </AcCard>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
