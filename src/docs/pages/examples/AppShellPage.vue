<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DocHeading from "../../components/DocHeading.vue";

const app = `<script setup lang="ts">
import { ref } from "vue";
import { AcNavbar, AcSidebar } from "@/lib";

const sidebar = ref<InstanceType<typeof AcSidebar> | null>(null);
const collapsed = ref(false);
const menuOpen = ref(false);
<\/script>

<template>
  <div class="flex min-h-dvh">
    <AcSidebar ref="sidebar" v-model:collapsed="collapsed" v-model:mobile-open="menuOpen" dark>
      <!-- header, sections, items, footer -->
    </AcSidebar>
    <div class="flex min-w-0 flex-1 flex-col">
      <AcNavbar @menu="menuOpen = true"><!-- search, actions --></AcNavbar>
      <main class="flex-1 bg-surface-muted">
        <RouterView />
      </main>
    </div>
  </div>
</template>`;
</script>

<template>
  <p>
    The frame around every console page: a sidebar with the app's sections, a navbar with search and the account menu, and the page itself with an
    <RouterLink to="/components/header">AcHeader</RouterLink>. Click around the sidebar, collapse it, switch it to the light style, and try the phone
    width to see the drawer.
  </p>

  <DocHeading id="preview">Preview and code</DocHeading>
  <ComponentExample name="pages/AppShellExample" :padded="false" />
  <Callout type="note">
    The preview is a 640px box, not the whole window, so the sidebar uses <code class="prose-code">contained</code>: the drawer and backdrop are
    <code class="prose-code">absolute</code> inside the box (which is <code class="prose-code">relative overflow-hidden</code>), and the phone layout follows the
    box's width. In an app, drop <code class="prose-code">contained</code>; the sidebar then sticks to the viewport and the drawer is fixed to the window.
  </Callout>

  <DocHeading id="in-an-app">In an app</DocHeading>
  <p>
    The same shell at full size. The sidebar is <code class="prose-code">sticky</code> and full height; the navbar sticks to the top as the page scrolls.
    If your navbar spans the full width above the sidebar, pass <code class="prose-code">top="56px"</code> to the sidebar.
  </p>
  <CodeBlock :code="app" lang="vue" filename="App.vue" />

  <DocHeading id="uses">Components used</DocHeading>
  <ul>
    <li><RouterLink to="/components/sidebar">Sidebar</RouterLink> with sections, a nested Databases group, badges and a footer link</li>
    <li><RouterLink to="/components/navbar">Navbar</RouterLink> with <RouterLink to="/components/search-bar">SearchBar</RouterLink>, icon actions and the user menu with the theme switch</li>
    <li><RouterLink to="/components/header">Header</RouterLink>, <RouterLink to="/components/card">Card</RouterLink>, <RouterLink to="/components/table">Table</RouterLink> and <RouterLink to="/components/badge">Badge</RouterLink> for the page</li>
  </ul>
</template>
