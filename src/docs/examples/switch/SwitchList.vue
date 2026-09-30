<script setup lang="ts">
import { reactive } from "vue";
import { AcSwitch } from "@/lib";

const settings = reactive({ tls: true, monitoring: true, backups: false });
</script>

<template>
  <div class="divide-y divide-border-light rounded-4 border border-border">
    <div class="flex items-center justify-between px-4 py-3">
      <div>
        <p class="font-medium text-heading">TLS</p>
        <p class="text-xs text-label">Encrypt client connections with cert-manager.</p>
      </div>
      <AcSwitch v-model="settings.tls" />
    </div>
    <div class="flex items-center justify-between px-4 py-3">
      <div>
        <p class="font-medium text-heading">Monitoring</p>
        <p class="text-xs text-label">Export metrics to Prometheus.</p>
      </div>
      <AcSwitch v-model="settings.monitoring" />
    </div>
    <div class="flex items-center justify-between px-4 py-3">
      <div>
        <p class="font-medium text-heading">Backups</p>
        <p class="text-xs text-label">Run a Stash backup every 6 hours.</p>
      </div>
      <AcSwitch v-model="settings.backups" />
    </div>
  </div>
</template>
