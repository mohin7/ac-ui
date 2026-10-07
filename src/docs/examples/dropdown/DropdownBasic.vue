<script setup lang="ts">
import { AcDropdown, AcDropdownDivider, AcDropdownItem } from "@/lib";
import { Copy, Pencil, RotateCw, Trash2 } from "@lucide/vue";
</script>

<template>
  <AcDropdown label="Actions">
    <AcDropdownItem label="Edit" :icon="Pencil" />
    <AcDropdownItem label="Duplicate" :icon="Copy" />
    <AcDropdownItem label="Restart" :icon="RotateCw" />
    <AcDropdownDivider />
    <AcDropdownItem label="Delete" :icon="Trash2" danger />
  </AcDropdown>
</template>
