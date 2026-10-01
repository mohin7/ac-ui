<script setup lang="ts">
import { ref } from "vue";
import { Check, Copy, FolderOpen, WandSparkles } from "lucide-vue-next";
import { AcInput } from "@/lib";

const password = ref("");
const connection = ref("postgres://demo-postgres.demo.svc:5432/app");
const kubeconfig = ref("~/.kube/config");
const copied = ref(false);

function generate() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  password.value = Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 20);
}

async function copy() {
  await navigator.clipboard?.writeText(connection.value).catch(() => undefined);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <div class="flex max-w-96 flex-col gap-5">
    <AcInput v-model="password" label="Root Password" type="password" addon-label="Generate" :addon-icon="WandSparkles" @addon="generate" />
    <AcInput
      v-model="connection"
      label="Connection String"
      readonly
      :addon-label="copied ? 'Copied' : 'Copy'"
      :addon-icon="copied ? Check : Copy"
      addon-icon-only
      @addon="copy"
    />
    <AcInput v-model="kubeconfig" label="Kubeconfig" addon-label="Browse" :addon-icon="FolderOpen" />
  </div>
</template>
