<script setup lang="ts">
import { ref } from "vue";
import { Server } from "@lucide/vue";
import { AcButton, AcResourceCard } from "@/lib";

const loading = ref(true);
</script>

<template>
  <div>
    <AcButton :title="loading ? 'Show loaded' : 'Show loading'" color="white" size="small" class="mb-3" @click="loading = !loading" />
    <div class="grid gap-3 md:grid-cols-2">
      <AcResourceCard
        :loading="loading"
        name="worker-pool-a-7f9c2"
        mono
        :icon="Server"
        status="Ready"
        status-color="success"
        :details="[{ label: 'Instance', value: 'm6i.xlarge' }, { label: 'Zone', value: 'us-east-1a' }]"
        href="https://kubernetes.io/docs/concepts/architecture/nodes/"
        target="_blank"
      />
      <AcResourceCard
        name="old-aks-cluster"
        :icon="Server"
        status="Disconnected"
        status-color="danger"
        disabled
        :details="[{ label: 'Provider', value: 'Azure AKS' }, { label: 'Last seen', value: '9d ago' }]"
      />
    </div>
  </div>
</template>
