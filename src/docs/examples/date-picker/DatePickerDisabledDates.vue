<script setup lang="ts">
import { ref } from "vue";
import { AcDatePicker } from "@/lib";

const today = new Date().toISOString().slice(0, 10);
const maxDay = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);
const upgradeDay = ref<string | null>(null);

// Upgrades run only on weekends.
function weekday(day: string) {
  const d = new Date(`${day}T00:00:00Z`).getUTCDay();
  return d !== 0 && d !== 6;
}
</script>

<template>
  <div class="max-w-80">
    <AcDatePicker
      v-model="upgradeDay"
      label="Upgrade Window"
      locale="en-GB"
      :week-starts-on="1"
      :min-date="today"
      :max-date="maxDay"
      :is-date-disabled="weekday"
      hint="Saturdays and Sundays in the next 60 days."
    />
  </div>
</template>
