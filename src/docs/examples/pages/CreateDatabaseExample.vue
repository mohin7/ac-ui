<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { Plus } from "@lucide/vue";
import {
  AcAccordion,
  AcAccordionItem,
  AcButton,
  AcCheckRadio,
  AcForm,
  AcFormFooter,
  AcFormSection,
  AcHeader,
  AcInput,
  AcSegmentedControl,
  AcSelect,
  AcSwitch,
  AcTag,
  AcTextarea,
  useToast,
} from "@/lib";

interface Label {
  key: string;
  value: string;
}

type Field = "name" | "namespace" | "version" | "replicas" | "storageSize" | "storageClass" | "retention" | "config";

const DNS_1123_LABEL = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
const LABEL_KEY = /^([a-z0-9]([-a-z0-9.]*[a-z0-9])?\/)?[A-Za-z0-9]([-A-Za-z0-9_.]*[A-Za-z0-9])?$/;
const LABEL_VALUE = /^([A-Za-z0-9]([-A-Za-z0-9_.]*[A-Za-z0-9])?)?$/;
const CONFIG_LINE = /^[a-z_][a-z0-9_.]*\s*=\s*\S/;
const TAKEN_NAMES = ["demo-postgres"];

const namespaces = ["default", "demo", "billing", "kubedb", "monitoring", "search", "shop", "staging", "stream"].map((n) => ({
  value: n,
  label: n,
}));

const versions = [
  { value: "17.2", label: "Postgres 17.2", description: "Latest", group: "Official" },
  { value: "16.6", label: "Postgres 16.6", description: "Recommended", group: "Official" },
  { value: "15.10", label: "Postgres 15.10", group: "Official" },
  { value: "14.15", label: "Postgres 14.15", description: "End of life in November 2026", group: "Official" },
  { value: "timescaledb-2.17-pg16", label: "TimescaleDB 2.17 on Postgres 16", group: "TimescaleDB" },
  { value: "timescaledb-2.14-pg15", label: "TimescaleDB 2.14 on Postgres 15", group: "TimescaleDB" },
  { value: "postgis-3.5-pg17", label: "PostGIS 3.5 on Postgres 17", group: "PostGIS" },
  { value: "postgis-3.4-pg16", label: "PostGIS 3.4 on Postgres 16", group: "PostGIS" },
];

const topologies = [
  { value: "standalone", label: "Standalone", description: "One instance. Good for development and testing." },
  { value: "ha", label: "High availability", description: "A primary and hot standbys with automatic failover." },
];

const profiles = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "XL" },
];

const PROFILE_SPECS: Record<string, string> = {
  small: "0.5 vCPU · 1 GiB memory · about $18 a month per replica",
  medium: "1 vCPU · 4 GiB memory · about $52 a month per replica",
  large: "2 vCPU · 8 GiB memory · about $104 a month per replica",
  xlarge: "4 vCPU · 16 GiB memory · about $208 a month per replica",
};

const storageClasses = [
  { value: "gp3", label: "gp3", description: "AWS EBS general purpose SSD (default)" },
  { value: "io2", label: "io2", description: "Provisioned IOPS SSD" },
  { value: "longhorn", label: "longhorn", description: "Replicated block storage" },
];

const schedules = [
  { value: "0 * * * *", label: "Every hour", description: "0 * * * *" },
  { value: "0 */6 * * *", label: "Every 6 hours", description: "0 */6 * * *" },
  { value: "0 2 * * *", label: "Daily at 02:00 UTC", description: "0 2 * * *" },
  { value: "0 3 * * 0", label: "Weekly on Sunday at 03:00 UTC", description: "0 3 * * 0" },
];

const toast = useToast();

const frame = ref<HTMLElement | null>(null);
const form = ref(blankForm());
const touched = ref<Field[]>([]);
const submitted = ref(false);
const saving = ref(false);
const advancedOpen = ref<string[]>([]);
const newLabel = ref("");
const labelError = ref("");

const errors = computed<Record<Field, string>>(() => {
  const f = form.value;
  return {
    name: nameError(f.name),
    namespace: f.namespace ? "" : "Choose a namespace.",
    version: f.version ? "" : "Choose a version.",
    replicas: f.topology === "ha" ? rangeError(f.replicas, 3, 9, "Use 3 to 9 replicas.") : "",
    storageSize: rangeError(f.storageSize, 1, 16384, "Use 1 to 16384 GiB."),
    storageClass: f.storageClass ? "" : "Choose a storage class.",
    retention: f.backup ? rangeError(f.retention, 1, 365, "Keep backups for 1 to 365 days.") : "",
    config: configError(f.config),
  };
});

const errorCount = computed(() => Object.values(errors.value).filter(Boolean).length);

const summary = computed(() => {
  const f = form.value;
  const version = versions.find((v) => v.value === f.version)?.label ?? "Postgres";
  const replicas = f.topology === "ha" ? `${f.replicas || "?"} replicas` : "1 replica";
  return `${version} · ${replicas} · ${f.storageSize || "?"} GiB`;
});

function blankForm() {
  return {
    name: "",
    namespace: "demo" as string | null,
    version: "16.6" as string | null,
    topology: "standalone",
    replicas: 3 as string | number,
    profile: "medium" as string | null,
    storageSize: 20 as string | number,
    storageClass: "gp3" as string | null,
    backup: false,
    schedule: "0 2 * * *" as string | null,
    retention: 7 as string | number,
    config: "",
    labels: [{ key: "app.kubernetes.io/part-of", value: "billing" }] as Label[],
  };
}

function nameError(name: string) {
  if (!name) return "Enter a name.";
  if (name.length > 63) return "Use 63 characters or fewer.";
  if (!DNS_1123_LABEL.test(name)) return "Use lowercase letters, numbers and hyphens. Start and end with a letter or number.";
  if (TAKEN_NAMES.includes(name)) return `Name is taken. Try ${name}-2.`;
  return "";
}

function rangeError(value: string | number, min: number, max: number, message: string) {
  const n = Number(value);
  return String(value).trim() !== "" && Number.isInteger(n) && n >= min && n <= max ? "" : message;
}

function configError(config: string) {
  const bad = config.split("\n").findIndex((line) => {
    const text = line.trim();
    return text && !text.startsWith("#") && !CONFIG_LINE.test(text);
  });
  return bad < 0 ? "" : `Line ${bad + 1} isn't in the form key = value.`;
}

// Errors show once a field has been left or the form submitted, so people aren't scolded while typing.
function shown(field: Field) {
  return submitted.value || touched.value.includes(field) ? errors.value[field] : "";
}

function touch(field: Field) {
  if (!touched.value.includes(field)) touched.value = [...touched.value, field];
}

function addLabel() {
  const text = newLabel.value.trim();
  if (!text) return;
  const [key = "", ...rest] = text.split("=");
  const value = rest.join("=");
  if (!text.includes("=") || !LABEL_KEY.test(key)) {
    labelError.value = "Use key=value, e.g. team=payments.";
  } else if (!LABEL_VALUE.test(value) || value.length > 63) {
    labelError.value = "Values use letters, numbers, - _ and . (63 at most).";
  } else if (form.value.labels.some((l) => l.key === key)) {
    labelError.value = `${key} is already set. Remove it first to change it.`;
  } else {
    form.value.labels = [...form.value.labels, { key, value }];
    newLabel.value = "";
    labelError.value = "";
  }
}

function removeLabel(key: string) {
  form.value.labels = form.value.labels.filter((l) => l.key !== key);
}

async function focusFirstError() {
  // The config field lives in a collapsed accordion panel, which is inert until opened.
  if (errors.value.config && !advancedOpen.value.includes("config")) advancedOpen.value = [...advancedOpen.value, "config"];
  await nextTick();
  const field = frame.value?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!field) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  field.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  field.focus({ preventScroll: true });
}

function reset() {
  form.value = blankForm();
  touched.value = [];
  submitted.value = false;
  advancedOpen.value = [];
  newLabel.value = "";
  labelError.value = "";
  frame.value?.scrollTo({ top: 0 });
}

async function onSubmit() {
  submitted.value = true;
  if (errorCount.value) {
    await focusFirstError();
    return;
  }
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const { name, namespace } = form.value;
  toast.success(`Creating ${name}`, {
    description: `${summary.value} in namespace ${namespace}. It turns Ready in a few minutes.`,
  });
  saving.value = false;
  reset();
}

function cancel() {
  reset();
  toast.toast("Nothing was created", { description: "The form was cleared." });
}
</script>

<template>
  <!-- The docs preview is a fixed-height box, so this div stands in for the page's scroll area. -->
  <div ref="frame" class="ac-scrollbar h-[min(760px,calc(100dvh-96px))] overscroll-contain bg-surface">
    <AcHeader sticky back-button title="Create Postgres database" subtitle="appscode / demo-cluster" @back="cancel" />

    <div class="px-4 pt-8 sm:px-8">
      <!-- novalidate: AcInput's required sets the native attribute, and the browser's own bubbles would block submit. -->
      <AcForm layout="aside" novalidate @submit="onSubmit">
        <AcFormSection title="Basics" description="The name is part of every Kubernetes object KubeDB creates, so it can't be changed later.">
          <AcInput
            v-model.trim="form.name"
            label="Name"
            required
            :error-msg="shown('name')"
            hint="Lowercase letters, numbers and hyphens, e.g. orders-db."
            @focusout="touch('name')"
          />
          <AcSelect v-model="form.namespace" :options="namespaces" label="Namespace" searchable required :error-msg="shown('namespace')" />
          <AcSelect v-model="form.version" :options="versions" label="Version" required :error-msg="shown('version')" />
        </AcFormSection>

        <AcFormSection title="Topology" description="High availability keeps the database writable when a node or zone goes down.">
          <AcCheckRadio v-model="form.topology" :options="topologies" name="topology" cards />
          <AcInput
            v-if="form.topology === 'ha'"
            v-model="form.replicas"
            type="number"
            label="Replicas"
            required
            :error-msg="shown('replicas')"
            hint="3 to 9. One primary; the rest are hot standbys."
            @focusout="touch('replicas')"
          />
        </AcFormSection>

        <AcFormSection title="Resources" description="Requests and limits for each replica. You can resize later with a Vertical Scaling OpsRequest." :columns="2">
          <div class="sm:col-span-2">
            <p id="machine-profile-label" class="mb-2 text-xs font-medium text-label">Machine profile</p>
            <AcSegmentedControl v-model="form.profile" :options="profiles" aria-labelledby="machine-profile-label" block />
            <p class="mt-2 text-xs text-muted">{{ PROFILE_SPECS[form.profile ?? "medium"] }}</p>
          </div>
          <AcInput
            v-model="form.storageSize"
            type="number"
            label="Storage size (GiB)"
            required
            :error-msg="shown('storageSize')"
            @focusout="touch('storageSize')"
          />
          <AcSelect v-model="form.storageClass" :options="storageClasses" label="Storage class" required :error-msg="shown('storageClass')" />
        </AcFormSection>

        <AcFormSection title="Backup" description="KubeStash takes snapshots to the cluster's default backup storage." :columns="2">
          <AcSwitch v-model="form.backup" label="Scheduled backups" class="sm:col-span-2" />
          <template v-if="form.backup">
            <AcSelect v-model="form.schedule" :options="schedules" label="Schedule" />
            <AcInput
              v-model="form.retention"
              type="number"
              label="Keep backups for (days)"
              required
              :error-msg="shown('retention')"
              @focusout="touch('retention')"
            />
          </template>
        </AcFormSection>

        <AcFormSection title="Advanced" description="Optional. Most databases run well on the defaults.">
          <AcAccordion v-model="advancedOpen" multiple :heading-level="4">
            <AcAccordionItem value="config" title="Custom configuration" description="Overrides for postgresql.conf">
              <AcTextarea
                v-model="form.config"
                label="postgresql.conf"
                mono
                auto-resize
                :rows="5"
                :max-rows="14"
                :error-msg="shown('config')"
                hint="One key = value per line. Lines starting with # are ignored."
                @focusout="touch('config')"
              />
            </AcAccordionItem>
            <AcAccordionItem
              value="labels"
              title="Labels"
              :description="form.labels.length === 1 ? '1 label' : `${form.labels.length} labels`"
            >
              <div v-if="form.labels.length" class="mb-4 flex flex-wrap gap-2">
                <AcTag
                  v-for="l in form.labels"
                  :key="l.key"
                  :key-label="l.key"
                  :value-label="l.value"
                  color="primary"
                  removable
                  @remove="removeLabel(l.key)"
                />
              </div>
              <p v-else class="mb-4 text-xs text-muted">No labels yet.</p>
              <div class="flex items-start gap-2">
                <!-- Enter adds the label here instead of submitting the whole form. -->
                <AcInput
                  v-model.trim="newLabel"
                  label="Add label"
                  :error-msg="labelError"
                  hint="key=value, e.g. team=payments"
                  class="min-w-0 flex-1"
                  @keydown.enter.prevent="addLabel"
                  @input="labelError = ''"
                />
                <AcButton title="Add" color="white" class="mt-0.5 shrink-0" @click="addLabel">
                  <template #icon><Plus aria-hidden="true" /></template>
                </AcButton>
              </div>
            </AcAccordionItem>
          </AcAccordion>
        </AcFormSection>

        <template #footer>
          <AcFormFooter submit-label="Create database" :loading="saving" @cancel="cancel">
            <template #left>
              <span v-if="submitted && errorCount" class="font-medium text-red-30" role="status">
                {{ errorCount === 1 ? "1 field needs attention" : `${errorCount} fields need attention` }}
              </span>
              <span v-else class="hidden truncate sm:inline">{{ summary }}</span>
            </template>
          </AcFormFooter>
        </template>
      </AcForm>
    </div>
  </div>
</template>
