<script setup lang="ts">
import CopyChip from "../../components/CopyChip.vue";
import DocHeading from "../../components/DocHeading.vue";

const radii = [
  { cls: "rounded-none", px: "0", use: "Flush table cells" },
  { cls: "rounded-4", px: "4px", use: "Checkboxes, inline code, small chips" },
  { cls: "rounded-6", px: "6px", use: "Controls: buttons, inputs, badges, menus" },
  { cls: "rounded-10", px: "10px", use: "Surfaces: cards, tables, alerts" },
  { cls: "rounded-12", px: "12px", use: "Dialogs, example frames" },
  { cls: "rounded-16", px: "16px", use: "Hero panels" },
  { cls: "rounded-50", px: "50px", use: "Pills: status badges, switches" },
  { cls: "rounded-full", px: "50%", use: "Avatars, dots, step circles" },
];

const shadows = [
  { cls: "shadow-xs", use: "Controls and resting surfaces: buttons, inputs, cards, tables" },
  { cls: "shadow-sm", use: "Slightly raised: hovered cards, stat tiles" },
  { cls: "shadow-md", use: "Floating on content: toggles, raised panels" },
  { cls: "shadow-lg", use: "Menus, popovers and dropdowns" },
  { cls: "shadow-xl", use: "Dialogs, command palette" },
  { cls: "shadow-button", use: "Solid buttons: a 1px top highlight plus a hairline drop" },
];
</script>

<template>
  <DocHeading id="radius">Radius</DocHeading>
  <p>
    Two radii carry the system: <code class="prose-code">rounded-6</code> for controls and
    <code class="prose-code">rounded-10</code> for the surfaces they sit on. The source's
    <code class="prose-code">.is-rounded-N</code> steps still exist as <code class="prose-code">rounded-N</code>.
  </p>
  <div class="my-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <div v-for="r in radii" :key="r.cls" class="rounded-10 border border-border bg-white p-4 text-center shadow-xs">
      <div class="mx-auto mb-3 size-14 border-2 border-primary bg-primary-95" :class="r.cls" />
      <CopyChip :text="r.cls" />
      <p class="mt-1 text-xs leading-[17px] text-muted">{{ r.px }} · {{ r.use }}</p>
    </div>
  </div>

  <DocHeading id="shadow">Elevation</DocHeading>
  <p>
    Shadows are soft, layered and slate-tinted. Most surfaces pair a hairline <code class="prose-code">border-border</code>
    with <code class="prose-code">shadow-xs</code>; stronger shadows are only for things that float above the page.
  </p>
  <div class="preview-canvas my-6 grid gap-6 rounded-12 border border-border-light p-8 sm:grid-cols-3">
    <div v-for="s in shadows" :key="s.cls" class="rounded-10 bg-white p-5" :class="[s.cls, s.cls !== 'shadow-button' && s.cls !== 'shadow-xs' ? '' : 'border border-border']">
      <CopyChip :text="s.cls" />
      <p class="mt-2 text-base leading-[20px] text-label">{{ s.use }}</p>
    </div>
  </div>
</template>
