<script setup lang="ts">
import { ref } from "vue";
import { AcAccordion, AcAccordionItem, AcInput, AcSwitch } from "@/lib";

const open = ref<string[]>(["tls"]);
const tls = ref(true);
const issuer = ref("letsencrypt-prod");
const exporter = ref(false);
const port = ref("9187");
</script>

<template>
  <div class="max-w-160">
    <AcAccordion v-model="open" multiple variant="separated">
      <AcAccordionItem value="tls" title="TLS" :description="tls ? `Enabled · ${issuer}` : 'Disabled'">
        <div class="grid gap-4 pt-1">
          <AcSwitch v-model="tls" label="Require TLS for client connections" />
          <AcInput v-model="issuer" label="Cert-manager issuer" :disabled="!tls" />
        </div>
      </AcAccordionItem>
      <AcAccordionItem value="exporter" title="Metrics exporter" :description="exporter ? `Port ${port}` : 'Off'">
        <div class="grid gap-4 pt-1">
          <AcSwitch v-model="exporter" label="Run postgres_exporter as a sidecar" />
          <AcInput v-model="port" label="Port" type="number" :disabled="!exporter" />
        </div>
      </AcAccordionItem>
      <AcAccordionItem value="archiver" title="WAL archiver" description="Needs a backup repository" disabled />
    </AcAccordion>
    <p class="mt-3 text-xs text-muted">Open: {{ open.length ? open.join(", ") : "none" }}</p>
  </div>
</template>
