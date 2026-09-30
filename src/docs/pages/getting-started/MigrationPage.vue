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
    Every commonly used component is ported (57, counting sub-parts, plus the code editor). Domain cards (StatCard, UsageCard, DbCard…),
    the multi-file editors (FilteredFileEditor, ResourceKeyValueEditor) and specialised widgets such as MachineProfile and ScalingRules are not:
    keep importing those from the old <code class="prose-code">@appscode/design-system</code> 2.x until they're needed.
    <RouterLink to="/components/code-editor#migration">Code Editor</RouterLink> lists every old editor prop.
  </Callout>
</template>
