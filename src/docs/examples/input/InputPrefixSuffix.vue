<script setup lang="ts">
import { ref } from "vue";
import { Layers } from "@lucide/vue";
import { AcInput } from "@/lib";

const endpoint = ref("");
const storage = ref(10);
const namespace = ref("demo");
</script>

<template>
  <div class="grid max-w-180 gap-5 sm:grid-cols-3">
    <AcInput v-model="endpoint" label="Endpoint" type="url" hint="Host and port, e.g. pg.demo.svc:5432">
      <template #prefix>https://</template>
    </AcInput>
    <AcInput v-model="storage" label="Storage Size" type="number">
      <template #suffix>Gi</template>
    </AcInput>
    <AcInput v-model="namespace" label="Namespace">
      <template #prefix><Layers aria-hidden="true" /></template>
    </AcInput>
  </div>
</template>
