<script setup lang="ts">
import { ref } from "vue";
import { AcTabs } from "@/lib";

// Each tab is a real link: it can be opened in a new tab, and the active tab follows the current route.
const items = [
  { key: "tabs", label: "Tabs", to: "/components/tabs", testid: "tab-tabs" },
  { key: "side", label: "Side Tabs", to: "/components/side-tabs", testid: "tab-side" },
  { key: "select", label: "Select", to: "/components/select", testid: "tab-select" },
  { key: "soon", label: "Coming soon", to: "/components/modal", disabled: true },
];
const active = ref("");
</script>

<template>
  <AcTabs v-model="active" :items="items" />
</template>
