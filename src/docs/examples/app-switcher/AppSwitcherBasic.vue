<script setup lang="ts">
import { Bell } from "@lucide/vue";
import { AcAppSwitcher, AcLogo, AcNavbar, AcNavbarItem, AcUserMenu } from "@/lib";
</script>

<template>
  <div class="overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcNavbar product-name="DB" :sticky="false" menu-button="never">
      <template #brand>
        <AcLogo variant="mark" label="KubeDB" />
      </template>
      <template #actions>
        <AcNavbarItem label="Notifications" :icon="Bell" icon-only />
        <AcAppSwitcher current-app="db" base-url="https://appscode.com" active-organization="appscode" root-domain=".appscode.com" />
        <AcUserMenu name="Mohin Uddin" email="mohin@appscode.com" :show-name="false" class="ml-1" />
      </template>
    </AcNavbar>
    <div class="h-16" />
  </div>
</template>
