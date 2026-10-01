<script setup lang="ts">
import { computed, ref } from "vue";
import { AcSearchBar } from "@/lib";

const clusters = [
  { name: "prod-east", status: "active" },
  { name: "prod-west", status: "active" },
  { name: "staging", status: "pending" },
  { name: "dev-kind", status: "active" },
  { name: "edge-k3s", status: "pending" },
];
const filterOptions = [
  { value: "all", label: "All Clusters" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
];

const query = ref("");
const status = ref("all");
const visible = computed(() =>
  clusters.filter((c) => (status.value === "all" || c.status === status.value) && c.name.includes(query.value.trim())),
);
</script>

<template>
  <div class="max-w-96">
    <AcSearchBar v-model="query" v-model:filter="status" placeholder="Search clusters" :filter-options="filterOptions" filter-label="Cluster status" :debounce="0" />
    <ul class="mt-3 divide-y divide-border-light rounded-10 border border-border text-base">
      <li v-for="c in visible" :key="c.name" class="flex h-9 items-center justify-between px-3">
        <span class="font-medium text-heading">{{ c.name }}</span>
        <span class="text-xs text-muted capitalize">{{ c.status }}</span>
      </li>
      <li v-if="!visible.length" class="flex h-9 items-center px-3 text-muted">No clusters match.</li>
    </ul>
  </div>
</template>
