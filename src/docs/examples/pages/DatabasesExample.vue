<script setup lang="ts">
import { computed, ref } from "vue";
import { Trash2 } from "lucide-vue-next";
import {
  AcAlert,
  AcBadge,
  AcButton,
  AcCheckBox,
  AcCheckRadio,
  AcContentTable,
  AcDeleteModal,
  AcHeader,
  AcInput,
  AcModal,
  AcSelect,
  AcStatCard,
  AcSteps,
  AcSwitch,
  AcTable,
  AcTabs,
} from "@/lib";

interface Database extends Record<string, unknown> {
  id: number;
  name: string;
  type: string;
  version: string;
  namespace: string;
  replicas: number;
  status: "Ready" | "Provisioning" | "Critical" | "Halted";
  age: string;
}

const databases = ref<Database[]>([
  { id: 1, name: "demo-postgres", type: "Postgres", version: "16.1", namespace: "demo", replicas: 3, status: "Ready", age: "2d" },
  { id: 2, name: "orders-mongo", type: "MongoDB", version: "7.0.5", namespace: "shop", replicas: 3, status: "Provisioning", age: "14m" },
  { id: 3, name: "cache-redis", type: "Redis", version: "7.2.4", namespace: "shop", replicas: 1, status: "Critical", age: "31d" },
  { id: 4, name: "search-es", type: "Elasticsearch", version: "8.11.1", namespace: "search", replicas: 3, status: "Ready", age: "9d" },
  { id: 5, name: "events-kafka", type: "Kafka", version: "3.6.1", namespace: "stream", replicas: 3, status: "Halted", age: "4d" },
]);

// Filter tabs
const filter = ref("all");
const tabs = computed(() => [
  { key: "all", label: "All", count: databases.value.length },
  { key: "ready", label: "Ready", count: databases.value.filter((d) => d.status === "Ready").length },
  { key: "attention", label: "Needs attention", count: databases.value.filter((d) => d.status !== "Ready").length },
]);
const visible = computed(() =>
  databases.value.filter((d) =>
    filter.value === "all" ? true : filter.value === "ready" ? d.status === "Ready" : d.status !== "Ready",
  ),
);

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Engine", sortable: true },
  { key: "namespace", label: "Namespace" },
  { key: "replicas", label: "Replicas", align: "right" as const },
  { key: "status", label: "Status" },
  { key: "age", label: "Age", align: "right" as const },
  { key: "actions", label: "", align: "right" as const, width: "48px" },
];

const statusColor = { Ready: "success", Provisioning: "info", Critical: "danger", Halted: "warning" } as const;
const tone = (s: unknown) => statusColor[s as Database["status"]];

const stats = computed(() => [
  { label: "Databases", value: databases.value.length },
  { label: "Ready", value: databases.value.filter((d) => d.status === "Ready").length },
  { label: "Replicas", value: databases.value.reduce((n, d) => n + d.replicas, 0) },
  { label: "Monthly cost", value: "$412" },
]);

// Create wizard
const namespaces = ["default", "demo", "search", "shop", "stream"].map((n) => ({ value: n, label: n }));
const blank = () => ({
  name: "",
  namespace: "demo" as string | null,
  type: "Postgres",
  mode: "cluster",
  features: ["monitoring"],
  tls: true,
});
const wizardOpen = ref(false);
const step = ref(1);
const form = ref(blank());
const nameError = ref("");
const created = ref("");

function openWizard() {
  form.value = blank();
  step.value = 1;
  nameError.value = "";
  wizardOpen.value = true;
}

function next() {
  if (step.value === 2) {
    const n = form.value.name;
    nameError.value = !n ? "Name is required." : /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(n) ? "" : "Use lowercase letters, numbers and hyphens.";
    if (nameError.value) return;
  }
  step.value++;
}

function deploy() {
  databases.value.unshift({
    id: Date.now(),
    name: form.value.name,
    type: form.value.type,
    version: { Postgres: "16.1", MongoDB: "7.0.5", Redis: "7.2.4", MySQL: "8.2.0" }[form.value.type] ?? "latest",
    namespace: form.value.namespace || "default",
    replicas: form.value.mode === "cluster" ? 3 : 1,
    status: "Provisioning",
    age: "now",
  });
  created.value = form.value.name;
  filter.value = "all";
  wizardOpen.value = false;
}

// Delete
const toDelete = ref<Database | null>(null);
const deleteOpen = ref(false);
const deleting = ref(false);
function askDelete(row: Database) {
  toDelete.value = row;
  deleteOpen.value = true;
}
async function confirmDelete() {
  deleting.value = true;
  await new Promise((r) => setTimeout(r, 900));
  databases.value = databases.value.filter((d) => d.id !== toDelete.value?.id);
  deleting.value = false;
  deleteOpen.value = false;
}
const matches = (rows: Database[], q: string) =>
  q ? rows.filter((d) => d.name.includes(q.toLowerCase()) || d.type.toLowerCase().includes(q.toLowerCase())) : rows;
</script>

<template>
  <div class="bg-surface-muted">
    <AcHeader title="Databases" subtitle="appscode / demo-cluster">
      <AcButton title="Import" color="white" />
      <AcButton title="Create Database" @click="openWizard" />
    </AcHeader>

    <div class="space-y-4 p-6">
      <AcAlert v-if="created" color="success" dismissible @close="created = ''">
        {{ created }} is being provisioned. It will turn Ready in a few minutes.
      </AcAlert>
      <AcAlert color="warning">cache-redis has 1 replica and no recent backup. <a href="#/examples/databases">Configure Stash</a></AcAlert>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AcStatCard v-for="s in stats" :key="s.label" :label="s.label" :value="s.value" />
      </div>

      <AcContentTable title="All Databases" :subtitle="`${visible.length} shown`" searchable search-placeholder="Search databases">
        <template #left-controls>
          <AcTabs v-model="filter" :items="tabs" class="-mb-3.5 [&_[role=tablist]]:border-0" />
        </template>
        <template #default="{ searchText }">
          <AcTable :columns="columns" :rows="matches(visible, searchText)" empty-text="No databases match.">
            <template #cell-name="{ row }">
              <span class="font-medium text-heading">{{ row.name }}</span>
            </template>
            <template #cell-type="{ row }">
              {{ row.type }} <span class="text-muted">{{ row.version }}</span>
            </template>
            <template #cell-status="{ value }">
              <AcBadge :label="String(value)" :color="tone(value)" variant="light" rounded dot />
            </template>
            <template #cell-actions="{ row }">
              <AcButton color="ghost" size="small" :aria-label="`Delete ${row.name}`" @click="askDelete(row as Database)">
                <template #icon>
                  <Trash2 class="size-3.5" />
                </template>
              </AcButton>
            </template>
          </AcTable>
        </template>
      </AcContentTable>
    </div>
  </div>

  <AcModal v-model:open="wizardOpen" title="Create Database" description="Deploy a managed database with KubeDB" size="medium">
    <AcSteps
      class="mb-8"
      :active="step"
      :options="[
        { id: 1, title: 'Engine', description: 'Pick a database' },
        { id: 2, title: 'Configure', description: 'Name and topology' },
        { id: 3, title: 'Review', description: 'Confirm and deploy' },
      ]"
    />

    <AcCheckRadio
      v-if="step === 1"
      v-model="form.type"
      cards
      :options="[
        { value: 'Postgres', label: 'Postgres', description: 'Relational, with streaming replication.' },
        { value: 'MongoDB', label: 'MongoDB', description: 'Document store with replica sets.' },
        { value: 'Redis', label: 'Redis', description: 'In-memory cache and broker.' },
        { value: 'MySQL', label: 'MySQL', description: 'Relational, with group replication.' },
      ]"
    />

    <div v-else-if="step === 2" class="space-y-5">
      <div class="grid gap-5 sm:grid-cols-2">
        <AcInput v-model="form.name" label="Database Name" required :error-msg="nameError" hint="e.g. orders-db" />
        <AcSelect v-model="form.namespace" :options="namespaces" label="Namespace" searchable />
      </div>
      <div>
        <h6 class="mb-2">Topology</h6>
        <AcCheckRadio
          v-model="form.mode"
          row
          :options="[
            { value: 'standalone', label: 'Standalone' },
            { value: 'cluster', label: 'Cluster (3 replicas)' },
          ]"
        />
      </div>
      <div>
        <h6 class="mb-2">Add-ons</h6>
        <AcCheckBox
          v-model="form.features"
          :options="[
            { value: 'monitoring', label: 'Monitoring with Prometheus and Grafana' },
            { value: 'backup', label: 'Scheduled backups with Stash' },
          ]"
        />
      </div>
      <AcSwitch v-model="form.tls" label="Enable TLS" />
    </div>

    <dl v-else class="grid grid-cols-[140px_1fr] gap-y-3 rounded-10 border border-border bg-surface-muted p-5">
      <dt class="text-label">Engine</dt>
      <dd class="text-heading">{{ form.type }}</dd>
      <dt class="text-label">Name</dt>
      <dd class="text-code">{{ form.name }}</dd>
      <dt class="text-label">Namespace</dt>
      <dd class="text-code">{{ form.namespace || "default" }}</dd>
      <dt class="text-label">Topology</dt>
      <dd class="text-heading">{{ form.mode === "cluster" ? "Cluster, 3 replicas" : "Standalone" }}</dd>
      <dt class="text-label">TLS</dt>
      <dd><AcBadge :label="form.tls ? 'Enabled' : 'Disabled'" :color="form.tls ? 'success' : 'default'" variant="light" /></dd>
    </dl>

    <template #footer-left>
      <span class="text-xs text-muted">Step {{ step }} of 3</span>
    </template>
    <template #footer>
      <AcButton title="Cancel" color="white" @click="wizardOpen = false" />
      <AcButton v-if="step > 1" title="Back" color="white" @click="step--" />
      <AcButton v-if="step < 3" title="Next" @click="next" />
      <AcButton v-else title="Deploy" @click="deploy" />
    </template>
  </AcModal>

  <AcDeleteModal
    v-model:open="deleteOpen"
    title="Delete Database"
    :item-name="toDelete?.name"
    detail="All data and volumes are removed."
    confirm-text="Delete Database"
    confirm-by-typing
    :loading="deleting"
    @confirm="confirmDelete"
  />
</template>
