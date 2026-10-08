<script setup lang="ts">
import { AcFontScale } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Put it next to the theme switch: the user menu or a settings page.", "Leave the default at “Default” and let people opt in."];
const donts = ["Don't show two text-size switches on one screen.", "Don't hold the size yourself — call useFontScale() so every switch stays in sync."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    A four-way switch for the interface text size. It sets <code class="prose-code">--ac-scale</code> on
    <code class="prose-code">&lt;html&gt;</code>, so text, spacing, control heights and radii grow together, and
    remembers the choice. See <RouterLink to="/getting-started/theming#interface-scale">Theming</RouterLink> for how the scale works.
  </p>
  <ComponentPlayground
    tag="AcFontScale"
    :component="AcFontScale"
    :controls="[{ prop: 'display', type: 'select', options: ['icons', 'labels'] }]"
    :initial="{ display: 'icons' }"
    :defaults="{ display: 'icons' }"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="display" :level="3">Icons and labels</DocHeading>
  <p>Icons fit a navbar; labels read better in menus and settings pages. <code class="prose-code">AcUserMenu</code> shows it with <code class="prose-code">show-font-scale</code>.</p>
  <ComponentExample name="font-scale/FontScaleBasic" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>A <code class="prose-code">radiogroup</code> labelled “Text size”; each option is a <code class="prose-code">radio</code> with <code class="prose-code">aria-checked</code>.</li>
    <li>In icon mode each option is labelled (“Large text”) and has a matching tooltip.</li>
  </ul>

  <ApiTables component="AcFontScale" />
</template>
