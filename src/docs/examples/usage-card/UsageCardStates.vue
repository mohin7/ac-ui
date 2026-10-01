<script setup lang="ts">
import { ref } from "vue";
import { Database, Users } from "lucide-vue-next";
import { AcButton, AcUsageCard, useToast } from "@/lib";

const { toast } = useToast();
const loading = ref(false);

function reload() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1500);
}
</script>

<template>
  <div>
    <AcButton title="Reload" color="white" size="small" class="mb-3" :loading="loading" @click="reload" />
    <div class="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-3">
      <AcUsageCard title="Databases" description="Business plan" :icon="Database" :used="18" :limit="20" unit="databases" :loading="loading" @click="toast('Open plan details')" />
      <AcUsageCard title="Seats" description="Enterprise plan" :icon="Users" :used="37" unit="members" :loading="loading" />
      <AcUsageCard title="Clusters" :used="3" :limit="5" :warning-at="60" :danger-at="100" :loading="loading" />
    </div>
  </div>
</template>
