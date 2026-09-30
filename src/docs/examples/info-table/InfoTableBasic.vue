<script setup lang="ts">
import { AcInfoTable } from "@/lib";

const items = [
  { label: "Name", value: "pg-prod", mono: true },
  { label: "Namespace", value: "demo" },
  { label: "Version", value: "16.1" },
  { label: "Replicas", value: 3 },
  { label: "Endpoint", value: "pg-prod.demo.svc:5432", mono: true, copyable: true },
  { label: "UID", value: "7c1e2b3a-94f0-4d5e-b8a1-2f6c9d0e1a47", mono: true, copyable: true },
  { label: "Deletion policy", value: null },
];
</script>

<template>
  <AcInfoTable :items="items" title="Details" class="max-w-160" />
</template>
