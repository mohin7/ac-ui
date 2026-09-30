<script setup lang="ts">
import { AcThemeMode } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Put it where people look for it: the user menu, or the navbar's actions.", "Default new apps to “system”."];
const donts = ["Don't show two theme switches on one screen.", "Don't hold theme state yourself — call useColorMode() so every switch stays in sync."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    A three-way switch for light, dark and system theme. It toggles <code class="prose-code">.dark</code> (and the old
    <code class="prose-code">.is-dark-theme</code>) on <code class="prose-code">&lt;html&gt;</code> and remembers the choice. See
    <RouterLink to="/getting-started/dark-mode">Dark Mode</RouterLink> for the setup.
  </p>
  <ComponentPlayground
    tag="AcThemeMode"
    :component="AcThemeMode"
    :controls="[{ prop: 'display', type: 'select', options: ['icons', 'labels'] }]"
    :initial="{ display: 'icons' }"
    :defaults="{ display: 'icons' }"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="display" :level="3">Icons and labels</DocHeading>
  <p>Icons fit a navbar; labels read better in menus and settings pages.</p>
  <ComponentExample name="theme-mode/ThemeModeBasic" />
  <DocHeading id="settings" :level="3">In a settings row</DocHeading>
  <ComponentExample name="theme-mode/ThemeModeSettings" />
  <DocHeading id="composable" :level="3">Your own control</DocHeading>
  <p>
    <code class="prose-code">useColorMode()</code> gives the shared state — <code class="prose-code">mode</code>,
    <code class="prose-code">isDark</code> and <code class="prose-code">setMode()</code> — for a custom toggle.
  </p>
  <ComponentExample name="theme-mode/ThemeModeComposable" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>A <code class="prose-code">radiogroup</code> labelled “Theme”; each option is a <code class="prose-code">radio</code> with <code class="prose-code">aria-checked</code>.</li>
    <li>In icon mode each option is labelled (“Dark theme”) and has a matching tooltip.</li>
  </ul>

  <ApiTables component="AcThemeMode" />

  <DocHeading id="theme">Theme</DocHeading>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-8 border-border bg-surface-muted p-0.5</code></td><td class="px-4 py-3">Track</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface shadow-sm ring-1 ring-border</code></td><td class="px-4 py-3">Selected option</td></tr>
      </tbody>
    </table>
  </div>
</template>
