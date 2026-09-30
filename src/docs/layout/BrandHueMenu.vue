<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { presets, useBrandHue } from "../composables/useBrandHue";

const { hue, saturation, light, apply } = useBrandHue();
const open = ref(false);
const el = ref<HTMLElement | null>(null);

const onPointerDown = (e: PointerEvent) => {
  if (open.value && el.value && !el.value.contains(e.target as Node)) open.value = false;
};
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") open.value = false;
};
onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div ref="el" class="relative">
    <button
      type="button"
      class="inline-flex size-8 cursor-pointer items-center justify-center rounded-6 transition hover:bg-surface-sunken"
      :aria-expanded="open"
      aria-label="Brand hue"
      title="Brand hue"
      @click="open = !open"
    >
      <span class="size-3.5 rounded-full bg-primary shadow-button ring-[3px] ring-primary-93" aria-hidden="true" />
    </button>
    <div
      v-if="open"
      class="absolute right-0 z-50 mt-2 w-72 animate-pop-in rounded-10 border border-border bg-surface p-4 shadow-xl"
      role="dialog"
      aria-label="Brand hue"
    >
      <p class="mb-3 text-xs text-label">
        Primary steps are <code class="prose-code">hsl(var(--primary-hue) …)</code>. Re-hue the docs the way a
        white-label app would.
      </p>
      <label class="mb-3 block text-xs font-medium text-label">
        Hue <span class="float-right text-heading">{{ hue }}</span>
        <input v-model.number="hue" type="range" min="0" max="360" class="mt-1 w-full accent-primary" />
      </label>
      <label class="mb-3 block text-xs font-medium text-label">
        Saturation <span class="float-right text-heading">{{ saturation }}%</span>
        <input v-model.number="saturation" type="range" min="0" max="100" class="mt-1 w-full accent-primary" />
      </label>
      <label class="mb-3 block text-xs font-medium text-label">
        Lightness <span class="float-right text-heading">{{ light }}%</span>
        <input v-model.number="light" type="range" min="15" max="50" class="mt-1 w-full accent-primary" />
      </label>
      <div class="flex gap-2">
        <button
          v-for="p in presets"
          :key="p.name"
          type="button"
          class="flex-1 cursor-pointer rounded-6 border border-border px-2 py-1.5 text-xs font-medium text-heading shadow-xs transition hover:border-border-dark hover:bg-surface-muted"
          @click="apply(p)"
        >
          {{ p.name }}
        </button>
      </div>
    </div>
  </div>
</template>
