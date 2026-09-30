<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcSidePanel } from "@/lib";
import { ExternalLink } from "lucide-vue-next";

const open = ref(false);
const details = [
  ["Cluster", "prod-us-east-1"],
  ["Namespace", "demo"],
  ["Engine", "Postgres 16.1"],
  ["Mode", "Streaming replication, 3 replicas"],
  ["Storage", "gp3 · 20 GiB per replica"],
  ["Last backup", "Today, 02:00 UTC · 1.2 GiB"],
  ["Created", "2 days ago by admin"],
];
</script>

<template>
  <AcButton title="View Details" color="white" @click="open = true" />

  <AcSidePanel v-model:open="open" title="demo-postgres" description="Postgres database" size="small" hide-footer>
    <template #header-actions>
      <AcButton color="ghost" size="small" href="https://kubedb.com/docs/latest/guides/postgres/" aria-label="Postgres docs">
        <template #icon><ExternalLink /></template>
      </AcButton>
    </template>
    <dl class="divide-y divide-border-light">
      <div v-for="[term, value] in details" :key="term" class="grid grid-cols-[120px_1fr] gap-3 py-2.5 text-base">
        <dt class="text-muted">{{ term }}</dt>
        <dd class="text-heading">{{ value }}</dd>
      </div>
    </dl>
  </AcSidePanel>
</template>
