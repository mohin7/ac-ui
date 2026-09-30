<script setup lang="ts">
import ComponentExample from "../../components/ComponentExample.vue";
import DocHeading from "../../components/DocHeading.vue";
</script>

<template>
  <p>
    A complete console page built only from design-system components and theme utilities. Click
    <strong class="text-heading">Create Database</strong> to try the wizard; deploying adds a row. Copy the source
    below as a starting point for a real page.
  </p>
  <DocHeading id="preview">Preview and code</DocHeading>
  <ComponentExample name="pages/DatabasesExample" :padded="false" />

  <DocHeading id="uses">Components used</DocHeading>
  <ul>
    <li><RouterLink to="/components/button">Button</RouterLink>, <RouterLink to="/components/alert">Alert</RouterLink>, <RouterLink to="/components/card">Card</RouterLink> and <RouterLink to="/components/badge">Badge</RouterLink> for the page frame and status</li>
    <li><RouterLink to="/components/tabs">Tabs</RouterLink> and <RouterLink to="/components/table">Table</RouterLink> for the filtered list</li>
    <li><RouterLink to="/components/steps">Steps</RouterLink>, <RouterLink to="/components/input">Input</RouterLink>, <RouterLink to="/components/check-radio">CheckRadio</RouterLink>, <RouterLink to="/components/checkbox">CheckBox</RouterLink> and <RouterLink to="/components/switch">Switch</RouterLink> for the wizard</li>
  </ul>
</template>
