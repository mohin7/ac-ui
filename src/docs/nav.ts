import type { RouteComponent } from "vue-router";

export interface DocPage {
  path: string;
  title: string;
  description: string;
  section: string;
  group?: string;
  /** Component name in src/lib, for the API tables and the "Copy import" button. */
  component?: string;
  /** Source file shown in the page header. */
  source?: string;
  badge?: string;
  /** The page renders its own hero instead of the standard header. */
  hideHeader?: boolean;
  load: () => Promise<RouteComponent | { default: RouteComponent }>;
}

export const pages: DocPage[] = [
  // Getting started
  {
    path: "/getting-started/introduction",
    title: "Introduction",
    description: "The AppsCode design system: tokens, Tailwind theme and Vue 3 components for every AppsCode console.",
    section: "Getting Started",
    hideHeader: true,
    load: () => import("./pages/getting-started/IntroductionPage.vue"),
  },
  {
    path: "/getting-started/installation",
    title: "Installation",
    description: "Add the theme and components to a Vue 3 + Tailwind CSS v4 app.",
    section: "Getting Started",
    load: () => import("./pages/getting-started/InstallationPage.vue"),
  },
  {
    path: "/getting-started/theming",
    title: "Theming",
    description: "How tokens map to Tailwind utilities, and how to re-hue the brand at runtime.",
    section: "Getting Started",
    load: () => import("./pages/getting-started/ThemingPage.vue"),
  },
  {
    path: "/getting-started/migration",
    title: "Migration",
    description: "Moving from the Bulma-based @appscode/design-system to this Tailwind version.",
    section: "Getting Started",
    load: () => import("./pages/getting-started/MigrationPage.vue"),
  },

  // Foundations
  {
    path: "/foundations/colors",
    title: "Colors",
    description: "Brand, status and neutral scales, semantic tokens, and when to use each.",
    section: "Foundations",
    load: () => import("./pages/foundations/ColorsPage.vue"),
  },
  {
    path: "/foundations/typography",
    title: "Typography",
    description: "Geist and Geist Mono on a 13px base: headings, size scale and weights.",
    section: "Foundations",
    load: () => import("./pages/foundations/TypographyPage.vue"),
  },
  {
    path: "/foundations/spacing",
    title: "Spacing",
    description: "A 4px spacing unit with components stepping in 4s and 8s.",
    section: "Foundations",
    load: () => import("./pages/foundations/SpacingPage.vue"),
  },
  {
    path: "/foundations/radius-shadow",
    title: "Radius & Shadow",
    description: "6px controls on 10px surfaces, pills, and a soft five-step elevation scale.",
    section: "Foundations",
    load: () => import("./pages/foundations/RadiusShadowPage.vue"),
  },

  // Components
  {
    path: "/components/button",
    title: "Button",
    description: "Triggers an action or navigates. One filled primary button per view.",
    section: "Components",
    group: "Element",
    component: "AcButton",
    load: () => import("./pages/components/ButtonPage.vue"),
  },
  {
    path: "/components/badge",
    title: "Badge",
    description: "A compact label for status, tiers and versions.",
    section: "Components",
    group: "Element",
    component: "AcBadge",
    load: () => import("./pages/components/BadgePage.vue"),
  },
  {
    path: "/components/alert",
    title: "Alert",
    description: "An inline message that stays on screen until the situation changes.",
    section: "Components",
    group: "Element",
    component: "AcAlert",
    load: () => import("./pages/components/AlertPage.vue"),
  },
  {
    path: "/components/card",
    title: "Card",
    description: "The white, bordered surface that groups related content.",
    section: "Components",
    group: "Element",
    component: "AcCard",
    load: () => import("./pages/components/CardPage.vue"),
  },
  {
    path: "/components/input",
    title: "Input",
    description: "A text field with a floating label, hint and error message.",
    section: "Components",
    group: "Form",
    component: "AcInput",
    load: () => import("./pages/components/InputPage.vue"),
  },
  {
    path: "/components/select",
    title: "Select",
    description: "Pick one or more values from a list, with search, groups and async options.",
    section: "Components",
    group: "Form",
    component: "AcSelect",
    load: () => import("./pages/components/SelectPage.vue"),
  },
  {
    path: "/components/checkbox",
    title: "CheckBox",
    description: "A group of independent on/off choices.",
    section: "Components",
    group: "Form",
    component: "AcCheckBox",
    load: () => import("./pages/components/CheckBoxPage.vue"),
  },
  {
    path: "/components/check-radio",
    title: "CheckRadio",
    description: "Pick exactly one option from a small, visible set.",
    section: "Components",
    group: "Form",
    component: "AcCheckRadio",
    load: () => import("./pages/components/CheckRadioPage.vue"),
  },
  {
    path: "/components/switch",
    title: "Switch",
    description: "Toggles a single setting that takes effect immediately.",
    section: "Components",
    group: "Form",
    component: "AcSwitch",
    load: () => import("./pages/components/SwitchPage.vue"),
  },
  {
    path: "/components/search-bar",
    title: "Search Bar",
    description: "A debounced search field for filtering lists.",
    section: "Components",
    group: "Form",
    component: "AcSearchBar",
    load: () => import("./pages/components/SearchBarPage.vue"),
  },
  {
    path: "/components/modal",
    title: "Modal",
    description: "A focused dialog for short tasks that need an answer.",
    section: "Components",
    group: "Overlay",
    component: "AcModal",
    load: () => import("./pages/components/ModalPage.vue"),
  },
  {
    path: "/components/delete-modal",
    title: "Delete Modal",
    description: "Confirms a destructive action, optionally by typing the name.",
    section: "Components",
    group: "Overlay",
    component: "AcDeleteModal",
    load: () => import("./pages/components/DeleteModalPage.vue"),
  },
  {
    path: "/components/header",
    title: "Header",
    description: "The page title bar with back button, breadcrumb and actions.",
    section: "Components",
    group: "Layout",
    component: "AcHeader",
    load: () => import("./pages/components/HeaderPage.vue"),
  },
  {
    path: "/components/content-table",
    title: "Content Table",
    description: "A card that frames a list with title, search, filters and actions.",
    section: "Components",
    group: "Layout",
    component: "AcContentTable",
    load: () => import("./pages/components/ContentTablePage.vue"),
  },
  {
    path: "/components/section",
    title: "Section Content",
    description: "Groups part of a page under a heading, optionally collapsible.",
    section: "Components",
    group: "Layout",
    component: "AcSectionContent",
    load: () => import("./pages/components/SectionPage.vue"),
  },
  {
    path: "/components/tabs",
    title: "Tabs",
    description: "Switches between sibling views of the same resource.",
    section: "Components",
    group: "Navigation",
    component: "AcTabs",
    load: () => import("./pages/components/TabsPage.vue"),
  },
  {
    path: "/components/steps",
    title: "Steps",
    description: "Shows progress through a multi-step flow.",
    section: "Components",
    group: "Navigation",
    component: "AcSteps",
    load: () => import("./pages/components/StepsPage.vue"),
  },
  {
    path: "/components/table",
    title: "Table",
    description: "Lists resources with sorting, loading and empty states.",
    section: "Components",
    group: "Data",
    component: "AcTable",
    load: () => import("./pages/components/TablePage.vue"),
  },

  // Examples
  {
    path: "/examples/databases",
    title: "Databases page",
    description: "A full console page built only from design-system components: stats, filter tabs, table and a create wizard.",
    section: "Examples",
    badge: "Demo",
    load: () => import("./pages/examples/DatabasesPage.vue"),
  },
];

for (const p of pages) if (p.component) p.source = `src/lib/components/${p.component}.vue`;

export const sections = [...new Set(pages.map((p) => p.section))];
