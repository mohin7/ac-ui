<script setup lang="ts">
import { AcBreadcrumb } from "@/lib";

const items = [
  { label: "demo-cluster", href: "#/components/breadcrumb" },
  { label: "Databases", href: "#/components/breadcrumb" },
  { label: "demo-postgres" },
];
</script>

<template>
  <AcBreadcrumb :items="items" />
</template>
