<script setup lang="ts">
import ComponentExample from "../../components/ComponentExample.vue";
import DocHeading from "../../components/DocHeading.vue";
</script>

<template>
  <p>
    The detail page of one database, <code class="prose-code">demo-postgres</code>. Open
    <strong class="text-heading">Connect</strong> for the connection details, use the ⋮ menu to restart, scale, pause or
    delete it, and switch tabs to see backups, live metrics and settings. Copy the source below as a starting point.
  </p>
  <DocHeading id="preview">Preview and code</DocHeading>
  <ComponentExample name="pages/DatabaseDetailExample" :padded="false" />

  <DocHeading id="uses">Components used</DocHeading>
  <ul>
    <li><RouterLink to="/components/header">Header</RouterLink>, <RouterLink to="/components/badge">Badge</RouterLink>, <RouterLink to="/components/button">Button</RouterLink> and <RouterLink to="/components/dropdown">Dropdown</RouterLink> for the title bar and its actions</li>
    <li><RouterLink to="/components/side-panel">Side Panel</RouterLink> and <RouterLink to="/components/info-table">Info Table</RouterLink> with copyable values for the connection details</li>
    <li><RouterLink to="/components/delete-modal">Delete Modal</RouterLink> with confirm-by-typing, and <RouterLink to="/components/modal">Modal</RouterLink> for scaling</li>
    <li><RouterLink to="/components/tabs">Tabs</RouterLink> to split the page into Overview, Backups, Monitoring and Settings</li>
    <li><RouterLink to="/components/card">Card</RouterLink>, <RouterLink to="/components/progress">Progress</RouterLink>, <RouterLink to="/components/avatar">Avatar</RouterLink> and <RouterLink to="/components/tag">Tag</RouterLink> for resource usage and events</li>
    <li><RouterLink to="/components/content-table">Content Table</RouterLink>, <RouterLink to="/components/table">Table</RouterLink>, <RouterLink to="/components/pagination">Pagination</RouterLink> and <RouterLink to="/components/toast">Toast</RouterLink> for backups</li>
    <li><RouterLink to="/components/skeleton">Skeleton</RouterLink> while metrics load</li>
    <li><RouterLink to="/components/section">Section</RouterLink>, <RouterLink to="/components/switch">Switch</RouterLink> and <RouterLink to="/components/select">Select</RouterLink> for settings</li>
  </ul>
</template>
