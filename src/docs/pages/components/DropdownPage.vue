<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Use the ⋮ trigger for per-row actions, with `align=\"end\"` and a `menu-label` that names the row.",
  "Start item labels with a verb: “Back up now”, “Rotate credentials”.",
  "Put destructive items last, after a divider, with `danger` — and confirm them in a Delete Modal.",
  "Keep menus short; group long ones under divider labels.",
];
const donts = [
  "Don't use a dropdown to pick a value for a form field — use Select.",
  "Don't add your own `@click` toggle to the trigger; the dropdown wires it up.",
  "Don't hide the only way to do a primary action inside a menu.",
  "Don't nest menus; open a Side Panel or Modal for multi-step choices.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    Use a dropdown for a short list of actions that don't all need their own button: row actions in a table, extra actions in a page header, a
    “Create” menu. To choose a value, use <RouterLink to="/components/select">Select</RouterLink> instead.
  </p>
  <ComponentExample name="dropdown/DropdownBasic" center />
  <Callout type="tip">
    The menu is attached to <code class="prose-code">&lt;body&gt;</code> and placed next to the trigger, so tables, cards and modals never clip it. It opens
    upward when there isn't room below and closes on outside click, Escape or after an item is chosen.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="row-actions" :level="3">Row actions</DocHeading>
  <p>
    With no <code class="prose-code">label</code> and no <code class="prose-code">trigger</code> slot, the trigger is a ⋮ icon button named by
    <code class="prose-code">menu-label</code>. <code class="prose-code">align="end"</code> lines the menu up with the right edge of the row.
  </p>
  <ComponentExample name="dropdown/DropdownRowActions" />
  <DocHeading id="rich-items" :level="3">Icons, descriptions, groups and links</DocHeading>
  <p>
    Items take an <code class="prose-code">icon</code> component (or <code class="prose-code">#icon</code> slot), a <code class="prose-code">description</code>,
    a <code class="prose-code">shortcut</code> hint and <code class="prose-code">disabled</code>. <code class="prose-code">href</code> or
    <code class="prose-code">to</code> make an item a link. A divider with a <code class="prose-code">label</code> starts a named group.
  </p>
  <ComponentExample name="dropdown/DropdownRich" center />
  <DocHeading id="custom-trigger" :level="3">Custom trigger and placement</DocHeading>
  <p>
    Put any button in the <code class="prose-code">#trigger</code> slot; it receives <code class="prose-code">{ open }</code> for a rotating chevron.
    <code class="prose-code">placement="top"</code> prefers opening upward, e.g. for a toolbar at the bottom of the screen.
  </p>
  <ComponentExample name="dropdown/DropdownTrigger" center />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>
      Follows the WAI-ARIA menu button pattern: the trigger gets <code class="prose-code">aria-haspopup="menu"</code>,
      <code class="prose-code">aria-expanded</code> and <code class="prose-code">aria-controls</code>; the panel is a <code class="prose-code">role="menu"</code>
      of <code class="prose-code">role="menuitem"</code>s.
    </li>
    <li>
      Keyboard: Enter, Space or ↓ opens and focuses the first item, ↑ the last; ↑ ↓ Home End move; typing a letter jumps to a matching item; Enter or
      Space chooses; Escape closes and returns focus to the trigger; Tab closes and moves on.
    </li>
    <li>Disabled items are announced with <code class="prose-code">aria-disabled</code> and skipped by the arrow keys.</li>
    <li>Escape inside a Modal or Side Panel closes only the menu first.</li>
    <li>Divider labels name the separator for screen readers, so write item labels that make sense on their own.</li>
  </ul>

  <ApiTables component="AcDropdown" heading="Dropdown API" />
  <ApiTables component="AcDropdownItem" heading="Dropdown Item API" id-prefix="item-" />
  <ApiTables component="AcDropdownDivider" heading="Dropdown Divider API" id-prefix="divider-" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes these components use, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-8 border-border bg-surface shadow-lg z-[90]</code></td><td class="px-4 py-3">Menu panel</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-6 focus:bg-surface-sunken</code></td><td class="px-4 py-3">Highlighted item</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-red-30 focus:bg-red-95</code></td><td class="px-4 py-3">Danger item</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-xs text-muted</code></td><td class="px-4 py-3">Description and shortcut</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">h-px bg-border-light</code></td><td class="px-4 py-3">Divider</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-sm uppercase text-muted</code></td><td class="px-4 py-3">Group label</td></tr>
      </tbody>
    </table>
  </div>
</template>
