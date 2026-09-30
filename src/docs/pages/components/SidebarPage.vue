<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const layout = `<div class="flex">
  <AcSidebar ref="sidebar" v-model:collapsed="collapsed" v-model:mobile-open="menuOpen">
    <template #header><AppLogo /></template>
    <AcSidebarSection label="Workloads">…</AcSidebarSection>
  </AcSidebar>
  <div class="min-w-0 flex-1">
    <AcNavbar @menu="menuOpen = true">…</AcNavbar>
    <RouterView />
  </div>
</div>`;

const theme = [
  ["w-60 · w-14", "Expanded width (240px) · collapsed rail (56px)"],
  ["bg-surface-muted border-border", "Light sidebar"],
  ["dark bg-sidebar", "Dark sidebar; the dark class switches every token inside to the dark theme"],
  ["h-8 rounded-6 text-body", "Item"],
  ["hover:bg-slate-90 · hover:bg-white/8", "Item hover (light · dark sidebar)"],
  ["bg-primary-95 text-primary-20", "Current page"],
  ["border-l border-border", "Guide line beside nested items"],
  ["text-sm uppercase tracking-wider text-muted", "Section label"],
  ["z-[80] shadow-xl · bg-overlay", "Mobile drawer and its backdrop"],
];

const dos = [
  "Group items into a few sections with short labels: Workloads, Operations, Admin.",
  "Give every top-level item an icon, so the collapsed rail still makes sense.",
  "Nest one level at most, e.g. Databases › Postgres, MongoDB, Redis.",
  "Use `to` with vue-router so the current page is marked for you.",
];
const donts = [
  "Don't put actions (Create, Delete) in the sidebar; they belong in the page header.",
  "Don't nest groups inside groups.",
  "Don't use badges for decoration; keep them for counts or something new.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The sidebar is the main navigation of a console app: a logo or cluster switcher on top, sections of links, and a footer. It collapses to a
    56px icon rail on desktop and becomes an off-canvas drawer below 768px. Build it from
    <code class="prose-code">AcSidebar</code>, <code class="prose-code">AcSidebarSection</code> and <code class="prose-code">AcSidebarItem</code>.
  </p>
  <ComponentExample name="sidebar/SidebarBasic" />
  <Callout type="note">
    In an app the sidebar sits beside the content and sticks to the viewport (<code class="prose-code">sticky</code>, full height). The examples here
    use <code class="prose-code">contained</code> so the sidebar lives inside a fixed-height box; see Contained below.
  </Callout>
  <CodeBlock :code="layout" lang="vue" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="dark" :level="3">Dark sidebar</DocHeading>
  <p>
    <code class="prose-code">dark</code> gives the old library's dark look on <code class="prose-code">bg-sidebar</code> in both themes. It puts the
    <code class="prose-code">dark</code> class on the sidebar, so text, borders and any component you place inside, such as a cluster switcher, use the
    dark tokens.
  </p>
  <ComponentExample name="sidebar/SidebarDark" />

  <DocHeading id="collapsed" :level="3">Collapsed rail</DocHeading>
  <p>
    Bind <code class="prose-code">v-model:collapsed</code>. The built-in Collapse button at the bottom toggles it; turn that off with
    <code class="prose-code">:collapsible="false"</code> and drive it yourself. In the rail, labels become tooltips (<code class="prose-code">title</code>)
    and accessible names, badges become dots, and clicking a group expands the sidebar. The <code class="prose-code">header</code> slot receives
    <code class="prose-code">collapsed</code> so you can show a smaller logo.
  </p>
  <ComponentExample name="sidebar/SidebarCollapsed" />

  <DocHeading id="mobile" :level="3">Mobile drawer</DocHeading>
  <p>
    Below 768px the sidebar is hidden and slides in over the page when <code class="prose-code">v-model:mobile-open</code> is true. Open it from
    <RouterLink to="/components/navbar">Navbar</RouterLink>'s menu button. Choosing an item, pressing Escape or clicking the backdrop closes it.
  </p>
  <ComponentExample name="sidebar/SidebarMobile" />
  <p>
    To use one button for both, call the sidebar's exposed <code class="prose-code">toggle()</code>: it collapses the rail on desktop and opens
    the drawer on phones, e.g. <code class="prose-code">&lt;AcNavbar menu-button="always" @menu="sidebar?.toggle()" /&gt;</code>.
  </p>

  <DocHeading id="router" :level="3">Router links</DocHeading>
  <p>
    <code class="prose-code">to</code> renders a <code class="prose-code">RouterLink</code> when vue-router is installed in your app, and a plain
    <code class="prose-code">&lt;a href&gt;</code> when it isn't, so the design system doesn't depend on vue-router. With a router, the item whose route
    matches exactly gets <code class="prose-code">aria-current="page"</code> and the active style without an <code class="prose-code">active</code> prop,
    and a group opens by itself when one of its items is the current page. Use <code class="prose-code">href</code> for pages outside the app, and
    no link at all (a button that emits <code class="prose-code">click</code>) for in-page state.
  </p>
  <ComponentExample name="sidebar/SidebarRouterLinks" />

  <DocHeading id="contained" :level="3">Contained</DocHeading>
  <p>
    By default the sidebar measures the window and positions the drawer with <code class="prose-code">fixed</code>. With
    <code class="prose-code">contained</code> it follows its parent's width instead, and the drawer and backdrop use
    <code class="prose-code">absolute</code>, so they stay inside the parent. Give that parent <code class="prose-code">relative</code>,
    <code class="prose-code">overflow-hidden</code> and a height. Use it for previews, embedded shells and split views, like every example on this page and
    the <RouterLink to="/examples/app-shell">App shell</RouterLink>.
  </p>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The links are in a <code class="prose-code">&lt;nav&gt;</code> landmark named by <code class="prose-code">label</code>, as nested lists.</li>
    <li>The current page has <code class="prose-code">aria-current="page"</code>.</li>
    <li>Groups and collapsible sections follow the disclosure pattern: a button with <code class="prose-code">aria-expanded</code> and <code class="prose-code">aria-controls</code>.</li>
    <li>In the rail each item keeps its label as the accessible name and as a hover tooltip.</li>
    <li>The mobile drawer is a modal dialog: focus moves into it, Tab stays inside, Escape closes it and focus returns to the menu button.</li>
    <li>Width and slide animations are turned off under <code class="prose-code">prefers-reduced-motion</code>.</li>
  </ul>

  <ApiTables component="AcSidebar" heading="Sidebar API" />
  <p class="-mt-6 mb-10 text-base text-muted">
    Exposes <code class="prose-code">toggle()</code>: collapses or expands on desktop, opens or closes the drawer on mobile.
  </p>
  <ApiTables component="AcSidebarSection" heading="Sidebar Section API" id-prefix="section-" />
  <ApiTables component="AcSidebarItem" heading="Sidebar Item API" id-prefix="item-" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes these components use, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[classes, use] in theme" :key="classes" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ classes }}</code></td>
          <td class="px-4 py-3">{{ use }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
