<script setup lang="ts">
import { ref } from "vue";
import { Activity, DatabaseBackup, LayoutDashboard, Settings2, ShieldCheck } from "lucide-vue-next";
import { AcButton, AcSideTabs } from "@/lib";

const section = ref("backups");
const collapsed = ref(false);
const editing = ref(false);
const items = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "configuration", label: "Configuration", icon: Settings2 },
  { key: "backups", label: "Backups", icon: DatabaseBackup, badge: 12 },
  { key: "monitoring", label: "Monitoring", icon: Activity },
  { key: "tls", label: "TLS", icon: ShieldCheck },
];
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcSideTabs v-model="section" v-model:collapsed="collapsed" :items="items" :hide-tabs="editing" collapsible :sticky="false">
      <div class="flex flex-wrap items-center gap-3 p-5">
        <AcButton :title="editing ? 'Done editing' : 'Edit YAML'" variant="outlined" size="small" @click="editing = !editing" />
        <span class="text-base text-muted">{{ editing ? "The editor takes the full width." : `Section: ${section}` }}</span>
      </div>
    </AcSideTabs>
  </div>
</template>
