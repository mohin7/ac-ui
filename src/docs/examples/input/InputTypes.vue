<script setup lang="ts">
import { ref } from "vue";
import { AcInput } from "@/lib";

const email = ref("");
const password = ref("s3cret-pass");
const replicas = ref(3);
</script>

<template>
  <div class="grid max-w-160 gap-5 sm:grid-cols-3">
    <AcInput v-model="email" label="Email" type="email" />
    <AcInput v-model="password" label="Password" type="password" />
    <AcInput v-model="replicas" label="Replicas" type="number" />
  </div>
</template>
