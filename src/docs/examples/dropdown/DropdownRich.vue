<script setup lang="ts">
import { AcDropdown, AcDropdownDivider, AcDropdownItem } from "@/lib";
import { BookOpen, Download, FileCode, KeyRound, Scaling, Trash2 } from "@lucide/vue";
</script>

<template>
  <AcDropdown label="demo-postgres">
    <AcDropdownDivider label="Operations" />
    <AcDropdownItem label="Scale" description="Change replicas and resources" :icon="Scaling" />
    <AcDropdownItem label="Rotate credentials" description="Issue a new auth secret" :icon="KeyRound" />
    <AcDropdownItem label="View YAML" :icon="FileCode" shortcut="⌘Y" />
    <AcDropdownItem label="Download kubeconfig" :icon="Download" disabled />
    <AcDropdownDivider label="Help" />
    <AcDropdownItem label="Postgres docs" :icon="BookOpen" href="https://kubedb.com/docs/latest/guides/postgres/" target="_blank" />
    <AcDropdownDivider label="Danger zone" />
    <AcDropdownItem label="Delete database" description="Removes the database and its PVCs" :icon="Trash2" danger />
  </AcDropdown>
</template>
