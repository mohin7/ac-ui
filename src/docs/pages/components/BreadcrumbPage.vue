<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Start from the highest level people navigate to (the cluster or organisation).", "Put it in AcHeader's breadcrumb slot, above the title."];
const donts = ["Don't use it as the main navigation — that's the sidebar's job.", "Don't repeat the page title as a link: the last crumb is the current page."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    Shows where the current page sits — cluster, section, resource — with links back up the path. Pass
    <code class="prose-code">items</code> from the top level down; the last one is the current page.
  </p>
  <ComponentExample name="breadcrumb/BreadcrumbBasic" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="in-header" :level="3">In a page header</DocHeading>
  <p><code class="prose-code">home-icon</code> swaps the first label for a house icon; the label stays as its accessible name.</p>
  <ComponentExample name="breadcrumb/BreadcrumbHeader" />
  <DocHeading id="collapsed" :level="3">Long paths and icons</DocHeading>
  <p>
    With more than <code class="prose-code">max-items</code> crumbs, the middle ones fold behind “…”, which expands on click.
    Items can carry a Lucide <code class="prose-code">icon</code>. Items with <code class="prose-code">to</code> render a
    <code class="prose-code">RouterLink</code> when vue-router is installed.
  </p>
  <ComponentExample name="breadcrumb/BreadcrumbCollapsed" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>A <code class="prose-code">nav</code> labelled “Breadcrumb” around an ordered list; separators are hidden from screen readers.</li>
    <li>The last item has <code class="prose-code">aria-current="page"</code>. The “…” button is labelled “Show full path”.</li>
  </ul>

  <ApiTables component="AcBreadcrumb" />
</template>
