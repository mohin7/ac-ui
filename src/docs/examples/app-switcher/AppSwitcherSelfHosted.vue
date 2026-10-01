<script setup lang="ts">
import { ref } from "vue";
import { AcAppSwitcher, AcSegmentedControl, AcSwitch } from "@/lib";

const baseUrl = ref("https://appscode.com");
const offline = ref(true);
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <AcSegmentedControl
      v-model="baseUrl"
      size="small"
      label="Origin"
      :options="[
        { value: 'https://appscode.com', label: 'appscode.com' },
        { value: 'https://ace.example.internal', label: 'Self-hosted' },
        { value: 'http://localhost:5990', label: 'localhost' },
      ]"
    />
    <AcSwitch v-model="offline" label="Offline installer" />
    <AcAppSwitcher current-app="console" :base-url="baseUrl" :active-org-type="6" :is-offline-installer="offline" align="start" />
  </div>
</template>
