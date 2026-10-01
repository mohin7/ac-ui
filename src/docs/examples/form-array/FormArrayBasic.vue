<script setup lang="ts">
import { ref } from "vue";
import { AcFormArray, AcInput, AcSelect } from "@/lib";

type Quota = { group: string | null; kind: string | null; cpu: string; memory: string };

const quotas = ref<Quota[]>([
  { group: "kubedb.com", kind: "Postgres", cpu: "4", memory: "8Gi" },
  { group: "kubedb.com", kind: "MongoDB", cpu: "2", memory: "4Gi" },
]);

const columns = [
  { key: "group", label: "Group" },
  { key: "kind", label: "Kind" },
  { key: "cpu", label: "CPU Limit" },
  { key: "memory", label: "Memory Limit" },
];
const groups = [
  { value: "kubedb.com", label: "kubedb.com" },
  { value: "stash.appscode.com", label: "stash.appscode.com" },
];
const kinds = ["Postgres", "MongoDB", "MySQL", "Redis", "Elasticsearch"].map((k) => ({ value: k, label: k }));

function newQuota(): Quota {
  return { group: "kubedb.com", kind: null, cpu: "", memory: "" };
}

function validate(quota: Quota, index: number) {
  const errors: Record<string, string> = {};
  if (!quota.kind) errors.kind = "Choose a kind.";
  else if (quotas.value.some((q, i) => i !== index && q.group === quota.group && q.kind === quota.kind)) errors.kind = "This kind already has a quota.";
  if (!quota.cpu && !quota.memory) errors.cpu = "Set a CPU or a memory limit.";
  return errors;
}
</script>

<template>
  <AcFormArray
    v-model="quotas"
    label="Quotas"
    item-name="quota"
    :columns="columns"
    :new-item="newQuota"
    :validate="validate"
    required
    hint="Limits apply to every database of that kind in the namespace."
  >
    <template #form="{ item, errors, isNew }">
      <div class="grid gap-4 sm:grid-cols-2">
        <AcSelect v-model="item.group" :options="groups" label="Group" :disabled="!isNew" required />
        <AcSelect v-model="item.kind" :options="kinds" label="Kind" :disabled="!isNew" required :error-msg="errors.kind" />
        <AcInput v-model="item.cpu" label="CPU Limit" hint="Cores, e.g. 2 or 500m" :error-msg="errors.cpu" />
        <AcInput v-model="item.memory" label="Memory Limit" hint="e.g. 4Gi" :error-msg="errors.memory" />
      </div>
    </template>
  </AcFormArray>
</template>
