<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Download, EllipsisVertical, Pause, Play, Plug, RefreshCw, RotateCcw, Scaling, Trash2 } from "@lucide/vue";
import {
  AcAvatar,
  AcBadge,
  AcBreadcrumb,
  AcButton,
  AcCard,
  AcContentTable,
  AcDeleteModal,
  AcDropdown,
  AcDropdownDivider,
  AcDropdownItem,
  AcHeader,
  AcInfoTable,
  AcModal,
  AcPagination,
  AcProgress,
  AcSectionContent,
  AcSelect,
  AcSidePanel,
  AcSkeleton,
  AcSwitch,
  AcTable,
  AcTabs,
  AcTag,
  useToast,
} from "@/lib";
import type { Column, InfoItem, TabItem } from "@/lib";

type DbStatus = "Ready" | "Restarting" | "Halted" | "Terminating";
type BackupStatus = "Succeeded" | "Running" | "Failed";

interface Backup extends Record<string, unknown> {
  id: string;
  name: string;
  status: BackupStatus;
  size: string;
  duration: string;
  started: string;
}

const NAME = "demo-postgres";
const NAMESPACE = "demo";

const STATUS_TONE = { Ready: "success", Restarting: "info", Halted: "warning", Terminating: "danger" } as const;
const BACKUP_TONE = { Succeeded: "success", Running: "info", Failed: "danger" } as const;

const TABS: TabItem[] = [
  { key: "overview", label: "Overview" },
  { key: "backups", label: "Backups" },
  { key: "monitoring", label: "Monitoring" },
  { key: "settings", label: "Settings" },
];

const CONNECTION: InfoItem[] = [
  { label: "Host", value: `${NAME}.${NAMESPACE}.svc.cluster.local`, copyable: true, mono: true },
  { label: "Port", value: 5432, copyable: true, mono: true },
  { label: "Database", value: "postgres", copyable: true, mono: true },
  { label: "Username", value: "postgres", copyable: true, mono: true },
  { label: "Password", value: "Xk29-pQ7v-mR4t", copyable: true, secret: true },
  { label: "Auth secret", value: `${NAME}-auth`, copyable: true, mono: true },
  {
    label: "Connection string",
    value: `postgresql://postgres@${NAME}.${NAMESPACE}.svc.cluster.local:5432/postgres?sslmode=require`,
    copyable: true,
    mono: true,
  },
];

const CRUMBS = [
  { label: "demo-cluster", href: "#/examples/databases" },
  { label: "Databases", href: "#/examples/databases" },
  { label: NAME },
];

const FROM_LAPTOP: InfoItem[] = [
  { label: "Port-forward", value: `kubectl port-forward -n ${NAMESPACE} svc/${NAME} 5432:5432`, copyable: true, mono: true },
  {
    label: "Password",
    value: `kubectl get secret -n ${NAMESPACE} ${NAME}-auth -o jsonpath='{.data.password}' | base64 -d`,
    copyable: true,
    mono: true,
  },
];

const EVENTS = [
  { id: 1, actor: "KubeDB Operator", bot: true, reason: "Successful", tone: "success", text: "Backup daily-20260930-020000 completed in 2m 14s.", time: "3h ago" },
  { id: 2, actor: "KubeDB Operator", bot: true, reason: "Warning", tone: "warning", text: "Volume data-demo-postgres-0 is 96% full.", time: "5h ago" },
  { id: 3, actor: "Tamal Saha", bot: false, reason: "OpsRequest", tone: "primary", text: "Scaled replicas from 2 to 3.", time: "1d ago" },
  { id: 4, actor: "KubeDB Operator", bot: true, reason: "Successful", tone: "success", text: "demo-postgres-0 elected primary.", time: "2d ago" },
] as const;

const CONNECTIONS_BY_DB = [
  { db: "orders", count: 18 },
  { db: "inventory", count: 14 },
  { db: "postgres", count: 10 },
];

const BACKUP_COLUMNS: Column[] = [
  { key: "name", label: "Snapshot" },
  { key: "status", label: "Status" },
  { key: "size", label: "Size", align: "right" },
  { key: "duration", label: "Duration", align: "right" },
  { key: "started", label: "Started" },
  { key: "actions", label: "", align: "right", width: "48px" },
];

const SCHEDULES = [
  { value: "0 */6 * * *", label: "Every 6 hours" },
  { value: "0 2 * * *", label: "Daily at 02:00 UTC" },
  { value: "0 2 * * 0", label: "Weekly on Sunday" },
];
const RETENTION = [
  { value: "7d", label: "Keep 7 days" },
  { value: "30d", label: "Keep 30 days" },
  { value: "90d", label: "Keep 90 days" },
];
const SCRAPE = [
  { value: "15s", label: "Every 15 seconds" },
  { value: "30s", label: "Every 30 seconds" },
  { value: "60s", label: "Every minute" },
];
const REPLICA_OPTIONS = [1, 3, 5, 7].map((n) => ({ value: n, label: n === 1 ? "1 (standalone)" : `${n} replicas` }));

const router = useRouter();
const { success, info, toast } = useToast();

const status = ref<DbStatus>("Ready");
const replicas = ref(3);
const tab = ref("overview");
const connectOpen = ref(false);
const scaleOpen = ref(false);
const scaleTo = ref<number | null>(3);
const deleteOpen = ref(false);
const deleting = ref(false);

const backups = ref<Backup[]>(makeBackups(23));
const page = ref(1);
const pageSize = ref(5);

const metricsLoading = ref(true);
const metricsLoaded = ref(false);
let metricsTimer: ReturnType<typeof setTimeout> | undefined;
let restartTimer: ReturnType<typeof setTimeout> | undefined;
const backupTimers: ReturnType<typeof setTimeout>[] = [];

const settings = ref({
  scheduledBackup: true,
  schedule: "0 2 * * *" as string | null,
  retention: "30d" as string | null,
  exporter: true,
  scrape: "30s" as string | null,
  tls: true,
});

const overview = computed<InfoItem[]>(() => [
  { label: "Version", value: "PostgreSQL 16.1" },
  { label: "Mode", value: replicas.value > 1 ? "Cluster, streaming replication" : "Standalone" },
  { label: "Replicas", value: replicas.value > 1 ? `${replicas.value} (1 primary, ${replicas.value - 1} standbys)` : "1" },
  { label: "Storage class", value: "longhorn", mono: true },
  { label: "Namespace", value: NAMESPACE, mono: true },
  { label: "Created", value: "Sep 28, 2026, 10:42 UTC" },
]);

const usage = computed(() => [
  { label: "CPU", value: 420, max: 1000, text: "420m of 1 core" },
  { label: "Memory", value: 1.7, max: 2, text: "1.7 GiB of 2 GiB" },
  { label: "Storage", value: 9.6, max: 10, text: "9.6 GiB of 10 GiB" },
]);

const pods = computed(() =>
  Array.from({ length: replicas.value }, (_, i) => ({
    name: `${NAME}-${i}`,
    role: i === 0 ? "primary" : "standby",
  })),
);

const pagedBackups = computed(() => backups.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value));

const metrics = computed(() => [
  { label: "Active connections", value: "42", hint: "of 100 max_connections" },
  { label: "Transactions / sec", value: "1,284", hint: "+8% vs last hour" },
  { label: "Replication lag", value: replicas.value > 1 ? "12 ms" : "—", hint: replicas.value > 1 ? `${replicas.value - 1} standbys streaming` : "No standbys" },
  { label: "Cache hit ratio", value: "99.2%", hint: "shared_buffers 512 MiB" },
]);

function makeBackups(count: number): Backup[] {
  return Array.from({ length: count }, (_, i) => {
    const day = new Date(Date.UTC(2026, 8, 30 - i, 2));
    const stamp = day.toISOString().slice(0, 10).replaceAll("-", "");
    const failed = i === 4;
    return {
      id: stamp,
      name: `daily-${stamp}-020000`,
      status: failed ? "Failed" : "Succeeded",
      size: failed ? "—" : `${(1.42 - i * 0.012).toFixed(2)} GiB`,
      duration: failed ? "0m 38s" : `2m ${String(14 - (i % 9)).padStart(2, "0")}s`,
      started: day.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) + ", 02:00",
    };
  });
}

function goBack() {
  router.push("/examples/databases");
}

function restart() {
  status.value = "Restarting";
  info("Restart requested", { description: `OpsRequest ${NAME}-restart-x7k2p rolls the pods one at a time.` });
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => (status.value = "Ready"), 3000);
}

function openScale() {
  scaleTo.value = replicas.value;
  scaleOpen.value = true;
}

function applyScale() {
  scaleOpen.value = false;
  if (!scaleTo.value || scaleTo.value === replicas.value) return;
  success(`Scaling ${NAME} to ${scaleTo.value} replicas`, { description: "A HorizontalScaling OpsRequest was created." });
  replicas.value = scaleTo.value;
}

function togglePause() {
  const pausing = status.value !== "Halted";
  status.value = pausing ? "Halted" : "Ready";
  toast(pausing ? `${NAME} halted` : `${NAME} resumed`, {
    description: pausing ? "Pods are stopped. Volumes and secrets are kept." : "Pods are starting on the existing volumes.",
  });
}

async function confirmDelete() {
  deleting.value = true;
  await new Promise((r) => setTimeout(r, 900));
  deleting.value = false;
  deleteOpen.value = false;
  status.value = "Terminating";
  toast(`${NAME} is being deleted`, { description: "Backups in s3://kubedb-backups/demo are kept." });
}

function backupNow() {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "-");
  backups.value = [
    { id: stamp, name: `manual-${stamp}`, status: "Running", size: "—", duration: "—", started: "Just now" },
    ...backups.value,
  ];
  page.value = 1;
  const timer = setTimeout(() => finishBackup(stamp), 4000);
  backupTimers.push(timer);
  success("Backup started", { description: `Snapshot manual-${stamp} is uploading to s3://kubedb-backups/demo.` });
}

function finishBackup(id: string) {
  backups.value = backups.value.map((b) => (b.id === id ? { ...b, status: "Succeeded", size: "1.43 GiB", duration: "0m 04s" } : b));
}

function restore(row: Backup) {
  info(`Restore from ${row.name} queued`, { description: "A RestoreSession was created in namespace demo." });
}

function deleteBackup(row: Backup) {
  const before = backups.value;
  backups.value = before.filter((b) => b.id !== row.id);
  toast(`Snapshot ${row.name} deleted`, { action: { label: "Undo", onClick: () => (backups.value = before) } });
}

function loadMetrics() {
  metricsLoading.value = true;
  clearTimeout(metricsTimer);
  metricsTimer = setTimeout(() => {
    metricsLoading.value = false;
    metricsLoaded.value = true;
  }, 1200);
}

function saveSettings() {
  success("Settings saved", { description: "KubeDB is reconciling demo-postgres." });
}

watch(tab, (t) => {
  if (t === "monitoring" && !metricsLoaded.value) loadMetrics();
});

onBeforeUnmount(() => {
  clearTimeout(metricsTimer);
  clearTimeout(restartTimer);
  backupTimers.forEach(clearTimeout);
});
</script>

<template>
  <div class="@container min-h-[600px] bg-surface-muted">
    <AcHeader :title="NAME" back-button @back="goBack">
      <template #breadcrumb><AcBreadcrumb :items="CRUMBS" /></template>
      <template #title-extra>
        <AcBadge :label="status" :color="STATUS_TONE[status]" variant="light" rounded dot />
      </template>

      <AcButton title="Connect" color="white" :disabled="status !== 'Ready'" @click="connectOpen = true">
        <template #icon><Plug /></template>
      </AcButton>
      <AcDropdown align="end" :menu-label="`Actions for ${NAME}`">
        <template #trigger>
          <AcButton color="white" :aria-label="`More actions for ${NAME}`">
            <template #icon><EllipsisVertical /></template>
          </AcButton>
        </template>
        <AcDropdownItem label="Restart" :icon="RotateCcw" :disabled="status !== 'Ready'" @click="restart" />
        <AcDropdownItem label="Scale" :icon="Scaling" :disabled="status !== 'Ready'" @click="openScale" />
        <AcDropdownItem
          :label="status === 'Halted' ? 'Resume' : 'Pause'"
          :icon="status === 'Halted' ? Play : Pause"
          :disabled="status === 'Terminating'"
          @click="togglePause"
        />
        <AcDropdownDivider />
        <AcDropdownItem label="Delete" :icon="Trash2" danger :disabled="status === 'Terminating'" @click="deleteOpen = true" />
      </AcDropdown>
    </AcHeader>

    <div class="px-4 pt-2 pb-6 sm:px-6">
      <AcTabs v-model="tab" :items="TABS">
        <template #default="{ active }">
          <!-- Overview -->
          <div v-if="active === 'overview'" class="space-y-4">
            <AcInfoTable title="Details" :items="overview" :columns="2" />
            <div class="grid gap-4 @3xl:grid-cols-2">
              <AcCard title="Resource usage" :subtitle="`Across all ${replicas} pods, last 5 minutes`">
                <div class="space-y-4">
                  <AcProgress
                    v-for="u in usage"
                    :key="u.label"
                    :label="u.label"
                    :value="u.value"
                    :max="u.max"
                    :value-text="u.text"
                    color="auto"
                    show-value
                  />
                </div>
                <h6 class="mt-6 mb-2 text-xs font-medium text-muted">Pods</h6>
                <ul class="divide-y divide-border-light rounded-6 border border-border-light">
                  <li v-for="pod in pods" :key="pod.name" class="flex items-center gap-3 px-3 py-2">
                    <span class="min-w-0 flex-1 truncate font-mono text-xs text-heading">{{ pod.name }}</span>
                    <AcTag :label="pod.role" :color="pod.role === 'primary' ? 'primary' : 'neutral'" rounded class="shrink-0" />
                  </li>
                </ul>
              </AcCard>
              <AcCard title="Recent events" :padded="false">
                <ul class="divide-y divide-border-light">
                  <li v-for="e in EVENTS" :key="e.id" class="flex gap-3 px-5 py-3">
                    <AcAvatar :name="e.actor" :shape="e.bot ? 'square' : 'circle'" size="small" alt="" />
                    <div class="min-w-0 flex-1">
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                          <span class="text-base font-medium text-heading">{{ e.actor }}</span>
                          <AcTag :label="e.reason" :color="e.tone" rounded />
                        </div>
                        <span class="shrink-0 pt-0.5 text-xs text-muted">{{ e.time }}</span>
                      </div>
                      <p class="mt-1 text-base text-body">{{ e.text }}</p>
                    </div>
                  </li>
                </ul>
              </AcCard>
            </div>
          </div>

          <!-- Backups -->
          <AcContentTable
            v-else-if="active === 'backups'"
            title="Backups"
            :subtitle="`${backups.length} snapshots in s3://kubedb-backups/demo`"
          >
            <template #right-controls>
              <AcButton title="Backup now" :disabled="status !== 'Ready'" @click="backupNow">
                <template #icon><Download /></template>
              </AcButton>
            </template>
            <AcTable :columns="BACKUP_COLUMNS" :rows="pagedBackups" empty-text="No snapshots yet.">
              <template #cell-name="{ value }">
                <span class="font-mono text-xs text-heading">{{ value }}</span>
              </template>
              <template #cell-status="{ row }">
                <AcBadge :label="row.status" :color="BACKUP_TONE[row.status]" variant="light" rounded dot />
              </template>
              <template #cell-actions="{ row }">
                <AcDropdown align="end" :menu-label="`Actions for ${row.name}`">
                  <AcDropdownItem label="Restore" :icon="RotateCcw" :disabled="row.status !== 'Succeeded'" @click="restore(row)" />
                  <AcDropdownDivider />
                  <AcDropdownItem label="Delete snapshot" :icon="Trash2" danger :disabled="row.status === 'Running'" @click="deleteBackup(row)" />
                </AcDropdown>
              </template>
            </AcTable>
            <AcPagination
              v-model:page="page"
              v-model:page-size="pageSize"
              class="mt-4"
              :total="backups.length"
              :page-sizes="[5, 10, 20]"
              item-label="snapshots"
            />
          </AcContentTable>

          <!-- Monitoring -->
          <div v-else-if="active === 'monitoring'" class="space-y-3">
            <div class="flex items-center justify-between gap-3">
              <p class="text-xs text-muted">From Prometheus, refreshed every 30 seconds</p>
              <AcButton title="Refresh" color="white" size="small" :disabled="metricsLoading" @click="loadMetrics">
                <template #icon><RefreshCw /></template>
              </AcButton>
            </div>
            <div class="grid grid-cols-2 gap-3 @3xl:grid-cols-4" :aria-busy="metricsLoading || undefined">
              <template v-if="metricsLoading">
                <AcSkeleton v-for="(m, i) in metrics" :key="m.label" shape="rect" height="92px" :label="i === 0 ? 'Loading metrics' : ''" />
              </template>
              <div
                v-for="m in metrics"
                v-else
                :key="m.label"
                class="min-w-0 rounded-10 border border-border bg-surface px-4 py-3.5 shadow-xs"
              >
                <p class="truncate text-xs font-medium text-muted">{{ m.label }}</p>
                <p class="mt-1 text-2xl font-semibold text-heading tabular-nums">{{ m.value }}</p>
                <p class="mt-0.5 truncate text-xs text-muted">{{ m.hint }}</p>
              </div>
            </div>
            <AcSkeleton v-if="metricsLoading" shape="card" label="" />
            <AcCard v-else title="Connections by database" subtitle="42 of 100 max_connections">
              <div class="space-y-4">
                <AcProgress
                  v-for="c in CONNECTIONS_BY_DB"
                  :key="c.db"
                  :label="c.db"
                  :value="c.count"
                  :max="42"
                  :value-text="`${c.count} connections`"
                  show-value
                />
              </div>
            </AcCard>
          </div>

          <!-- Settings -->
          <div v-else class="space-y-4">
            <AcSectionContent title="Backups" subtitle="KubeStash BackupConfiguration">
              <div class="space-y-5">
                <AcSwitch v-model="settings.scheduledBackup" label="Scheduled backups" />
                <div class="grid gap-4 sm:grid-cols-2">
                  <AcSelect v-model="settings.schedule" :options="SCHEDULES" label="Schedule" :disabled="!settings.scheduledBackup" />
                  <AcSelect v-model="settings.retention" :options="RETENTION" label="Retention" :disabled="!settings.scheduledBackup" />
                </div>
              </div>
            </AcSectionContent>

            <AcSectionContent title="Monitoring and security">
              <div class="space-y-5">
                <AcSwitch v-model="settings.exporter" label="Prometheus exporter sidecar" />
                <div class="grid gap-4 sm:grid-cols-2">
                  <AcSelect v-model="settings.scrape" :options="SCRAPE" label="Scrape interval" :disabled="!settings.exporter" />
                </div>
                <AcSwitch v-model="settings.tls" label="Require TLS for client connections" />
              </div>
            </AcSectionContent>

            <div class="flex justify-end">
              <AcButton title="Save changes" @click="saveSettings" />
            </div>

            <AcSectionContent title="Danger zone" tone="danger" :padded="false">
              <div class="divide-y divide-border-light">
                <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div class="min-w-0 flex-1 basis-64">
                    <p class="text-base font-medium text-heading">{{ status === "Halted" ? "Resume" : "Pause" }} database</p>
                    <p class="mt-0.5 text-base text-muted">Stops the pods but keeps volumes, secrets and backups.</p>
                  </div>
                  <AcButton
                    :title="status === 'Halted' ? 'Resume' : 'Pause'"
                    color="warning"
                    variant="outlined"
                    :disabled="status === 'Terminating'"
                    @click="togglePause"
                  />
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div class="min-w-0 flex-1 basis-64">
                    <p class="text-base font-medium text-heading">Delete database</p>
                    <p class="mt-0.5 text-base text-muted">Removes the PetSet, volumes and the auth secret. This can't be undone.</p>
                  </div>
                  <AcButton title="Delete" color="danger" :disabled="status === 'Terminating'" @click="deleteOpen = true" />
                </div>
              </div>
            </AcSectionContent>
          </div>
        </template>
      </AcTabs>
    </div>
  </div>

  <AcSidePanel v-model:open="connectOpen" :title="`Connect to ${NAME}`" description="In-cluster endpoint, TLS required" size="small">
    <div class="space-y-5">
      <AcInfoTable title="In the cluster" :items="CONNECTION" layout="stacked" :bordered="false" />
      <AcInfoTable title="From your machine" :items="FROM_LAPTOP" layout="stacked" :bordered="false" />
    </div>
    <template #footer>
      <AcButton title="Done" color="white" @click="connectOpen = false" />
    </template>
  </AcSidePanel>

  <AcModal v-model:open="scaleOpen" :title="`Scale ${NAME}`" description="KubeDB adds or removes standbys one at a time." size="small">
    <AcSelect v-model="scaleTo" :options="REPLICA_OPTIONS" label="Replicas" />
    <template #footer>
      <AcButton title="Cancel" color="white" @click="scaleOpen = false" />
      <AcButton title="Scale" @click="applyScale" />
    </template>
  </AcModal>

  <AcDeleteModal
    v-model:open="deleteOpen"
    title="Delete Database"
    :item-name="NAME"
    detail="The PetSet, volumes and auth secret are removed. Backups in s3://kubedb-backups/demo are kept."
    confirm-text="Delete Database"
    confirm-by-typing
    :loading="deleting"
    @confirm="confirmDelete"
  />
</template>
