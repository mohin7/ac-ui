<script setup lang="ts">
import { ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { AcButton, AcEmptyState } from "@/lib";

const retrying = ref(false);

function retry() {
  retrying.value = true;
  setTimeout(() => (retrying.value = false), 1200);
}
</script>

<template>
  <AcEmptyState variant="error" title="Couldn't load backups" description="The cluster prod-eks-us-east didn't respond in 30 seconds.">
    <template #actions>
      <AcButton title="Try again" color="white" :loading="retrying" @click="retry">
        <template #icon><RefreshCw /></template>
      </AcButton>
    </template>
  </AcEmptyState>
</template>
