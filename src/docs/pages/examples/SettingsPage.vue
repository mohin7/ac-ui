<script setup lang="ts">
import ComponentExample from "../../components/ComponentExample.vue";
import DocHeading from "../../components/DocHeading.vue";
</script>

<template>
  <p>
    Account and organisation settings built only from design-system components. Pick a section on the left (a select
    on narrow screens). Every flow works: save the profile, create a token and copy it, change a member's role, or
    delete the organisation by typing its name.
  </p>
  <DocHeading id="preview">Preview and code</DocHeading>
  <ComponentExample name="pages/SettingsExample" :padded="false" />

  <DocHeading id="patterns">Patterns</DocHeading>
  <ul>
    <li>The navigation is a vertical list when there's room and a select below 640px of width (Side Tabs' default breakpoint), so the page never scrolls sideways.</li>
    <li>Save and Discard appear only once the profile has changed. Toggles save as they're flipped, so they need no button.</li>
    <li>A new token is shown exactly once, with a copy button and a warning. The table only ever shows its prefix.</li>
    <li>Revoking a token asks once; deleting the organisation also asks for its name to be typed.</li>
  </ul>

  <DocHeading id="uses">Components used</DocHeading>
  <ul>
    <li><RouterLink to="/components/side-tabs">Side Tabs</RouterLink> for the section list, which turns into a select on phones</li>
    <li><RouterLink to="/components/avatar">Avatar</RouterLink>, <RouterLink to="/components/file-upload">FileUpload</RouterLink> (small), <RouterLink to="/components/input">Input</RouterLink> and <RouterLink to="/components/form">Form</RouterLink> with a FormFooter for the profile</li>
    <li><RouterLink to="/components/theme-mode">ThemeMode</RouterLink> with labels for appearance</li>
    <li><RouterLink to="/components/section">SectionContent</RouterLink> and <RouterLink to="/components/switch">Switch</RouterLink> rows for notifications</li>
    <li><RouterLink to="/components/table">Table</RouterLink>, <RouterLink to="/components/tag">Tag</RouterLink>, <RouterLink to="/components/kbd">Kbd</RouterLink>, <RouterLink to="/components/modal">Modal</RouterLink> and <RouterLink to="/components/delete-modal">DeleteModal</RouterLink> for API tokens</li>
    <li><RouterLink to="/components/select">Select</RouterLink> (compact) and <RouterLink to="/components/pagination">Pagination</RouterLink> for members</li>
    <li><RouterLink to="/components/toast">useToast()</RouterLink> for results</li>
  </ul>
</template>
