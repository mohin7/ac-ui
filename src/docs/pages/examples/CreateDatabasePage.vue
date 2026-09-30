<script setup lang="ts">
import ComponentExample from "../../components/ComponentExample.vue";
import DocHeading from "../../components/DocHeading.vue";
</script>

<template>
  <p>
    A full-page create form built only from design-system components. Try
    <strong class="text-heading">Create database</strong> with an empty name or with
    <code class="prose-code">demo-postgres</code>: the first invalid field scrolls into view and takes focus. A valid form
    shows a loading state, raises a toast and resets.
  </p>
  <DocHeading id="preview">Preview and code</DocHeading>
  <ComponentExample name="pages/CreateDatabaseExample" :padded="false" />

  <DocHeading id="patterns">Patterns</DocHeading>
  <ul>
    <li>Errors appear once a field has been left or the form submitted, never while someone is still typing.</li>
    <li>Fields that only matter for one choice (replicas for high availability, schedule and retention for backups) appear with that choice instead of sitting disabled.</li>
    <li>Rarely used settings live in an accordion. If one of them is invalid on submit, its panel opens before focus moves to it.</li>
    <li>Enter in the add-label field adds the label rather than submitting the form.</li>
  </ul>

  <DocHeading id="uses">Components used</DocHeading>
  <ul>
    <li><RouterLink to="/components/header">Header</RouterLink> with a back button for the page title</li>
    <li><RouterLink to="/components/form">Form</RouterLink>, FormSection in the aside layout and a sticky FormFooter</li>
    <li><RouterLink to="/components/input">Input</RouterLink>, <RouterLink to="/components/select">Select</RouterLink> (searchable and grouped), <RouterLink to="/components/check-radio">CheckRadio</RouterLink> cards and <RouterLink to="/components/switch">Switch</RouterLink> for the fields</li>
    <li><RouterLink to="/components/button-group">SegmentedControl</RouterLink> for the machine profile</li>
    <li><RouterLink to="/components/accordion">Accordion</RouterLink>, <RouterLink to="/components/textarea">Textarea</RouterLink> and <RouterLink to="/components/tag">Tag</RouterLink> for the advanced settings</li>
    <li><RouterLink to="/components/toast">useToast()</RouterLink> for the result</li>
  </ul>
</template>
