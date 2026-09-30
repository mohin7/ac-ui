<script setup lang="ts">
import { AcKbd } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Use `mod` for the main modifier: it shows ⌘ on macOS and Ctrl elsewhere.", "Show shortcuts next to the action they trigger — in a menu item, tooltip or search field.", "Use `small` inside menus, tooltips and inputs."];
const donts = ["Don't use Kbd for code, commands or file names — use `<code>`.", "Don't show a shortcut that isn't wired up on that page.", "Don't make the only way to do something a shortcut."];

const aliases = [
  ["mod", "⌘ on macOS, Ctrl elsewhere"],
  ["cmd, command", "⌘"],
  ["ctrl, control", "Ctrl"],
  ["alt, option", "⌥ on macOS, Alt elsewhere"],
  ["shift", "⇧ on macOS, Shift elsewhere"],
  ["enter", "↩ on macOS, Enter elsewhere"],
  ["return", "↩"],
  ["esc, escape", "Esc"],
  ["backspace, delete", "⌫, Del"],
  ["tab, space", "Tab, Space"],
  ["up, down, left, right", "↑ ↓ ← →"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use Kbd to show a keyboard key or shortcut in text, menus, tooltips and search fields. Pass one key in the slot, or a combination in <code class="prose-code">keys</code>.</p>
  <ComponentPlayground
    tag="AcKbd"
    :component="AcKbd"
    :controls="[{'prop': 'size', 'type': 'select', 'options': ['small', 'normal']}, {'prop': 'separator', 'type': 'text'}]"
    :initial="{'size': 'normal', 'separator': '+'}"
    :defaults="{'size': 'normal', 'separator': '+'}"
    :extra="{'keys': ['mod', 'shift', 'k']}"
    extra-code=":keys=&quot;['mod', 'shift', 'k']&quot;"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="keys" :level="3">Keys and combinations</DocHeading>
  <p>Single letters are upper-cased. Named keys become the platform's symbol or name; pass <code class="prose-code">separator=""</code> for the compact macOS style.</p>
  <ComponentExample name="kbd/KbdBasic" center />
  <DocHeading id="sizes" :level="3">Sizes</DocHeading>
  <p><code class="prose-code">small</code> is 18px tall for menus, tooltips and inputs; <code class="prose-code">normal</code> is 22px for body text.</p>
  <ComponentExample name="kbd/KbdSizes" center />
  <DocHeading id="inline" :level="3">In text and fields</DocHeading>
  <p>Kbd sits on the text baseline, so it can go in a sentence or at the end of a search trigger.</p>
  <ComponentExample name="kbd/KbdInline" />

  <DocHeading id="key-names" :level="3">Key names</DocHeading>
  <p>Names are case-insensitive. Anything else is shown as written.</p>
  <div class="mt-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Name</th><th class="h-9 px-4 font-medium">Shows</th></tr>
      </thead>
      <tbody>
        <tr v-for="[name, shows] in aliases" :key="name" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ name }}</code></td>
          <td class="px-4 py-3">{{ shows }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Renders nested <code class="prose-code">&lt;kbd&gt;</code> elements, the HTML pattern for a key combination.</li>
    <li>Symbols are hidden from screen readers and replaced by the key's name, so <code class="prose-code">⌘ + K</code> is read as “Command plus K”.</li>
    <li>Kbd is not interactive. Register the shortcut yourself and make sure it doesn't clash with the browser or assistive tech.</li>
  </ul>

  <ApiTables component="AcKbd" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted border-border border-b-border-dark</code></td><td class="px-4 py-3">Key cap</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">shadow-[inset_0_-1px_0_0_var(--color-border)]</code></td><td class="px-4 py-3">Key edge</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">h-4.5 rounded-4 text-sm</code> / <code class="prose-code">h-5.5 rounded-6 text-xs</code></td><td class="px-4 py-3">Sizes</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">font-medium text-label</code></td><td class="px-4 py-3">Key text</td></tr>
      </tbody>
    </table>
  </div>
</template>
