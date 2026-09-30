<script setup lang="ts">
import { ref } from "vue";
import { AcAccordion, AcAccordionItem } from "@/lib";

const open = ref<string | null>("replication");
</script>

<template>
  <AcAccordion v-model="open" class="max-w-160">
    <AcAccordionItem value="replication" title="Replication">
      A 3-node streaming replication cluster. The primary accepts writes; standbys serve reads and take over within 30 seconds if the primary fails.
    </AcAccordionItem>
    <AcAccordionItem value="backups" title="Backups">
      Daily snapshots to <code class="font-mono text-xs">s3-backups</code> at 02:00 UTC, kept for 30 days. Point-in-time recovery uses the WAL archive.
    </AcAccordionItem>
    <AcAccordionItem value="monitoring" title="Monitoring">
      Metrics are scraped by Prometheus every 30 seconds and shown in the Grafana dashboards linked from the Overview tab.
    </AcAccordionItem>
  </AcAccordion>
</template>
