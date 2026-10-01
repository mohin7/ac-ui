<script setup lang="ts">
import { ref } from "vue";
import { ArrowUpRight, RotateCw } from "lucide-vue-next";
import { AcAlert, AcButton } from "@/lib";

const retrying = ref(false);

function retry() {
  retrying.value = true;
  setTimeout(() => (retrying.value = false), 1200);
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <AcAlert color="warning" action-label="Upgrade" :action-icon="ArrowUpRight" dismissible>
      <strong>New version available.</strong> Cluster prod-east can move to KubeDB v2025.8.31.
    </AcAlert>
    <AcAlert color="danger" title="Backup failed for demo-postgres">
      The repository s3://backups/demo is not reachable.
      <template #actions>
        <AcButton title="View Logs" color="white" size="small" />
        <AcButton title="Retry" color="danger" variant="outlined" size="small" :loading="retrying" @click="retry">
          <template #icon><RotateCw /></template>
        </AcButton>
      </template>
    </AcAlert>
  </div>
</template>
