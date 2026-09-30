<script setup lang="ts">
import { ref } from "vue";
import { AcTextarea } from "@/lib";

const reason = ref("Scaling down the staging replica set for the weekend freeze.");
</script>

<template>
  <div class="max-w-120">
    <AcTextarea v-model="reason" label="Reason for change" :rows="3" :maxlength="120" hint="Recorded in the audit log." />
  </div>
</template>
