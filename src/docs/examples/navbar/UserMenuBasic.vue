<script setup lang="ts">
import { ref } from "vue";
import { Building2, CreditCard, KeyRound, UserRound } from "lucide-vue-next";
import { AcUserMenu } from "@/lib";

const last = ref("—");
const items = [
  { label: "Profile", icon: UserRound },
  { label: "Organizations", icon: Building2 },
  { label: "API tokens", icon: KeyRound },
  { label: "Billing", icon: CreditCard, disabled: true },
];
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <AcUserMenu
      name="Mohin Uddin"
      email="mohin@appscode.com"
      :items="items"
      show-theme-mode
      show-font-scale
      @select="last = $event.label"
      @logout="last = 'logout'"
    />
    <p class="text-xs text-muted">Last action: <code class="text-code">{{ last }}</code></p>
  </div>
</template>
