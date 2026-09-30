<script setup lang="ts">
import { ref } from "vue";
import { AcFileUpload } from "@/lib";
import type { FileRejection } from "@/lib";

// Preloaded so the list shows; in an app this starts empty.
const certs = ref<File[]>([
  new File(["-----BEGIN CERTIFICATE-----"], "ca.crt", { type: "application/x-x509-ca-cert" }),
  new File(["x".repeat(3200)], "tls.crt", { type: "application/x-x509-ca-cert" }),
  new File(["x".repeat(1700)], "tls.key", { type: "application/octet-stream" }),
]);
const rejected = ref<string[]>([]);

function onReject(list: FileRejection[]) {
  rejected.value = list.map((r) => `${r.file.name} (${r.reason})`);
}
</script>

<template>
  <div class="max-w-120">
    <AcFileUpload
      v-model="certs"
      label="TLS certificates"
      accept=".pem,.crt,.key"
      :max-size="256 * 1024"
      multiple
      hint="Upload the CA, certificate and private key for the ingress."
      @reject="onReject"
    />
    <p v-if="rejected.length" class="mt-3 text-xs text-muted">Last rejected: {{ rejected.join(", ") }}</p>
  </div>
</template>
