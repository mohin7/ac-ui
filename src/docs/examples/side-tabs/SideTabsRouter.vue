<script setup lang="ts">
import { Columns3, PanelBottom, PanelLeft, Rows3 } from "lucide-vue-next";
import { AcSideTabs } from "@/lib";

// Items with `to` render RouterLinks; the one for the current route becomes active by itself.
const items = [
  { key: "side-tabs", label: "Side Tabs", icon: PanelLeft, to: "/components/side-tabs" },
  { key: "tabs", label: "Tabs", icon: Columns3, to: "/components/tabs" },
  { key: "status-bar", label: "Status Bar", icon: PanelBottom, to: "/components/status-bar" },
  { key: "steps", label: "Steps", icon: Rows3, to: { path: "/components/steps" } },
];
</script>

<template>
  <div class="flex overflow-hidden rounded-10 border border-border bg-surface-muted">
    <AcSideTabs :items="items" label="Navigation components" :sticky="false" />
    <p class="min-w-0 flex-1 p-5 text-base text-muted">
      The list follows the route, so <code class="text-code">v-model</code> is optional. On phones the select navigates with the router.
    </p>
  </div>
</template>
