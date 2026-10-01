<script setup lang="ts">
import { Cpu, HardDrive, MemoryStick } from "lucide-vue-next";
import { AcUsageCard } from "@/lib";
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-3">
    <AcUsageCard title="CPU" description="Namespace demo" :icon="Cpu" :used="5.4" :limit="12" unit="cores" />
    <AcUsageCard title="Memory" description="Namespace demo" :icon="MemoryStick" :used="27" :limit="32" unit="GiB" />
    <AcUsageCard title="Storage" description="Namespace demo" :icon="HardDrive" :used="262" :limit="250" unit="GiB" />
  </div>
</template>
