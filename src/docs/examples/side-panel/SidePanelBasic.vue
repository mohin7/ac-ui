<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcInput, AcSelect, AcSidePanel } from "@/lib";

const open = ref(false);
const replicas = ref("3");
const storageClass = ref<string | null>("gp3");
const storageClasses = [
  { value: "standard", label: "standard", description: "HDD, default class" },
  { value: "gp3", label: "gp3", description: "SSD, 3000 IOPS" },
  { value: "io2", label: "io2", description: "Provisioned IOPS" },
];
</script>

<template>
  <AcButton title="Edit Database" @click="open = true" />

  <AcSidePanel v-model:open="open" title="Edit demo-postgres" description="Changes roll out one replica at a time.">
    <div class="space-y-5">
      <AcInput v-model="replicas" label="Replicas" type="number" autofocus />
      <AcSelect v-model="storageClass" :options="storageClasses" label="Storage Class" />
    </div>
    <template #footer>
      <AcButton title="Cancel" color="white" @click="open = false" />
      <AcButton title="Save Changes" @click="open = false" />
    </template>
  </AcSidePanel>
</template>
