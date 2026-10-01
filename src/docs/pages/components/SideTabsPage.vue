<script setup lang="ts">
import { Activity, DatabaseBackup, LayoutDashboard, Settings2, TriangleAlert } from "lucide-vue-next";
import { AcSideTabs } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const items = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "configuration", label: "Configuration", icon: Settings2 },
  { key: "backups", label: "Backups", icon: DatabaseBackup, badge: 12 },
  { key: "monitoring", label: "Monitoring", icon: Activity },
  { key: "danger", label: "Danger zone", icon: TriangleAlert, tone: "danger" },
];
const script =
  'import { ref } from "vue";\nimport { Activity, DatabaseBackup, LayoutDashboard, Settings2, TriangleAlert } from "lucide-vue-next";\n\nconst section = ref("overview");\nconst items = [\n  { key: "overview", label: "Overview", icon: LayoutDashboard },\n  { key: "configuration", label: "Configuration", icon: Settings2 },\n  { key: "backups", label: "Backups", icon: DatabaseBackup, badge: 12 },\n  { key: "monitoring", label: "Monitoring", icon: Activity },\n  { key: "danger", label: "Danger zone", icon: TriangleAlert, tone: "danger" },\n];';

const dos = [
  "Use side tabs for five or more sections of one resource or settings area.",
  "Give each item a `to` route so sections can be linked and survive a reload.",
  "Group long lists under headings with `group`, and nest only one level.",
];
const donts = [
  "Don't use side tabs for two to four views; use Tabs above the content.",
  "Don't put actions (“Delete”, “Restart”) in the list; put them in the page header.",
  "Don't mix side tabs with the app Sidebar's own nested items for the same pages.",
];
const theme = [
  ["w-[220px] · w-14", "List width (the `width` prop) · collapsed rail (56px)"],
  ["border-r border-border bg-surface", "List surface"],
  ["sticky top-[top] max-h-[calc(100dvh-…)]", "Sticky list, scrolls on its own when long"],
  ["h-8 rounded-6 text-body hover:bg-surface-sunken", "Item"],
  ["bg-primary-95 text-primary-20", "Active item"],
  ["text-red-30 · bg-red-95 text-red-20", "`tone: \"danger\"` item · active"],
  ["border-l border-border", "Guide line beside nested items"],
  ["text-sm uppercase tracking-[0.06em] text-muted", "Group heading"],
  ["border-b border-border bg-surface", "Phone select or scrolling row"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    Side tabs list the sections of one page — a database's detail pages, a cluster's settings — in a column beside the content. Put the content in the
    default slot and the component lays out both, keeps the list in view while the page scrolls, and turns it into a select on phones. For two to four
    views, use <RouterLink to="/components/tabs">Tabs</RouterLink>; for the app's main navigation, use <RouterLink to="/components/sidebar">Sidebar</RouterLink>.
  </p>
  <ComponentPlayground
    tag="AcSideTabs"
    :component="AcSideTabs"
    :controls="[{ prop: 'width', type: 'select', options: ['180px', '220px', '260px'] }, { prop: 'collapsible', type: 'boolean' }, { prop: 'label', type: 'text' }]"
    :initial="{ width: '220px', collapsible: false, label: 'Database sections' }"
    :defaults="{ width: '220px', collapsible: false, label: 'Sections' }"
    :extra="{ modelValue: 'overview', items, sticky: false }"
    slot-text="Page content"
    extra-code='v-model="section" :items="items"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="layout" :level="3">With content beside it</DocHeading>
  <p>
    <code class="prose-code">v-model</code> holds the active <code class="prose-code">key</code>. The default slot is the page content and receives
    <code class="prose-code">active</code>. Items take an <code class="prose-code">icon</code>, a <code class="prose-code">badge</code> with
    <code class="prose-code">badgeColor</code>, and a <code class="prose-code">tone</code> for sections like a danger zone.
  </p>
  <ComponentExample name="side-tabs/SideTabsBasic" :padded="false" />

  <DocHeading id="groups" :level="3">Groups and nested items</DocHeading>
  <p>
    <code class="prose-code">group</code> puts items under a heading. <code class="prose-code">children</code> makes an item a group that expands and
    collapses; it opens by itself when one of its items is active. Nested items can be <code class="prose-code">disabled</code>, e.g. an operation
    the database doesn't support.
  </p>
  <ComponentExample name="side-tabs/SideTabsGroups" :padded="false" />

  <DocHeading id="router" :level="3">Router links</DocHeading>
  <p>
    Items with <code class="prose-code">to</code> render a <code class="prose-code">RouterLink</code>. The item for the current route, or the deepest one
    the route sits under, becomes active and is written back to <code class="prose-code">v-model</code>. Use <code class="prose-code">href</code> without a router.
  </p>
  <ComponentExample name="side-tabs/SideTabsRouter" :padded="false" />

  <DocHeading id="sticky" :level="3">Sticky under a header</DocHeading>
  <p>
    The list sticks while the content scrolls. Set <code class="prose-code">top</code> to the height of the bars above it and
    <code class="prose-code">bottom</code> to a status bar below it. When a bar's height changes, pass its selector in
    <code class="prose-code">offset-selectors</code> and its measured height is added.
  </p>
  <ComponentExample name="side-tabs/SideTabsSticky" :padded="false" />

  <DocHeading id="collapse" :level="3">Collapse and hide</DocHeading>
  <p>
    <code class="prose-code">collapsible</code> adds a button that shrinks the list to an icon rail (<code class="prose-code">v-model:collapsed</code>).
    <code class="prose-code">hide-tabs</code> removes it so the content gets the full width, for an editor page.
  </p>
  <ComponentExample name="side-tabs/SideTabsCollapsible" :padded="false" />

  <DocHeading id="mobile" :level="3">Phones</DocHeading>
  <p>
    Below <code class="prose-code">breakpoint</code> (640px of the component's own width) the list becomes a select, with groups as headings, or with
    <code class="prose-code">mobile="scroll"</code> a row of tabs that scrolls sideways and keeps the active one in view.
  </p>
  <ComponentExample name="side-tabs/SideTabsMobile" />
  <Callout type="note">
    The width is measured on the component when it has content, or on its parent when it's used alone, so it adapts inside panels and previews, not
    just to the window.
  </Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The list is a <code class="prose-code">&lt;nav&gt;</code> landmark named by <code class="prose-code">label</code>; give each one on a page a different name.</li>
    <li>The active item has <code class="prose-code">aria-current="page"</code> for links, or <code class="prose-code">aria-current="true"</code> for in-page sections.</li>
    <li>Items are in the Tab order; ↑ ↓ Home End also move between them (← → in the phone row).</li>
    <li>Groups are buttons with <code class="prose-code">aria-expanded</code> and <code class="prose-code">aria-controls</code>. In the collapsed rail each item keeps its label for screen readers and as a hover title.</li>
    <li>Disabled links get <code class="prose-code">aria-disabled</code> and are skipped by the arrow keys.</li>
  </ul>

  <ApiTables component="AcSideTabs" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[cls, use] in theme" :key="cls" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ cls }}</code></td>
          <td class="px-4 py-3">{{ use }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
