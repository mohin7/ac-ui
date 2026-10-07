<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Activity,
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
} from "@lucide/vue";
import {
  AcAppSwitcher,
  AcBadge,
  AcButton,
  AcCard,
  AcClusterSwitcher,
  AcHeader,
  AcLogo,
  AcNavbar,
  AcNavbarItem,
  AcNotificationMenu,
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
const CLUSTERS = [
  { name: "demo-cluster", displayName: "demo-cluster", provider: "EKS", location: "us-east-1", status: "Active" },
  { name: "prod-gke", displayName: "prod-gke", provider: "GKE", location: "europe-west1", status: "Active" },
  { name: "staging-aks", displayName: "staging-aks", provider: "AKS", location: "eastus2", status: "Active" },
  { name: "edge-linode", displayName: "edge-linode", provider: "Akamai", location: "ap-south", status: "NotReady", disabled: true },
];
const MINUTE = 60_000;
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
const cluster = ref("demo-cluster");
const notifications = ref([
  { id: 1, time: Date.now() - 3 * MINUTE, title: "cache-redis is critical", msg: "2 of 3 replicas are not ready.", status: "Failed", read: false },
  { id: 2, time: Date.now() - 12 * MINUTE, title: "Provisioning analytics-pg", msg: "Postgres 16.1 in namespace data.", status: "Running", read: false },
  { id: 3, time: Date.now() - 3 * 60 * MINUTE, title: "Backup succeeded", msg: "billing-pg · 1.2 GiB to s3://backups", status: "Success", read: true },
]);

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

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
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
        <template #header>
          <AcClusterSwitcher v-model="cluster" :cluster-options="CLUSTERS" />
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
          <template #brand>
            <span class="flex items-center gap-2">
              <AcLogo variant="mark" label="" />
              <span class="text-lg font-semibold tracking-[-0.01em] text-heading @max-md:hidden">KubeDB</span>
            </span>
          </template>
          <template #search>
            <AcSearchBar v-model="query" placeholder="Search databases" :debounce="0" class="@max-xl:hidden" />
          </template>
          <template #actions>
            <AcNavbarItem label="Create database" :icon="Plus" icon-only />
            <AcNavbarItem label="Terminal" :icon="Terminal" icon-only class="@max-xl:hidden" />
            <AcNavbarItem label="Help" :icon="CircleHelp" icon-only class="@max-xl:hidden" />
            <AcNotificationMenu :notifications="notifications" view-all-href="#/examples/app-shell" @mark-all-read="markAllRead" />
            <AcAppSwitcher current-app="db" base-url="https://appscode.com" class="@max-md:hidden" />
            <AcUserMenu name="Mohin Uddin" email="mohin@appscode.com" :items="MENU_ITEMS" :show-name="false" show-theme-mode class="ml-1" />
          </template>
        </AcNavbar>

        <main class="ac-scrollbar min-h-0 flex-1 bg-surface-muted">
          <AcHeader :title="title" :subtitle="`${cluster} · all namespaces`" sticky>
            <template #breadcrumb>{{ cluster }} / Databases</template>
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
