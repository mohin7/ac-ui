<script setup lang="ts">
import { AcBadge, AcButton, AcInfoTable } from "@/lib";

const items = [
  { key: "status", label: "Status" },
  { key: "cluster", label: "Cluster", value: "prod-eks-us-east" },
  { key: "type", label: "Type", value: "MongoDB ReplicaSet" },
  { key: "version", label: "Version", value: "7.0.8" },
  { key: "storage", label: "Storage", value: "gp3 · 50 GiB" },
  { key: "created", label: "Created", value: "Sep 12, 2026, 09:41" },
  { key: "labels", label: "Labels" },
  { key: "connection", label: "Connection", value: "mongodb://mongo-orders.shop.svc:27017", mono: true, copyable: true },
];
</script>

<template>
  <AcInfoTable :items="items" title="mongo-orders" :columns="2">
    <template #actions>
      <AcButton title="Edit" color="white" size="small" />
    </template>
    <template #value-status>
      <AcBadge label="Ready" color="success" variant="light" dot rounded />
    </template>
    <template #value-cluster="{ item }">
      <a href="#/components/info-table" class="font-medium text-primary-20 underline decoration-primary-70 underline-offset-2 hover:decoration-primary-20">{{ item.value }}</a>
    </template>
    <template #value-labels>
      <AcBadge label="team=payments" variant="outlined" />
      <AcBadge label="tier=gold" variant="outlined" />
    </template>
  </AcInfoTable>
</template>
