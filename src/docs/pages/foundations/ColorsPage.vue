<script setup lang="ts">
import { ref } from "vue";
import Callout from "../../components/Callout.vue";
import CopyChip from "../../components/CopyChip.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";
import { useCopy } from "../../composables/useCopy";
import { scales, semantic, slate } from "../../data/palette";

const { copy } = useCopy();
const ink = (step: number) => (step <= 50 ? "text-white" : "text-heading");
const lastCopied = ref("");
const copySwatch = (cls: string) => {
  copy(cls);
  lastCopied.value = cls;
  setTimeout(() => lastCopied.value === cls && (lastCopied.value = ""), 1200);
};

const dos = [
  "Use semantic tokens first: text-heading, text-body, border-border.",
  "Use one primary action colour per view.",
  "Pair status colours with a word or icon.",
  "Use -95 fills with -10 text for tinted badges and alerts.",
];
const donts = [
  "Don't use primary for decoration or large backgrounds.",
  "Don't use purple as a status.",
  "Don't set small body text in white on primary (3.7:1) or warning (2.1:1).",
  "Don't hard-code hex values in components — use the scale.",
];

</script>

<template>
  <p>Click any swatch to copy its Tailwind class. Hover to see the value.</p>

  <DocHeading id="scales">Brand and status scales</DocHeading>
  <p>
    Every scale runs from 5 to 97% lightness. Step down for text on tints, up for fills. The outlined swatch is the
    scale's named alias.
  </p>
  <div v-for="scale in scales" :key="scale.name" class="mb-6">
    <div class="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h5 class="capitalize">{{ scale.name }}</h5>
      <span v-if="scale.alias" class="text-xs text-label">
        alias <CopyChip :text="`bg-${scale.alias.name}`" /> = {{ scale.name }}-{{ scale.alias.step }}
      </span>
      <span class="text-xs text-label">{{ scale.use }}</span>
    </div>
    <div class="grid grid-cols-7 gap-1 sm:grid-cols-13">
      <button
        v-for="step in [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 93, 95, 97]"
        :key="step"
        type="button"
        class="flex h-16 cursor-pointer flex-col justify-end rounded-8 p-1.5 text-left text-xs leading-tight transition-transform hover:scale-105"
        :class="[ink(step), scale.alias?.step === step && 'ring-2 ring-heading ring-offset-2']"
        :style="{ background: scale.value(step) }"
        :title="`bg-${scale.name}-${step} · ${scale.value(step)}`"
        @click="copySwatch(`bg-${scale.name}-${step}`)"
      >
        <span class="font-medium">{{ lastCopied === `bg-${scale.name}-${step}` ? "Copied" : step }}</span>
      </button>
    </div>
  </div>

  <DocHeading id="slate">Slate — text and borders</DocHeading>
  <p>Neutral text and borders use slate. These are Tailwind v3's slate hex values on AppsCode's step names.</p>
  <div class="grid grid-cols-6 gap-1 sm:grid-cols-11">
    <button
      v-for="[step, hex] in slate"
      :key="step"
      type="button"
      class="flex h-16 cursor-pointer flex-col justify-end rounded-8 p-1.5 text-left text-xs leading-tight transition-transform hover:scale-105"
      :class="step <= 50 ? 'text-white' : 'text-heading'"
      :style="{ background: hex }"
      :title="`bg-slate-${step} · ${hex}`"
      @click="copySwatch(`bg-slate-${step}`)"
    >
      <span class="font-medium">{{ lastCopied === `bg-slate-${step}` ? "Copied" : step }}</span>
      <span class="opacity-80">{{ hex }}</span>
    </button>
  </div>

  <DocHeading id="semantic">Semantic tokens</DocHeading>
  <p>Reach for these before raw scale steps — they say what a colour is for.</p>
  <div class="my-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr>
          <th class="h-9 px-4 font-medium">Token</th>
          <th class="h-9 px-4 font-medium">Class</th>
          <th class="h-9 px-4 font-medium">Value</th>
          <th class="h-9 px-4 font-medium">Use for</th>
          <th class="h-9 px-4 font-medium">Old SCSS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in semantic" :key="t.token" class="border-t border-border-light">
          <td class="px-4 py-2">
            <span class="flex items-center gap-2">
              <span class="size-5 rounded-2 border border-border" :style="{ background: `var(--color-${t.token})` }" />
              <span class="font-medium text-heading">{{ t.token }}</span>
            </span>
          </td>
          <td class="px-4 py-2"><CopyChip :text="t.cls" /></td>
          <td class="px-4 py-2 text-xs text-label">{{ t.ref }}</td>
          <td class="px-4 py-2">{{ t.use }}</td>
          <td class="px-4 py-2"><code class="font-mono text-xs text-label">{{ t.source }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="usage-rules">Usage rules</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="contrast">Contrast</DocHeading>
  <p>Values are kept exact from the Bulma source. Know these pairs:</p>
  <Callout type="warning">
    White on <code class="prose-code">primary</code> is 3.7:1 and on <code class="prose-code">success</code> 3.5:1 —
    fine for short 13px/500 button labels, below WCAG 4.5:1 for body text. White on
    <code class="prose-code">warning</code> is 2.1:1, so warning fills use <code class="prose-code">text-yellow-5</code>.
  </Callout>
  <Callout type="note">
    <code class="prose-code">border</code> (slate-80) is 1.2:1 on white — decorative only. Inputs get their edge from
    <code class="prose-code">border-border-dark</code> and turn primary on focus.
  </Callout>
</template>
