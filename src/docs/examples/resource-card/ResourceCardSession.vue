<script setup lang="ts">
import { Bot, Monitor, Smartphone } from "lucide-vue-next";
import { AcButton, AcResourceCard } from "@/lib";

const sessions = [
  { id: "s1", device: Monitor, where: "Dhaka, Bangladesh · 103.4.145.2", when: "Active now", current: true },
  { id: "s2", device: Smartphone, where: "Singapore · 165.21.8.90", when: "Last used 2 days ago" },
  { id: "s3", device: Bot, where: "CI runner · 34.82.11.4", when: "Last used 5 hours ago" },
];
</script>

<template>
  <div class="flex max-w-2xl flex-col gap-2">
    <AcResourceCard
      v-for="s in sessions"
      :key="s.id"
      :name="s.where"
      :subtitle="s.when"
      :icon="s.device"
      :status="s.current ? 'This device' : ''"
      status-color="success"
    >
      <template #actions>
        <AcButton :title="s.current ? 'Details' : 'Sign out'" size="small" color="white" />
      </template>
    </AcResourceCard>
  </div>
</template>
