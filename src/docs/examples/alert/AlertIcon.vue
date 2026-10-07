<script setup lang="ts">
import { ShieldCheck } from "@lucide/vue";
import { AcAlert } from "@/lib";
</script>

<template>
  <div class="flex flex-col gap-3">
    <AcAlert color="success" :icon="ShieldCheck">TLS is enabled for every database in namespace demo.</AcAlert>
    <AcAlert color="neutral" hide-icon>Changes apply after the next reconcile, usually within a minute.</AcAlert>
  </div>
</template>
