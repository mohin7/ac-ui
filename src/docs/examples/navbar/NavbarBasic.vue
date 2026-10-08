<script setup lang="ts">
import { ref } from "vue";
import { Bell, Plus, Terminal } from "@lucide/vue";
import { AcLogo, AcNavbar, AcNavbarItem, AcUserMenu } from "@/lib";

const section = ref("databases");
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcNavbar product-name="DB" :sticky="false">
      <template #brand>
        <span class="flex items-center gap-2.5">
          <AcLogo variant="mark" label="" />
          <span class="text-lg font-semibold text-heading">KubeDB</span>
        </span>
      </template>

      <AcNavbarItem label="Databases" :active="section === 'databases'" @click="section = 'databases'" />
      <AcNavbarItem label="Backups" :active="section === 'backups'" @click="section = 'backups'" />
      <AcNavbarItem label="Clusters" :active="section === 'clusters'" @click="section = 'clusters'" />

      <template #actions>
        <AcNavbarItem label="Create database" :icon="Plus" icon-only />
        <AcNavbarItem label="Terminal" :icon="Terminal" icon-only />
        <AcNavbarItem label="Notifications" :icon="Bell" icon-only :badge="3" />
        <AcUserMenu name="Mohin Uddin" email="mohin@appscode.com" class="ml-1" />
      </template>
    </AcNavbar>
    <div class="h-24" />
  </div>
</template>
