<script setup lang="ts">
import { ref } from "vue";
import { Database, HardDrive, Network } from "@lucide/vue";
import { AcAccordion, AcAccordionItem, AcCard } from "@/lib";

const open = ref<string | null>(null);
</script>

<template>
  <AcCard title="pg-prod" subtitle="PostgreSQL 16.1 · demo" class="max-w-160">
    <AcAccordion v-model="open" variant="flush" :heading-level="4">
      <AcAccordionItem value="engine" title="Engine" description="PostgreSQL 16.1 · 3 replicas">
        <template #icon><Database /></template>
        Version upgrades run one replica at a time. The primary is upgraded last, after a switchover.
      </AcAccordionItem>
      <AcAccordionItem value="storage" title="Storage" description="gp3 · 20 GiB each">
        <template #icon><HardDrive /></template>
        Volumes can grow online. Shrinking needs a restore into a new database.
      </AcAccordionItem>
      <AcAccordionItem value="network" title="Network" description="ClusterIP · pg-prod.demo.svc:5432">
        <template #icon><Network /></template>
        Expose the database outside the cluster with a LoadBalancer service or the KubeDB gateway.
      </AcAccordionItem>
    </AcAccordion>
  </AcCard>
</template>
