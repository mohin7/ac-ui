<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import DocHeading from "../../components/DocHeading.vue";

type Entry = { title: string; items: string[] };
const releases: { version: string; id: string; summary: string; groups: Entry[] }[] = [
  {
    version: "0.0.10",
    id: "v0-0-10",
    summary: "A header slot for table columns, a small pagination and tinted toasts.",
    groups: [
      {
        title: "New",
        items: [
          "`AcTable` `header-<key>` slot: put your own content in the header of a column, such as `#header-status=\"{ column }\"`. The sort arrow stays.",
          "`AcToaster` toasts are tinted by status (light green for success, red for error, yellow for warning, blue for info), like `AcAlert`, so they stand out from the page.",
          "`AcPagination` `size=\"small\"`: 28px page buttons for cards and dense tables.",
        ],
      },
    ],
  },
  {
    version: "0.0.9",
    id: "v0-0-9",
    summary: "One border colour for the lines between app regions.",
    groups: [
      {
        title: "Changed",
        items: [
          "`AcSideTabs` (with `sticky` and content beside the list): the list column's edge now runs to the bottom of the viewport when the content is short, instead of stopping where the content ends.",
          "`AcSidebar`, `AcSideTabs`, `AcStatusBar` and the `AcTabs` strip use `border-border-light`, like `AcNavbar` and `AcHeader`, so the lines between app regions are one colour. Frames of surfaces (cards, modals, inputs, tables) still use `border-border`. See the Colors page, \"Which border?\".",
        ],
      },
    ],
  },
  {
    version: "0.0.8",
    id: "v0-0-8",
    summary: "Select, tabs and table additions; success green passes AA.",
    groups: [
      {
        title: "New",
        items: [
          "`AcSelect` `by` prop: option values can be objects, matched by a property name or a function. Options of one `group` are always listed together.",
          "`AcTabs` tabs take `to` or `href` and become real links; the tab for the current route is active by itself. New `testid` on a tab, and `v-model` is optional.",
          "`AcTable` `row-active` and `row-disabled` mark the current row and grey out rows that can't be used.",
          "`AcTable` `manual-sort` and `v-model:sort-by`: sort the whole list outside the table, such as across pages or on the server.",
        ],
      },
      {
        title: "Changed",
        items: [
          "`--color-success` is darker (white text is 4.6:1, was 3.5:1), in both themes.",
          "`AcSideTabs` switches to its phone layout at a width that grows with the interface scale.",
        ],
      },
    ],
  },
  {
    version: "0.0.7",
    id: "v0-0-7",
    summary: "Interface scale, page layout and a darker default brand green.",
    groups: [
      {
        title: "New",
        items: [
          "`--ac-scale` and `useFontScale()`: text, line heights, spacing and radii scale together. `AcFontScale` is the switch, and `AcUserMenu` has `show-font-scale`.",
          "`AcPage`: the padded, evenly spaced area for a page's cards, tables and forms.",
          "`AcTable` `flat`: no frame of its own, for tables inside a card. `AcCard` and `AcSectionContent` clip a flush body to their corners.",
          "`AcButton` `icon-right` slot.",
        ],
      },
      {
        title: "Changed",
        items: [
          "The default brand green is `149 100% 26%` (was 30%) so white text passes AA, 4.8:1. In the dark theme the fill is lifted 4% so it looks as before.",
          "Sizes written as `text-[11px]`, popover widths and a few component defaults now follow the scale.",
        ],
      },
    ],
  },
  {
    version: "0.0.6",
    id: "v0-0-6",
    summary: "Components the apps were building themselves.",
    groups: [
      {
        title: "New",
        items: [
          "`AcHeader` `size=\"compact\"` for dense pages and forms.",
          "`AcSelect` `creatable`: add a value that isn't in the list.",
          "`AcTable` `expandable`: a detail area under each row.",
          "`AcSteps` `orientation=\"vertical\"` with sub-steps.",
          "`AcSidebar` `hover-expand`: the collapsed rail opens over the page on hover.",
          "`AcFileEditor` `downloadable`.",
        ],
      },
    ],
  },
  {
    version: "0.0.5",
    id: "v0-0-5",
    summary: "Feature cards.",
    groups: [
      {
        title: "New",
        items: ["`AcFeatureCard` `recommended`, `title-extra` and `actions`; `AcTable` rows carry `data-testid=\"ac-table-row\"`."],
      },
    ],
  },
];

// `code` spans in the strings above
function parts(text: string) {
  return text.split("`").map((t, i) => ({ t, code: i % 2 === 1 }));
}
</script>

<template>
  <p>What changed in each release. Newest first. Everything is backward compatible unless a line says <strong>Changed</strong>.</p>
  <Callout type="note">
    After updating, apps can delete the workarounds the new props replace: global CSS that flattened tables inside cards,
    hidden-span markers for selected and disabled table rows, and hand-written page padding.
  </Callout>

  <template v-for="r in releases" :key="r.version">
    <DocHeading :id="r.id">{{ r.version }}</DocHeading>
    <p>{{ r.summary }}</p>
    <template v-for="g in r.groups" :key="g.title">
      <DocHeading :id="`${r.id}-${g.title.toLowerCase()}`" :level="3">{{ g.title }}</DocHeading>
      <ul>
        <li v-for="item in g.items" :key="item">
          <template v-for="(p, i) in parts(item)" :key="i"
            ><code v-if="p.code" class="prose-code">{{ p.t }}</code
            ><template v-else>{{ p.t }}</template></template
          >
        </li>
      </ul>
    </template>
  </template>
</template>
