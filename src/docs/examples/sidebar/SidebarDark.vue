<script setup lang="ts">
import { ref } from "vue";
import { Activity, Database, DatabaseBackup, LayoutDashboard, LifeBuoy, Server, Settings } from "lucide-vue-next";
import { AcSidebar, AcSidebarItem, AcSidebarSection } from "@/lib";

const current = ref("postgres");
</script>

<template>
  <div class="relative flex h-[520px] overflow-hidden rounded-10 border border-border bg-surface">
    <AcSidebar contained dark :breakpoint="0" :collapsible="false">
      <template #header>
        <span class="flex items-center gap-2.5">
          <img src="/logos/appscode-mark.png" alt="" class="size-6 rounded-6" />
          <span class="text-lg font-semibold text-heading">KubeDB</span>
        </span>
      </template>

      <AcSidebarSection>
        <AcSidebarItem label="Overview" :icon="LayoutDashboard" :active="current === 'overview'" @click="current = 'overview'" />
        <AcSidebarItem label="Databases" :icon="Database">
          <AcSidebarItem label="Postgres" badge="3" :active="current === 'postgres'" @click="current = 'postgres'" />
          <AcSidebarItem label="MongoDB" badge="2" :active="current === 'mongodb'" @click="current = 'mongodb'" />
          <AcSidebarItem label="Redis" badge="1" :active="current === 'redis'" @click="current = 'redis'" />
        </AcSidebarItem>
        <AcSidebarItem label="Backups" :icon="DatabaseBackup" badge="New" badge-color="primary" :active="current === 'backups'" @click="current = 'backups'" />
        <AcSidebarItem label="Monitoring" :icon="Activity" :active="current === 'monitoring'" @click="current = 'monitoring'" />
      </AcSidebarSection>

      <AcSidebarSection label="Cluster">
        <AcSidebarItem label="Nodes" :icon="Server" :active="current === 'nodes'" @click="current = 'nodes'" />
        <AcSidebarItem label="Settings" :icon="Settings" :active="current === 'settings'" @click="current = 'settings'" />
      </AcSidebarSection>

      <template #footer>
        <AcSidebarItem label="Help & docs" :icon="LifeBuoy" href="https://kubedb.com/docs" />
      </template>
    </AcSidebar>

    <div class="min-w-0 flex-1 p-4 text-base break-words text-muted sm:p-6">
      Current page: <code class="text-code">{{ current }}</code>
    </div>
  </div>
</template>
