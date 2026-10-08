<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Put it directly under the navbar or header and place cards, tables and forms inside it.", "Use `width=\"narrow\"` for forms and settings so lines stay readable."];
const donts = ["Don't add your own p-5 or gap-5 around the page's children; set `padded` and `gap` instead.", "Don't nest one AcPage in another. Use a card or section for grouping."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The padded, evenly spaced area that holds a page's sections. It replaces the hand-written
    <code class="prose-code">p-5</code> and <code class="prose-code">flex flex-col gap-5</code> that every page repeats.
    Use it with <code class="prose-code">AcCard</code> or <code class="prose-code">AcSectionContent</code> for the boxes. For a table inside a box, turn the
    body's padding off and give the table <code class="prose-code">flat</code>.
  </p>
  <ComponentExample name="page/PageBasic" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="width" :level="3">Width and gap</DocHeading>
  <ComponentExample name="page/PageWidth" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <ApiTables component="AcPage" />
</template>
