<script setup lang="ts">
import { reactive, ref } from "vue";
import { AcForm, AcFormFooter, AcFormSection, AcInput, AcSelect, AcSwitch, AcTextarea } from "@/lib";

const databases = [
  { value: "demo/pg-prod", label: "pg-prod", description: "PostgreSQL 16.1 · demo", group: "PostgreSQL" },
  { value: "demo/pg-analytics", label: "pg-analytics", description: "PostgreSQL 15.5 · demo", group: "PostgreSQL" },
  { value: "shop/mongo-orders", label: "mongo-orders", description: "MongoDB 7.0 · shop", group: "MongoDB" },
  { value: "shop/redis-cache", label: "redis-cache", description: "Redis 7.2 · shop", group: "Redis" },
];
const frequencies = [
  { value: "0 * * * *", label: "Hourly" },
  { value: "0 2 * * *", label: "Daily at 02:00" },
  { value: "0 3 * * 0", label: "Weekly on Sunday" },
];
const repositories = [
  { value: "s3-backups", label: "s3-backups", description: "Amazon S3 · us-east-1" },
  { value: "gcs-archive", label: "gcs-archive", description: "Google Cloud Storage · europe-west1" },
];
const retentions = [
  { value: "keep-last-7", label: "Keep last 7" },
  { value: "keep-last-30", label: "Keep last 30" },
  { value: "keep-1y", label: "Keep 1 year" },
];

const form = reactive({
  name: "",
  database: null as string | null,
  schedule: "0 2 * * *" as string | null,
  repository: "s3-backups" as string | null,
  retention: "keep-last-30" as string | null,
  encrypt: true,
  paused: false,
  notes: "",
});
const errors = reactive({ name: "", database: "" });
const saving = ref(false);
const saved = ref("");

function validate() {
  errors.name = !form.name
    ? "Enter a name."
    : /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(form.name)
      ? ""
      : "Use lowercase letters, numbers and dashes.";
  errors.database = form.database ? "" : "Choose the database to back up.";
  return !errors.name && !errors.database;
}

function submit() {
  saved.value = "";
  if (!validate()) return;
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    saved.value = `Backup schedule “${form.name}” created.`;
  }, 1200);
}

function cancel() {
  Object.assign(errors, { name: "", database: "" });
  saved.value = "";
}
</script>

<template>
  <AcForm width="narrow" novalidate @submit="submit">
    <AcFormSection title="Target" description="The database to back up and a name for this schedule.">
      <AcSelect v-model="form.database" :options="databases" label="Database" searchable required :error-msg="errors.database" />
      <AcInput v-model="form.name" label="Schedule name" required :error-msg="errors.name" hint="Lowercase letters, numbers and dashes." />
    </AcFormSection>

    <AcFormSection title="Schedule" :columns="2">
      <AcSelect v-model="form.schedule" :options="frequencies" label="Frequency" />
      <AcSelect v-model="form.retention" :options="retentions" label="Retention" />
      <AcSwitch v-model="form.paused" label="Create paused" class="sm:col-span-2" />
    </AcFormSection>

    <AcFormSection title="Storage" description="Snapshots are written to this repository.">
      <AcSelect v-model="form.repository" :options="repositories" label="Backup repository" />
      <AcSwitch v-model="form.encrypt" label="Encrypt snapshots with the repository key" />
    </AcFormSection>

    <AcFormSection title="Notes">
      <AcTextarea v-model="form.notes" label="Description" :rows="3" :maxlength="280" />
    </AcFormSection>

    <template #footer>
      <AcFormFooter submit-label="Create Schedule" :loading="saving" @cancel="cancel">
        <template #left>
          <span v-if="saved" class="text-green-20" role="status">{{ saved }}</span>
        </template>
      </AcFormFooter>
    </template>
  </AcForm>
</template>
