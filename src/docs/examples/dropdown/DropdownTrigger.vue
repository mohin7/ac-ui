<script setup lang="ts">
import { AcButton, AcDropdown, AcDropdownItem } from "@/lib";
import { ChevronDown, Plus } from "@lucide/vue";

const engines = ["Postgres", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Kafka"];
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <AcDropdown>
      <template #trigger="{ open }">
        <AcButton title="Create Database">
          <template #icon><Plus /></template>
          <ChevronDown class="-mr-1 transition-transform" :class="open && 'rotate-180'" aria-hidden="true" />
        </AcButton>
      </template>
      <AcDropdownItem v-for="engine in engines" :key="engine" :label="engine" />
    </AcDropdown>

    <AcDropdown label="Open upward" placement="top" align="end">
      <AcDropdownItem label="Logs" />
      <AcDropdownItem label="Events" />
      <AcDropdownItem label="Metrics" />
    </AcDropdown>
  </div>
</template>
