<script setup lang="ts">
import { ref } from "vue";
import { AcForm, AcFormFooter, AcFormSection, AcInput, AcSelect, AcSwitch } from "@/lib";

const displayName = ref("prod-eks-us-east");
const region = ref<string | null>("us-east-1");
const monitoring = ref(true);
const alerts = ref(false);
const regions = [
  { value: "us-east-1", label: "us-east-1" },
  { value: "eu-west-1", label: "eu-west-1" },
  { value: "ap-south-1", label: "ap-south-1" },
];
</script>

<template>
  <AcForm layout="aside" @submit="() => {}">
    <AcFormSection title="General" description="How this cluster appears across the console.">
      <AcInput v-model="displayName" label="Display name" />
      <AcSelect v-model="region" :options="regions" label="Region" />
    </AcFormSection>
    <AcFormSection title="Monitoring" description="Prometheus metrics and alerting for every database in the cluster.">
      <AcSwitch v-model="monitoring" label="Enable monitoring" />
      <AcSwitch v-model="alerts" label="Send alerts to Slack" :disabled="!monitoring" />
    </AcFormSection>
    <template #footer>
      <AcFormFooter submit-label="Save Changes" sticky="none" />
    </template>
  </AcForm>
</template>
