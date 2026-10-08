<script setup lang="ts">
import { ref } from "vue";
import { Activity, Database, DatabaseBackup, LayoutDashboard, Settings } from "@lucide/vue";
import { AcLogo, AcSidebar, AcSidebarItem, AcSidebarSection } from "@/lib";

const collapsed = ref(true);
const current = ref("overview");
</script>

<template>
  <div class="relative flex h-[440px] overflow-hidden rounded-10 border border-border bg-surface">
    <AcSidebar v-model:collapsed="collapsed" contained :breakpoint="0">
      <template #header="{ collapsed: rail }">
        <span class="flex items-center gap-2.5">
          <AcLogo variant="mark" label="" />
          <span v-if="!rail" class="text-lg font-semibold text-heading">KubeDB</span>
        </span>
      </template>

      <AcSidebarSection label="Workloads">
        <AcSidebarItem label="Overview" :icon="LayoutDashboard" :active="current === 'overview'" @click="current = 'overview'" />
        <AcSidebarItem label="Databases" :icon="Database">
          <AcSidebarItem label="Postgres" :active="current === 'postgres'" @click="current = 'postgres'" />
          <AcSidebarItem label="MongoDB" :active="current === 'mongodb'" @click="current = 'mongodb'" />
        </AcSidebarItem>
        <AcSidebarItem label="Backups" :icon="DatabaseBackup" badge="2" badge-color="danger" :active="current === 'backups'" @click="current = 'backups'" />
      </AcSidebarSection>
      <AcSidebarSection label="Operations">
        <AcSidebarItem label="Monitoring" :icon="Activity" :active="current === 'monitoring'" @click="current = 'monitoring'" />
        <AcSidebarItem label="Settings" :icon="Settings" :active="current === 'settings'" @click="current = 'settings'" />
      </AcSidebarSection>
    </AcSidebar>

    <div class="min-w-0 flex-1 space-y-1 p-4 text-base break-words text-muted sm:p-6">
      <p>collapsed: <code class="text-code">{{ collapsed }}</code></p>
      <p>Hover an icon for its name. Clicking Databases expands the sidebar and opens the group.</p>
    </div>
  </div>
</template>
