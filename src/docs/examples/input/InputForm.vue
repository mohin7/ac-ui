<script setup lang="ts">
import { reactive, ref } from "vue";
import { AcAlert, AcButton, AcInput } from "@/lib";

const form = reactive({ name: "", email: "" });
const errors = reactive({ name: "", email: "" });
const saved = ref(false);

function submit() {
  errors.name = form.name ? "" : "Name is required.";
  errors.email = /.+@.+\..+/.test(form.email) ? "" : "Enter a valid email address.";
  saved.value = !errors.name && !errors.email;
}
</script>

<template>
  <form class="max-w-100 space-y-5" novalidate @submit.prevent="submit">
    <AcInput v-model="form.name" label="Full Name" required :error-msg="errors.name" />
    <AcInput v-model="form.email" label="Email" type="email" required :error-msg="errors.email" />
    <AcAlert v-if="saved" color="success">Profile saved.</AcAlert>
    <div class="flex justify-end gap-2">
      <AcButton title="Cancel" color="white" />
      <AcButton title="Save" type="submit" />
    </div>
  </form>
</template>
