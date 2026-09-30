<script setup lang="ts">
import { ref } from "vue";
import { AcTextarea } from "@/lib";

const empty = ref("");
const caCert = ref("-----BEGIN CERTIFICATE-----\nMIIDBTCCAe2gAwIBAgIIU3ZqL0hx7wUwDQYJKoZIhvcNAQELBQAwFTETMBEGA1UE\n-----END CERTIFICATE-----");
</script>

<template>
  <div class="grid max-w-200 gap-5 sm:grid-cols-2">
    <AcTextarea v-model="empty" label="License" required error-msg="Paste the license you received by email." :rows="3" />
    <AcTextarea v-model="caCert" label="CA Certificate" readonly mono :rows="3" hint="Managed by cert-manager." />
    <AcTextarea :model-value="'Imported from the AWS Marketplace listing.'" label="Notes" disabled :rows="3" />
  </div>
</template>
