<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";

const rows = [
  ["AcButton", 'modifier-classes="is-primary is-light"', 'variant="light"'],
  ["AcButton", 'modifier-classes="is-danger is-small"', 'color="danger" size="small"'],
  ["AcButton", 'is-loader-active', 'loading'],
  ["AcButton", 'icon-class="plus"', '#icon slot with a Lucide icon'],
  ["AcBadge", 'modifier-classes="is-success is-light is-rounded"', 'color="success" variant="light" rounded'],
  ["AcAlert", 'modifier-classes="is-warning"', 'color="warning"'],
  ["AcInput", 'placeholder-text="Role Name"', 'label="Role Name"'],
  ["AcInput", 'show-star / is-disabled / is-read-only', 'required / disabled / readonly'],
  ["AcCheckRadio", 'has-description / is-row', 'cards / row'],
  ["AcTabs", '<AcTabItem :is-active> children', ':items + v-model'],
  ["AcTable", 'table-headers + AcTableRow / AcTableCell', ':columns + :rows + #cell-<key> slots'],
  ["AcSelect", 'show-by / track-by (vue-multiselect)', ':options="[{ value, label }]"'],
  ["AcSelect", 'is-multi-select / allow-empty', 'multiple / clearable'],
  ["AcSelect", 'group-label + group-values', 'group on each option'],
  ["AcSelect", 'has-refresh-btn / is-loader-active / @refresh-btn-click', 'refreshable / loading / @refresh'],
  ["AcModal", ':open + @closemodal', 'v-model:open + @close'],
  ["AcModal", 'is-close-option-disabled / ignore-outside-click', ':closable="false" / :close-on-outside-click="false"'],
  ["AcModal", 'modifier-classes="is-small|is-normal|is-large"', 'size="small|normal|large"'],
  ["AcModal", '#modal-footer-controls / #modal-header-controls', '#footer / #header-actions'],
  ["AcDeleteConfirmationModal", 'is-delete-active / @delete-confirmation-modal$confirm', 'loading / @confirm'],
  ["AcHeader", 'top-value="87px" / #header-left-controls', 'sticky top="87px" / #title-extra'],
  ["AcContentTable", 'table-title / table-sub-title / #content="{ searchText }"', 'title / subtitle / #default="{ searchText }"'],
  ["AcContentTable", '#content-left-controls / #content-right-controls', '#left-controls / #right-controls'],
  ["AcContentHeader", 'header-title / header-sub-title / remove-border-bottom', 'title / subtitle / :bordered="false"'],
  ["AcSectionContent", 'is-expandable / has-back-button / #header-buttons', 'collapsible / back-button / #actions'],
  ["AcAvatar", 'size="24x24|32x32|48x48" / :rounded="false"', 'size="small|normal|large" / shape="square"'],
  ["AcAvatar", 'is-initial / dots / dot-bg-color', 'name="Jane Doe" (initials + colour) / status="online|offline|away|busy"'],
  ["AcTag", '<tag class="is-success"> / modifier-classes="is-rounded"', 'color="success" / rounded'],
  ["AcTag", '<TagAddons key-label value-label>', '<AcTag key-label value-label>'],
  ["AcDivider", '<Divider label /> / horizontal', 'label="OR" / orientation="vertical"'],
  ["AcSkeleton", '<Skeletons><Skeleton /><Skeleton width="80%" /></Skeletons>', ':lines="2"'],
  ["AcSkeleton", 'ResourceLoader / InfoCardLoader', 'shape="table" :rows :cols / shape="info-card"'],
  ["AcPreloader", '<preloader message> (fixed calc(100vh - 200px) height)', '<AcPreloader message min-height="calc(100vh - 200px)"> or full-page'],
  ["AcButtons", '<Buttons class="has-addons"> / is-justify-content-end', 'attached label="…" / align="end"'],
  ["AcSegmentedControl", 'v-model:options="[…]"', ':options="[…]" (strings or { value, label, icon })'],
  ["AcDropdown", '<DropdownMenu v-model:is-active> + #dropdown-trigger', 'v-model:open (optional) + #trigger'],
  ["AcDropdown", 'class="is-right" / is-up', 'align="end" / placement="top"'],
  ["AcDropdownItem", '<DropdownItem><ul><li><a>Edit</a>', '<AcDropdownItem label="Edit" :icon="Pencil" @click>'],
  ["AcDropdown", '<Options> (option dots)', '<AcDropdown align="end" menu-label="Actions for NAME"> (default ⋮ trigger)'],
  ["AcTooltip", 'AcButton tooltip="Copy"', '<AcTooltip content="Copy"><AcButton aria-label="Copy" /></AcTooltip>'],
  ["useToast", 'vue-toastification: toast.success(msg, { timeout })', '<AcToaster /> once + useToast().success(title, { description, duration })'],
  ["AcSidePanel", '<SidePanelModal v-model> / #footer-button', 'v-model:open / #footer'],
  ["AcSidePanel", 'disable-modal-close / ignore-outside-click / hide-action-footer', ':closable="false" / :close-on-outside-click="false" / hide-footer'],
  ["AcTextarea", 'placeholder-text / show-star / :row-count', 'label / required / :rows (+ auto-resize, maxlength)'],
  ["AcFileUpload", '<FileUpload /> / <FileUploadSmall /> (markup only)', 'v-model="files" accept :max-size / small'],
  ["AcForm", '#form-left-controls / #form-right-controls + FormFooterControl', '#footer with <AcFormFooter submit-label @cancel>'],
  ["AcFormFooter", '<form-footer> + AcButton :is-loader-active', '<AcFormFooter submit-label :loading @save>'],
  ["AcAccordionItem", '<Accordion :is-active @on-click> + #title / #body', '<AcAccordionItem v-model:open title>…'],
  ["AcPagination", ':total-no-of-items / :items-per-page / @pagination:pagechange', ':total / v-model:page-size / @range'],
  ["AcPagination", 'hide-rows-per-page-selection', 'hide-page-size'],
  ["AcInfoTable", ':table-headers + #slot-0…', ':items="[{ key, label, value }]" + #value-<key>'],
  ["AcInfoTable", '<multi-info-table> / <DetailCard :fields>', ':columns="2" / title layout="stacked"'],
  ["AcCodeEditor", '<Editor v-model :original-value :editor-height="40" :read-only>', 'v-model :original height="40vh" readonly, from @appscode/design-system/editor'],
  ["AcCodeEditor", '<LightweightEditor :schema @validation-error> / <MonacoEditor :diff-editor>', ':schema @validate / readonly :original diff-layout="split"'],
  ["AcCodeEditor", '<JsonShowModal :editor-content>', '<AcModal> + <AcCodeEditor language="json" readonly>'],
  ["AcSkeleton", '<EditorLoader />', 'shape="editor"'],
  ["AcEmptyState", '<Banner> error block / <EmptyTableInfo />', 'variant="error" title description / size="small"'],
  ["AcBanner", 'Banner as an announcement', 'color title action-label action-href dismissible'],
  ["AcSidebar", '<Sidebar> + #sidebar-header / #sidebar-body / #sidebar-footer', '<AcSidebar dark> + #header / default / #footer'],
  ["AcSidebar", 'sidebar-light / .sidebar-collapsed', 'default is light / v-model:collapsed'],
  ["AcSidebarItem", ':title :url :is-active :icon="img"', ':label :to :active :icon="LucideIcon"'],
  ["AcSidebarItem", 'SidebarItemWithDropDown + children', 'nested AcSidebarItem in the default slot + v-model:open'],
  ["AcNavbar", 'modifier-classes="is-light" + #navbar-brand-logo', '#brand'],
  ["AcNavbarItem", '<NavbarItem> + icon svg / <Notification :unread-notification>', ':icon="Bell" icon-only :badge="n"'],
  ["AcUserMenu", '<User :user :accounts-domain @on-logout show-theme-mode>', ':name :email :avatar-url :logout-url @logout show-theme-mode'],
  ["AcThemeMode", 'ThemeMode @set:theme', 'same event; also useColorMode()'],
  ["AcFileEditor", "<FilteredFileEditor> / <ResourceKeyValueEditor :preview-yamls> / ui-modules <PreviewYamlEditor>", "<AcFileEditor v-model:files> (from @appscode/design-system/editor)"],
  ["AcFileEditor", "cluster-ui / kubedb-ui <MultiFileEditor :files :schemas>", "<AcFileEditor v-model:files format-switch>, schema on each file"],
  ["AcFileEditor", "PreviewYamlType { uid, name, content, initContent, type, isSecret }", "{ name, content, original, language, secret }"],
  ["AcFileEditor", ":show-hide-btn + atob()/btoa()", "secret: true + encoding: \"base64\" on the file"],
  ["AcFileEditor", "@active-key / :is-preview-loading / :is-editor-read-only", "v-model:active / loading / readonly"],
  ["AcCellValue", "<generic-cell :cell-descriptor=\"col\" :cell-value=\"cell\" />", "<AcCellValue :column=\"col\" :cell=\"cell\" :resolve-link=\"fillRouteParams\" />"],
  ["AcCellValue", "<cell-value :value :cell-title :tooltip :is-loader-active> / <object-cell> / <array-cell>", "<AcCellValue :value :title :tooltip loading> (objects and arrays detected)"],
  ["AcCellValue", "<value-with-modal> / <json-show-modal>", "built-in { } button opens the JSON in a read-only editor"],
  ["AcTable", "<table-cell> / <fake-table-cell> with server table descriptors", "columns[].type or columns[].descriptor render cells with AcCellValue"],
  ["AcCellValue", "types/table AcTableCol / AcTableCell / AcTableRow", "ResourceColumn / ResourceCell / ResourceRow (old names kept as aliases)"],
  ["AcModal", "<status-modal :status-array v-model:is-modal-open>", "<AcModal v-model:open> + one <AcAlert :color=\"s.type\"> per status"],
  ["AcFormArray", "<single-step-form-array v-model :table-headers :label :form-label :button-label>", "<AcFormArray v-model :columns label form-title add-label>"],
  ["AcFormArray", "#create-form + #edit-form, save-new-item / save-edited-item / on-delete-item", "#form=\"{ item, errors, isNew }\", validate, before-save, before-remove"],
  ["AcFormArray", "is-required / is-collapsible / initially-hidden / is-button-loader-active", "required / collapsible / default-collapsed / loading"],
  ["AcSlider", "<UsageThreshold v-model title subtitle :min-range :max-range />", "<AcSlider v-model label description :min :max />"],
  ["AcSlider", "form-builder threshold-input (% bubble + number box)", "<AcSlider v-model unit=\"%\" :marks=\"[0, 50, 100]\" show-input />"],
  ["AcDatePicker", "<AcInput input-type=\"date\" :min-date placeholder-text>", "<AcDatePicker v-model label :min-date /> (value \"YYYY-MM-DD\")"],
  ["AcDatePicker", "<AcInput input-type=\"datetime-local\"> + convertToUTC", "<AcDatePicker v-model mode=\"datetime\" time-zone=\"UTC\" /> (value is UTC ISO)"],
  ["AcDatePicker", "form-builder time-picker / AcDuration / AcDurationNew (\"26h30m\")", "<AcDatePicker v-model mode=\"duration\" :presets />"],
  ["AcInput", "<AcSingleInput> + #label + <input class=\"ac-input\"> + #error", "<AcInput v-model label=\"\u2026\" :error-msg=\"\u2026\" required />"],
  ["AcInput", "AcSingleInput #button (Copy / Generate)", "<AcInput addon-label=\"Copy\" :addon-icon=\"Copy\" addon-icon-only @addon=\"copy\" />"],
  ["AcInput", "AcSingleInput :has-modifier-btn (\u00b1 counter)", "type=\"number\" v-model.number, unit in #suffix"],
  ["AcAlert", "<AlertBox notification-type=\"error\" :content=\"html\" />", "<AcAlert color=\"danger\"> with sanitized HTML in the default slot"],
  ["AcAlert", "AlertBox :hide-icon / :action-button=\"{ show, title, iconClass, action }\"", "hide-icon / action-label :action-icon @action"],
  ["AcAlert", "<AlertMessage modifier-classes=\"is-warning\" :has-cross-icon>", "<AcAlert v-if=\"show\" color=\"warning\" dismissible @close=\"show = false\">"],
  ["AcAlert", "AlertMessage #buttons / #custom-switch", "#actions slot"],
  ["AcSearchBar", "<FilterableSearchBar @handle-search>", "<AcSearchBar :debounce=\"0\" @search>"],
  ["AcSearchBar", "FilterableSearchBar :is-filter :filter-options=\"[{ value, text }]\" @handle-filter", ":filter-options=\"[{ value, label }]\" v-model:filter"],
  ["useBrandColor", "import { HexToHSL, setThemeHSL, getThemeHSL } from \"@appscode/design-system/plugins/theme\"", "same names from \"@appscode/design-system\"; or useBrandColor({ persist: true }).setColor(hex)"],
  ["AcEmptyState", "<Message message=\"\u2026\"> + #thumbnail", "<AcEmptyState :title=\"message\" size=\"small\"> + #icon"],
  ["AcSideTabs", "<SidebarTabsLayout> + #sidebar-tabs <SidebarTabs> + #tabs-content", "<AcSideTabs :items=\"[{ key, label, icon?, to }]\"><RouterView /></AcSideTabs>"],
  ["AcSideTabs", "router-link :class=\"{ 'is-active' }\" / li.is-open + nested ul / is-disabled / is-danger", "items with to (active follows the route), children, disabled, tone=\"danger\""],
  ["AcSideTabs", ":is-sidebar-visible=\"false\" / :offset-selectors", "hide-tabs / top=\"56px\" or :offset-selectors"],
  ["AcStatusBar", "<FooterArea> #footer-left / #footer-right + FooterItems / FooterItem", "<AcStatusBar :items> (align: \"right\") + #left / #right"],
  ["AcStatusBar", "<Info :info-data> / <Status :status-info> / <Usage :usages>", "items: { label, value, mono } / { label, status } / { label, icon, value, meter }"],
  ["AcAppSwitcher", "<Appdrawer current-app=\"db\" :base-url :root-domain :active-organization :active-org-type :is-offline-installer />", "<AcAppSwitcher> with the same props; the current app is marked (hide-current for the old behaviour)"],
  ["AcClusterSwitcher", "<ClusterSwitcher v-model :cluster-options :sidebar-collapsed :mouse-hover />", "<AcClusterSwitcher v-model :cluster-options /> (follows the sidebar rail; mouse-hover dropped)"],
  ["AcClusterSwitcher", "<ClusterSwitcherLoader v-if=\"pending\" /> + <ClusterSwitcher v-else>", "<AcClusterSwitcher :loading=\"pending\">"],
  ["AcNotificationMenu", "<Notification :notifications :unread-notification @is-active>", "<AcNotificationMenu :notifications :unread-count v-model:open />"],
  ["AcStatCard", "<StatCard label value suffix :progress> / <Counter>", "<AcStatCard label value suffix :progress> / <AcStatCard :icon :to>"],
  ["AcStatCard", "<SummaryCard title tag :items> / <OverviewCards> + <OverviewCard>", "<AcCard :title> + grid of <AcStatCard size=\"small\" :status> / <AcStatCard inline>"],
  ["AcResourceCard", "<Cluster :cluster-data=\"{ name, providerIcon, tags, details }\" :show-options>", "<AcResourceCard :name :logo :status :tags :details> + #menu"],
  ["AcResourceCard", "<DetailCard :fields> / <InfoCard :row-data> / <SessionCard>", "<AcResourceCard :name :details :columns> (+ #detail-<key>, #actions)"],
  ["AcFeatureCard", "<FeatureCard :is-required> + #card-logo #card-title #card-sub-title", "<AcFeatureCard :required :logo :title :description :status>"],
  ["AcFeatureCard", "<CheckItemCard v-model:checked> / <Vendor title logo>", "<AcFeatureCard selectable v-model:checked> / <AcFeatureCard centered>"],
  ["AcCheckRadio", "<RadioCard v-model value label description>", "<AcCheckRadio cards v-model :options>"],
  ["AcUsageCard", "<UsageCard :usages> / <UsageTableCard :thead :tbody :is-loader-active>", "<AcUsageCard :breakdown> / <AcUsageCard :breakdown-headers :breakdown :loading>"],
  ["AcCard", "<TableCard title :columns :rows> / <OrgCard no-cluster-available>", "<AcCard :padded=\"false\"> + <AcTable> / <AcEmptyState title=\"No cluster available\">"],
];

const before = `<AcButton
  title="Delete"
  modifier-classes="is-danger is-light is-small"
  :is-loader-active="deleting"
  @click="remove"
/>`;
const after = `<AcButton
  title="Delete"
  color="danger"
  variant="light"
  size="small"
  :loading="deleting"
  @click="remove"
/>`;
const utils = `<!-- before (Bulma + AppsCode utilities) -->
<div class="is-flex is-align-items-center gap-8 p-16 b-1 is-rounded-4">

<!-- after (Tailwind + AppsCode theme) -->
<div class="flex items-center gap-2 p-4 border border-border rounded-10">`;
</script>

<template>
  <DocHeading id="overview">Overview</DocHeading>
  <p>
    Component names stay the same (<code class="prose-code">AcButton</code>, <code class="prose-code">AcInput</code>…).
    What changes is how variants are passed: typed props instead of Bulma class strings.
  </p>
  <div class="my-4 grid gap-4 md:grid-cols-2">
    <CodeBlock :code="before" filename="Before — @appscode/design-system" />
    <CodeBlock :code="after" filename="After — Tailwind" />
  </div>

  <DocHeading id="props">Prop changes</DocHeading>
  <div class="my-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr>
          <th class="h-9 px-4 font-medium">Component</th>
          <th class="h-9 px-4 font-medium">Before</th>
          <th class="h-9 px-4 font-medium">After</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i" class="border-t border-border-light">
          <td class="h-9 px-4 font-medium text-heading">{{ r[0] }}</td>
          <td class="px-4 py-2"><code class="font-mono text-[13px] text-red-30">{{ r[1] }}</code></td>
          <td class="px-4 py-2"><code class="font-mono text-[13px] text-green-20">{{ r[2] }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="utilities">Utility classes</DocHeading>
  <p>
    Pixel utilities become 4px units: <code class="prose-code">.p-16</code> → <code class="prose-code">p-4</code>,
    <code class="prose-code">.mt-24</code> → <code class="prose-code">mt-6</code>. Bulma helpers become Tailwind's.
  </p>
  <CodeBlock :code="utils" lang="html" />

  <DocHeading id="other">Other changes</DocHeading>
  <ul>
    <li>No Bulma or Font Awesome CSS is loaded. Icons come from <code class="prose-code">lucide-vue-next</code>; the old icon components map to Lucide on the <RouterLink to="/foundations/icons">Icons</RouterLink> page.</li>
    <li>Focus is visible: a 2px primary outline on keyboard focus (the old CSS removed button outlines).</li>
    <li>Fonts change from Roboto + Inconsolata to Geist + Geist Mono.</li>
    <li>Controls use a 6px radius and surfaces 10px (was 4px everywhere); <code class="prose-code">rounded-4</code> still exists.</li>
    <li>Shadows are softer and slate-tinted; <code class="prose-code">shadow-sm</code>/<code class="prose-code">lg</code>/<code class="prose-code">xl</code> keep their names.</li>
    <li>Dark mode works everywhere. It still uses the old <code class="prose-code">.is-dark-theme</code> class and <code class="prose-code">themeMode</code> storage key — see <RouterLink to="/getting-started/dark-mode">Dark Mode</RouterLink>.</li>
    <li>Toasts no longer need vue-toastification: mount <code class="prose-code">&lt;AcToaster /&gt;</code> once and call <code class="prose-code">useToast()</code>.</li>
  </ul>
  <Callout type="note">
    Every component the apps import is now ported, including the code and file editors, the cards, the app menus and the table cell
    renderers. Still in the old <code class="prose-code">@appscode/design-system</code> 2.x only: specialised widgets no app imports today
    (MachineProfile, ScalingRules, NodeSelection, Inbox, ConfigSecret) and the recovery timeline charts on the
    <code class="prose-code">recovery-workflows-ui</code> branch. <RouterLink to="/components/code-editor#migration">Code Editor</RouterLink> lists every
    old editor prop.
  </Callout>
</template>
