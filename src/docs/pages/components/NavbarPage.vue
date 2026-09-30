<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const theme = [
  ["h-14 sticky top-0 z-30", "Bar: 56px, sticks to its scroll container"],
  ["bg-surface/90 backdrop-blur-md border-b border-border-light", "Translucent surface over scrolling content"],
  ["h-8 rounded-6 text-label hover:bg-surface-sunken", "Nav item and icon action"],
  ["bg-surface-sunken text-heading", "Active nav item"],
  ["bg-danger text-white ring-2 ring-surface", "Count bubble on an icon action"],
  ["bg-primary-90 text-primary-20 rounded-full", "Initials avatar"],
  ["z-[90] rounded-10 shadow-lg", "User menu panel"],
];

const dos = [
  "Keep the right side short: one or two icon actions, notifications, then the user menu last.",
  "Give every icon-only item a clear `label`; it becomes the tooltip and the accessible name.",
  "Wire the menu button to the sidebar so phones can reach the navigation.",
];
const donts = [
  "Don't put page actions (Create Database) only in the navbar; the page header is where people look for them.",
  "Don't use more than about five top-level links; move the rest into the sidebar.",
  "Don't show counts above 999; the badge caps at `999+`.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The navbar is the 56px bar at the top of every console page: logo, optional top-level links, a search field and the actions on the right
    (create, terminal, notifications and the user menu). It is built from <code class="prose-code">AcNavbar</code>,
    <code class="prose-code">AcNavbarItem</code> and <code class="prose-code">AcUserMenu</code>.
  </p>
  <ComponentExample name="navbar/NavbarBasic" :padded="false" />
  <Callout type="note">
    The bar is translucent with a backdrop blur and sticks to the top of its scroll container. Below 768px the default-slot links are hidden and
    the menu button appears; it emits <code class="prose-code">menu</code>, which you wire to
    <RouterLink to="/components/sidebar">Sidebar</RouterLink>'s <code class="prose-code">v-model:mobile-open</code>.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="search" :level="3">Search and counts</DocHeading>
  <p>
    The <code class="prose-code">search</code> slot is centred and hidden below 640px. <code class="prose-code">badge</code> on an icon-only item shows
    a red count bubble, capped at <code class="prose-code">999+</code>. <code class="prose-code">menu-button="always"</code> keeps the menu button on
    desktop, for apps where it also collapses the sidebar.
  </p>
  <ComponentExample name="navbar/NavbarSearch" :padded="false" />

  <DocHeading id="user-menu" :level="3">User menu</DocHeading>
  <p>
    <code class="prose-code">AcUserMenu</code> is an avatar button that opens the account menu: name and email, your rows (<code class="prose-code">items</code>
    or the default slot), an optional theme switch (<code class="prose-code">show-theme-mode</code>) and Sign out, which emits
    <code class="prose-code">logout</code>. The avatar shows the initials of <code class="prose-code">name</code> unless you pass
    <code class="prose-code">avatar-url</code>. The menu is attached to <code class="prose-code">&lt;body&gt;</code>, so the navbar never clips it.
  </p>
  <ComponentExample name="navbar/UserMenuBasic" center />

  <DocHeading id="links" :level="3">Links</DocHeading>
  <p>
    Like sidebar items, <code class="prose-code">AcNavbarItem</code> and user-menu rows render a <code class="prose-code">RouterLink</code> for
    <code class="prose-code">to</code> when vue-router is installed, a plain link otherwise, and a button when there's no link. An exact route match
    marks the item active.
  </p>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The bar is a <code class="prose-code">&lt;header&gt;</code>; the default slot sits in a <code class="prose-code">&lt;nav&gt;</code> named by <code class="prose-code">label</code>.</li>
    <li>The menu button and icon-only items are labelled; the count is part of the name, e.g. "Notifications (3)".</li>
    <li>
      The user menu follows the menu-button pattern: <code class="prose-code">aria-haspopup="menu"</code> and <code class="prose-code">aria-expanded</code>
      on the trigger; Enter, Space or ↓ opens on the first row and ↑ on the last; ↑ ↓ Home End move; Escape closes and returns focus; Tab closes and
      moves on.
    </li>
    <li>The theme switch inside the menu stays a radio group, reachable with the arrow keys.</li>
  </ul>

  <ApiTables component="AcNavbar" heading="Navbar API" />
  <ApiTables component="AcNavbarItem" heading="Navbar Item API" id-prefix="item-" />
  <ApiTables component="AcUserMenu" heading="User Menu API" id-prefix="user-menu-" />

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
