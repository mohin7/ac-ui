<script setup lang="ts">
import { ref } from "vue";
import { AcSideTabs } from "@/lib";

const section = ref("general");
const items = ["general", "storage", "network", "monitoring", "backup", "tls", "advanced"].map((key) => ({
  key,
  label: key === "tls" ? "TLS" : key.charAt(0).toUpperCase() + key.slice(1),
}));
</script>

<template>
  <!-- The frame is the scroll area here; in an app it's usually the page. -->
  <div class="h-[360px] overflow-auto rounded-10 border border-border bg-surface-muted">
    <header class="sticky top-0 z-10 flex h-12 items-center border-b border-border bg-surface px-5 text-lg font-semibold text-heading">
      postgres-analytics
    </header>
    <AcSideTabs v-model="section" :items="items" top="48px" width="180px">
      <div class="space-y-4 p-5">
        <div v-for="n in 8" :key="n" class="h-24 rounded-10 border border-border bg-surface shadow-xs" />
      </div>
    </AcSideTabs>
  </div>
</template>
