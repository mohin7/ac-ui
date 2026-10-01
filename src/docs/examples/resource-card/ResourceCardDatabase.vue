<script setup lang="ts">
import { Pencil, RotateCw, Trash2 } from "lucide-vue-next";
import { AcBadge, AcDropdownDivider, AcDropdownItem, AcResourceCard, useToast } from "@/lib";

const { toast } = useToast();

const databases = [
  { name: "demo-postgres", engine: "Postgres 16.1", namespace: "demo", status: "Ready", color: "success" as const, replicas: "3 / 3", cpu: "1500m", memory: "6Gi", storage: "20Gi" },
  { name: "orders-mongo", engine: "MongoDB 7.0.5", namespace: "shop", status: "Critical", color: "danger" as const, replicas: "2 / 3", cpu: "3000m", memory: "12Gi", storage: "100Gi" },
];
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2">
    <AcResourceCard
      v-for="db in databases"
      :key="db.name"
      mono
      :name="db.name"
      :subtitle="`${db.engine} · namespace ${db.namespace}`"
      logo="/logos/kubedb-logo.png"
      :status="db.status"
      :status-color="db.color"
      :tags="[{ key: 'app', label: db.name }, { key: 'env', label: db.namespace === 'demo' ? 'dev' : 'prod' }]"
      :columns="4"
      :details="[
        { label: 'Replicas', value: db.replicas, key: 'replicas' },
        { label: 'CPU', value: db.cpu, mono: true },
        { label: 'Memory', value: db.memory, mono: true },
        { label: 'Storage', value: db.storage, mono: true },
      ]"
      @click="toast(`Open ${db.name}`)"
    >
      <template #detail-replicas="{ detail }">
        {{ detail.value }}
        <AcBadge v-if="db.status !== 'Ready'" label="1 down" color="danger" variant="light" rounded />
      </template>
      <template #menu>
        <AcDropdownItem label="Edit" :icon="Pencil" />
        <AcDropdownItem label="Restart" :icon="RotateCw" />
        <AcDropdownDivider />
        <AcDropdownItem label="Delete" :icon="Trash2" danger />
      </template>
    </AcResourceCard>
  </div>
</template>
