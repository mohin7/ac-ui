<script setup lang="ts">
import { computed, ref } from "vue";
import { RotateCcw } from "@lucide/vue";
import { AcBadge, AcButton, AcInput, AcSwitch, hexToHsl, useBrandColor } from "@/lib";

const presets = [
  { name: "AppsCode green", hex: "#008540" },
  { name: "Legacy blue", hex: "#1971bd" },
  { name: "Indigo", hex: "#4d4dcb" },
  { name: "Lime (too light)", hex: "#7cb518" },
];

const { color, hsl, contrast, setColor, reset } = useBrandColor();
const keepReadable = ref(false);
const draft = ref(color.value);

const draftError = computed(() => (hexToHsl(draft.value) ? "" : "Use #rgb or #rrggbb"));
const rating = computed(() => {
  if (contrast.value >= 4.5) return { label: "AA", color: "success" } as const;
  if (contrast.value >= 3) return { label: "Large text only", color: "warning" } as const;
  return { label: "Fails", color: "danger" } as const;
});

function apply(hex: string) {
  if (!setColor(hex, { ensureContrast: keepReadable.value })) return;
  draft.value = color.value;
}

function onReset() {
  reset();
  draft.value = color.value;
}
</script>

<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div class="flex flex-col gap-4">
      <div class="flex items-start gap-3">
        <input
          type="color"
          :value="color"
          aria-label="Pick brand colour"
          class="h-9 w-12 shrink-0 cursor-pointer rounded-6 border border-border bg-surface p-1 shadow-xs"
          @input="apply(($event.target as HTMLInputElement).value)"
        />
        <AcInput v-model="draft" label="Brand Colour" :error-msg="draftError" @change="apply(draft)" @keydown.enter="apply(draft)" />
      </div>
      <div class="flex flex-wrap gap-2">
        <AcButton v-for="p in presets" :key="p.hex" color="white" size="small" @click="apply(p.hex)">
          <span class="size-3 rounded-full border border-black/10" :style="{ background: p.hex }" aria-hidden="true" />
          {{ p.name }}
        </AcButton>
      </div>
      <AcSwitch v-model="keepReadable" label="Darken to keep white text readable (4.5:1)" />
      <div>
        <AcButton title="Reset to default" color="ghost" size="small" @click="onReset">
          <template #icon><RotateCcw /></template>
        </AcButton>
      </div>
    </div>

    <div class="flex flex-col gap-4 rounded-10 border border-border bg-surface-muted p-5">
      <div class="flex flex-wrap items-center gap-2">
        <AcButton title="Create Database" />
        <AcButton title="Backup" variant="light" />
        <AcButton title="Restore" variant="outlined" />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <AcBadge label="Ready" color="primary" />
        <AcBadge label="Provisioning" color="primary" variant="light" />
        <a href="#/getting-started/theming" class="text-base font-medium text-primary-20 underline underline-offset-2">View cluster</a>
      </div>
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-base">
        <dt class="text-muted">HSL</dt>
        <dd class="font-mono text-heading">{{ hsl ? `${hsl.hue} ${hsl.saturation}% ${hsl.lightness}%` : "—" }}</dd>
        <dt class="text-muted">White on primary</dt>
        <dd class="flex items-center gap-2 text-heading">
          <span class="font-mono">{{ contrast.toFixed(2) }}:1</span>
          <AcBadge :label="rating.label" :color="rating.color" variant="light" />
        </dd>
      </dl>
    </div>
  </div>
</template>
