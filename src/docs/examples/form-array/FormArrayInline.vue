<script setup lang="ts">
import { ref } from "vue";
import { AcFormArray, AcInput } from "@/lib";

type EnvVar = { name: string; value: string };

const env = ref<EnvVar[]>([
  { name: "POSTGRES_DB", value: "orders" },
  { name: "PGDATA", value: "/var/pv/data" },
]);
const columns = [
  { key: "name", label: "Name", width: "40%" },
  { key: "value", label: "Value" },
];

function validate(item: EnvVar, index: number) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(item.name)) return { name: "Letters, digits and _ only." };
  if (env.value.some((e, i) => i !== index && e.name === item.name)) return { name: `${item.name} is already set.` };
}
</script>

<template>
  <AcFormArray
    v-model="env"
    label="Environment Variables"
    item-name="variable"
    mode="inline"
    :columns="columns"
    :new-item="() => ({ name: '', value: '' })"
    :validate="validate"
  >
    <template #field-name="{ item, error }">
      <AcInput v-model="item.name" label="Name" :error-msg="error" />
    </template>
    <template #field-value="{ item }">
      <AcInput v-model="item.value" label="Value" />
    </template>
    <template #cell-name="{ value }">
      <span class="font-mono text-xs text-heading">{{ value }}</span>
    </template>
  </AcFormArray>
</template>
