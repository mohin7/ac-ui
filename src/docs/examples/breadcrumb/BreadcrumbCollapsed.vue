<script setup lang="ts">
import { Database, Server } from "@lucide/vue";
import { AcBreadcrumb } from "@/lib";

const items = [
  { label: "appscode", href: "#/components/breadcrumb" },
  { label: "demo-cluster", href: "#/components/breadcrumb", icon: Server },
  { label: "Namespaces", href: "#/components/breadcrumb" },
  { label: "demo", href: "#/components/breadcrumb" },
  { label: "Databases", href: "#/components/breadcrumb", icon: Database },
  { label: "demo-postgres" },
];
</script>

<template>
  <AcBreadcrumb :items="items" :max-items="4" />
</template>
