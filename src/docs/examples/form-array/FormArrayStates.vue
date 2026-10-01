<script setup lang="ts">
import { ref } from "vue";
import { AcFormArray } from "@/lib";

type Repo = { name: string; backend: string; bucket: string; created: string };

const repos = ref<Repo[]>([
  { name: "s3-backups", backend: "S3", bucket: "appscode-prod", created: new Date(Date.now() - 9 * 86400_000).toISOString() },
  { name: "gcs-archive", backend: "GCS", bucket: "appscode-archive", created: new Date(Date.now() - 62 * 86400_000).toISOString() },
]);
const empty = ref<Repo[]>([]);
const columns = [
  { key: "name", label: "Name" },
  { key: "backend", label: "Backend" },
  { key: "created", label: "Created", type: "date" as const },
];
</script>

<template>
  <div class="space-y-8">
    <AcFormArray v-model="empty" label="Backup Repositories" item-name="repository" :columns="columns" required error-msg="Add at least one repository." />

    <AcFormArray v-model="repos" label="Backup Repositories (read-only)" :columns="columns" readonly collapsible>
      <template #details="{ item }">
        Bucket <code class="font-mono text-xs text-heading">{{ item.bucket }}</code>, created {{ new Date(item.created).toLocaleDateString() }}.
      </template>
    </AcFormArray>

    <AcFormArray v-model="repos" label="Backup Repositories (disabled)" item-name="repository" :columns="columns" disabled />
  </div>
</template>
