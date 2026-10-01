<script setup lang="ts">
import { ref } from "vue";
import { Activity, Database, DatabaseBackup, LayoutDashboard, Settings } from "lucide-vue-next";
import { AcLogo, AcNavbar, AcSidebar, AcSidebarItem, AcSidebarSection } from "@/lib";

const menuOpen = ref(false);
const current = ref("postgres");
</script>

<template>
  <!-- A phone-sized frame: under 768px wide the sidebar becomes an off-canvas drawer. -->
  <div class="relative mx-auto flex h-[560px] w-full max-w-[375px] overflow-hidden rounded-16 border border-border bg-surface shadow-md">
    <AcSidebar v-model:mobile-open="menuOpen" contained>
      <template #header>
        <span class="flex items-center gap-2.5">
          <AcLogo variant="mark" label="" />
          <span class="text-lg font-semibold text-heading">KubeDB</span>
        </span>
      </template>
      <AcSidebarSection>
        <AcSidebarItem label="Overview" :icon="LayoutDashboard" :active="current === 'overview'" @click="current = 'overview'" />
        <AcSidebarItem label="Databases" :icon="Database">
          <AcSidebarItem label="Postgres" :active="current === 'postgres'" @click="current = 'postgres'" />
          <AcSidebarItem label="MongoDB" :active="current === 'mongodb'" @click="current = 'mongodb'" />
          <AcSidebarItem label="Redis" :active="current === 'redis'" @click="current = 'redis'" />
        </AcSidebarItem>
        <AcSidebarItem label="Backups" :icon="DatabaseBackup" :active="current === 'backups'" @click="current = 'backups'" />
        <AcSidebarItem label="Monitoring" :icon="Activity" :active="current === 'monitoring'" @click="current = 'monitoring'" />
        <AcSidebarItem label="Settings" :icon="Settings" :active="current === 'settings'" @click="current = 'settings'" />
      </AcSidebarSection>
    </AcSidebar>

    <div class="flex min-w-0 flex-1 flex-col">
      <AcNavbar menu-button="always" @menu="menuOpen = true">
        <template #brand>
          <span class="text-lg font-semibold text-heading">KubeDB</span>
        </template>
      </AcNavbar>
      <div class="p-5 text-base text-muted">
        Tap the menu button. Picking a page closes the drawer; so do Escape and the backdrop.
        <p class="mt-3">Current page: <code class="text-code">{{ current }}</code></p>
      </div>
    </div>
  </div>
</template>
