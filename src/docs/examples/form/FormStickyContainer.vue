<script setup lang="ts">
import { ref } from "vue";
import { AcForm, AcFormFooter, AcFormSection, AcInput, AcSelect } from "@/lib";

const replicas = ref("3");
const cpu = ref("500m");
const memory = ref("1Gi");
const storage = ref("20Gi");
const storageClass = ref<string | null>("gp3");
const classes = [
  { value: "standard", label: "standard" },
  { value: "gp3", label: "gp3" },
];
</script>

<template>
  <!-- The footer sticks to the bottom of this scrolling box while you scroll. -->
  <div class="ac-scrollbar max-h-100 rounded-10 border border-border bg-surface px-5 pt-5">
    <AcForm @submit="() => {}">
      <AcFormSection title="Compute" :columns="2">
        <AcInput v-model="replicas" label="Replicas" type="number" />
        <AcInput v-model="cpu" label="CPU request" />
        <AcInput v-model="memory" label="Memory request" />
      </AcFormSection>
      <AcFormSection title="Storage" :columns="2">
        <AcSelect v-model="storageClass" :options="classes" label="Storage class" />
        <AcInput v-model="storage" label="Size" />
      </AcFormSection>
      <AcFormSection title="Scheduling" description="Leave empty to schedule on any node.">
        <AcInput label="Node selector" hint="e.g. node.kubernetes.io/instance-type=m5.large" />
        <AcInput label="Tolerations" />
        <AcInput label="Priority class" />
      </AcFormSection>
      <template #footer>
        <AcFormFooter submit-label="Apply" />
      </template>
    </AcForm>
  </div>
</template>
