<script setup lang="ts">
import { ref } from "vue";
import { AcFeatureCard } from "@/lib";

const features = ref([
  { name: "capi-catalog", title: "CAPI Catalog", description: "Cluster API providers and machine templates.", checked: false },
  { name: "capi-ops-manager", title: "CAPI Ops Manager", description: "Day-2 operations for Cluster API clusters.", checked: true },
  { name: "cluster-presets", title: "Cluster Presets", description: "Default settings applied to new clusters.", checked: true },
  { name: "ocm-hub", title: "OCM Hub", description: "Requires a hub cluster.", checked: false, disabled: true },
]);
</script>

<template>
  <div>
    <div class="grid gap-3 sm:grid-cols-2">
      <AcFeatureCard
        v-for="f in features"
        :key="f.name"
        v-model:checked="f.checked"
        selectable
        :title="f.title"
        :description="f.description"
        :disabled="f.disabled"
      />
    </div>
    <p class="mt-3 text-xs text-muted">
      Enable: {{ features.filter((f) => f.checked).map((f) => f.name).join(", ") || "none" }}
    </p>
  </div>
</template>
