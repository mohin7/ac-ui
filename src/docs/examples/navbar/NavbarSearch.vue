<script setup lang="ts">
import { ref } from "vue";
import { Bell, CircleHelp } from "lucide-vue-next";
import { AcNavbar, AcNavbarItem, AcSearchBar, AcUserMenu } from "@/lib";

const query = ref("");
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcNavbar :sticky="false" menu-button="always">
      <template #brand>
        <span class="flex items-center gap-2.5">
          <img src="/logos/appscode-mark.png" alt="" class="size-6 rounded-6" />
          <span class="hidden text-lg font-semibold text-heading sm:inline">Console</span>
        </span>
      </template>

      <template #search>
        <AcSearchBar v-model="query" placeholder="Search clusters, namespaces, databases" />
      </template>

      <template #actions>
        <AcNavbarItem label="Help" :icon="CircleHelp" icon-only href="https://appscode.com/docs" />
        <AcNavbarItem label="Notifications" :icon="Bell" icon-only :badge="1204" />
        <AcUserMenu name="appscode" email="team@appscode.com" :show-name="false" class="ml-1" />
      </template>
    </AcNavbar>
    <div class="h-24" />
  </div>
</template>
