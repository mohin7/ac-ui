<script setup lang="ts">
import { AcBadge, AcBreadcrumb, AcButton, AcHeader } from "@/lib";

const items = [
  { label: "Home", href: "#/components/breadcrumb" },
  { label: "demo-cluster", href: "#/components/breadcrumb" },
  { label: "Databases", href: "#/components/breadcrumb" },
  { label: "demo-postgres" },
];
</script>

<template>
  <AcHeader title="demo-postgres" back-button class="w-full rounded-10 border border-border">
    <template #breadcrumb><AcBreadcrumb :items="items" home-icon /></template>
    <template #title-extra><AcBadge color="success" variant="light" dot label="Ready" /></template>
    <AcButton title="Connect" color="white" size="small" />
  </AcHeader>
</template>
