<script setup lang="ts">
import ComponentExample from "../../components/ComponentExample.vue";
import DocHeading from "../../components/DocHeading.vue";
</script>

<template>
  <p>
    What a page shows when there's nothing to show: no data yet, no matches, still loading, a failure, a missing
    resource or no permission. Each state tells people what happened and gives them one clear next step.
  </p>

  <DocHeading id="empty-list">Empty list</DocHeading>
  <p>
    Use it the first time someone opens a list that has no items yet. Explain what belongs here and lead with the
    action that creates the first one.
  </p>
  <ComponentExample name="states/StatesEmptyList" />

  <DocHeading id="no-results">No search results</DocHeading>
  <p>
    Use it when a search or filter matches nothing, but the list itself isn't empty. Repeat the query and offer
    <strong>Clear search</strong> so people can get back to the full list in one click.
  </p>
  <ComponentExample name="states/StatesNoResults" />

  <DocHeading id="loading">Loading</DocHeading>
  <p>
    Use a preloader while a whole page or panel waits for data whose layout you can't predict, and a skeleton when you
    know the shape, such as a table, so the page doesn't jump when the rows arrive.
  </p>
  <ComponentExample name="states/StatesLoading" />

  <DocHeading id="error">Error</DocHeading>
  <p>
    Use it when a request fails. Say what failed in plain words, offer <strong>Retry</strong>, and use a banner for a
    problem that affects the whole cluster rather than one list.
  </p>
  <ComponentExample name="states/StatesError" />

  <DocHeading id="not-found">Not found (404)</DocHeading>
  <p>
    Use it when a link points to a resource that doesn't exist or was deleted. Name the resource and link back to the
    list it came from.
  </p>
  <ComponentExample name="states/StatesNotFound" />

  <DocHeading id="no-permission">No permission (403)</DocHeading>
  <p>
    Use it when the resource exists but the viewer's role can't see it. Say who owns it and let them ask for access
    rather than leaving them at a dead end.
  </p>
  <ComponentExample name="states/StatesPermission" />

  <DocHeading id="uses">Components used</DocHeading>
  <ul>
    <li><RouterLink to="/components/empty-state">Empty State</RouterLink> for every state, with its <code class="prose-code">empty</code>, <code class="prose-code">search</code> and <code class="prose-code">error</code> variants</li>
    <li><RouterLink to="/components/content-table">Content Table</RouterLink> and <RouterLink to="/components/table">Table</RouterLink> for the lists around them</li>
    <li><RouterLink to="/components/spinner">Preloader</RouterLink> and <RouterLink to="/components/skeleton">Skeleton</RouterLink> for loading</li>
    <li><RouterLink to="/components/banner">Banner</RouterLink> for the degraded cluster, and <RouterLink to="/components/toast">Toast</RouterLink> to confirm an access request</li>
  </ul>
</template>
