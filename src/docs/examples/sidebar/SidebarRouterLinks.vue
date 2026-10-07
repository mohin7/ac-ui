<script setup lang="ts">
import { AppWindow, Menu, PanelLeft } from "@lucide/vue";
import { AcSidebar, AcSidebarItem, AcSidebarSection } from "@/lib";
</script>

<template>
  <div class="relative flex h-[300px] overflow-hidden rounded-10 border border-border bg-surface">
    <AcSidebar contained :breakpoint="0" :collapsible="false" label="Layout components">
      <AcSidebarSection label="Layout">
        <!-- This page's route matches, so the item marks itself active. -->
        <AcSidebarItem label="Sidebar" :icon="PanelLeft" to="/components/sidebar" />
        <AcSidebarItem label="Navbar" :icon="Menu" to="/components/navbar" />
        <AcSidebarItem label="App shell" :icon="AppWindow" :to="{ path: '/examples/app-shell' }" />
      </AcSidebarSection>
    </AcSidebar>
    <div class="min-w-0 flex-1 p-4 text-base break-words text-muted sm:p-6">
      Items with <code class="text-code">to</code> render a <code class="text-code">RouterLink</code>. The one for the current route gets
      <code class="text-code">aria-current="page"</code> and the active style without an <code class="text-code">active</code> prop.
    </div>
  </div>
</template>
