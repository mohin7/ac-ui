<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Ban,
  Bell,
  BellOff,
  Box,
  Boxes,
  Building2,
  Cable,
  CalendarClock,
  ChartColumn,
  ChartLine,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  CircleDot,
  CirclePause,
  CircleQuestionMark,
  CircleX,
  Clock,
  Cloud,
  CloudUpload,
  Code,
  Container,
  Copy,
  Cpu,
  CreditCard,
  Database,
  DatabaseBackup,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode,
  Funnel,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  History,
  House,
  Info,
  Key,
  KeyRound,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Link,
  LoaderCircle,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MemoryStick,
  Menu,
  Monitor,
  Moon,
  Network,
  Pause,
  Pencil,
  Play,
  Plus,
  Power,
  Receipt,
  RefreshCw,
  RotateCcw,
  Router,
  Save,
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Square,
  Star,
  Sun,
  Terminal,
  Trash2,
  TriangleAlert,
  Undo2,
  Upload,
  User,
  UserPlus,
  Users,
  Wallet,
  X,
} from "@lucide/vue";
import { AcButton } from "@/lib";
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";
import DoDont from "../../components/DoDont.vue";
import { useCopy } from "../../composables/useCopy";
import usage from "../../snippets/icons/usage.txt?raw";
import asProp from "../../snippets/icons/as-prop.txt?raw";
import fallback from "../../snippets/icons/fallback.txt?raw";

const groups = [
  { name: "Actions", icons: { Plus, Pencil, Trash2, Copy, Download, Upload, RefreshCw, RotateCcw, Save, Search, Funnel, Settings, ExternalLink, Link, Share2, Play, Pause, Square, Power, LogIn, LogOut, Undo2, Eye, EyeOff, Ellipsis, EllipsisVertical, X, Check } },
  { name: "Navigation", icons: { ArrowLeft, ArrowRight, ArrowDown, ChevronDown, ChevronRight, ChevronsUpDown, Menu, House, LayoutGrid, LayoutDashboard, Map } },
  { name: "Infrastructure", icons: { Server, Database, DatabaseBackup, HardDrive, Cpu, MemoryStick, Network, Cloud, CloudUpload, Container, Boxes, Box, Layers, Globe, Router, Cable, Gauge, Activity, ChartLine, ChartColumn, Terminal, Code, FileCode, GitBranch, Archive } },
  { name: "Security & time", icons: { Key, KeyRound, Lock, Shield, ShieldCheck, Clock, History, CalendarClock } },
  { name: "Status", icons: { CircleCheck, CircleAlert, CircleX, TriangleAlert, Info, CircleQuestionMark, LoaderCircle, Bell, BellOff, Ban, CircleDot, CirclePause } },
  { name: "People & billing", icons: { User, Users, UserPlus, Building2, CreditCard, Receipt, Wallet, CircleDollarSign, Mail, Star, Monitor, Sun, Moon } },
];

const oldIcons = [
  ["ArrowDownLongIcon", "ArrowDown"],
  ["ArrowIcon", "ChevronDown"],
  ["ArrowRightIcon", "ArrowRight"],
  ["ArrowUturnLeft", "Undo2"],
  ["BellIcon", "Bell"],
  ["BillableInfo", "SquareArrowOutUpRight"],
  ["BuildingIcon", "Building2"],
  ["CheckIcon", "Check"],
  ["ClockIcon", "Clock"],
  ["CloseIcon / CrossIcon", "X"],
  ["ClusterIcon", "Server"],
  ["CogIcon", "Settings"],
  ["CpuIcon / MachineCpuIcon", "Cpu"],
  ["Ellipsis", "Ellipsis"],
  ["EllipsisVertical", "EllipsisVertical"],
  ["FinanceIcon", "CircleDollarSign"],
  ["GridIcon", "LayoutGrid"],
  ["HomeIcon", "House"],
  ["InfoIcon / InfoLightIcon", "Info"],
  ["LinkIcon", "Link"],
  ["MailIcon", "Mail"],
  ["MapIcon", "Map"],
  ["MemoryIcon / MachineMemoryIcon", "MemoryStick"],
  ["MonitorIcon", "Monitor"],
  ["NodeIcon", "Network"],
  ["PlusIcon", "Plus"],
  ["RefreshIcon", "RefreshCw"],
  ["SearchIcon", "Search"],
  ["StarIcon", "Star"],
  ["StorageIcon / StorageIcon-2", "HardDrive"],
  ["TrashIcon", "Trash2"],
  ["UploadIcon", "Upload"],
] as const;

const sizes = [
  { cls: "size-3", px: 12, use: "Inside badges, tags and chip remove buttons" },
  { cls: "size-3.5", px: 14, use: "Small buttons, inputs, table headers, menu items" },
  { cls: "size-4", px: 16, use: "The default: buttons, sidebar items, alerts" },
  { cls: "size-5", px: 20, use: "Section headers, modal icons, navbar actions" },
  { cls: "size-8", px: 32, use: "Empty states and hero tiles (use stroke-width 1.5)" },
];

const install = "npm install @lucide/vue";

const dos = ["Use size-4 next to 13px text and let the icon inherit the text colour.", "Give every icon-only button an aria-label."];
const donts = ["Don't mix icon sets for the same concept on one screen.", "Don't draw new SVGs in components — pick a Lucide icon, or add a Phosphor one if Lucide has nothing."];

const query = ref("");
const { copied, copy } = useCopy(1200);
const lastCopied = ref("");

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return groups
    .map((g) => ({ name: g.name, icons: Object.entries(g.icons).filter(([n]) => !q || n.toLowerCase().includes(q)) }))
    .filter((g) => g.icons.length);
});

function copyImport(name: string) {
  lastCopied.value = name;
  copy(`import { ${name} } from "@lucide/vue";`);
}
</script>

<template>
  <DocHeading id="sets">Which icon set</DocHeading>
  <p>
    Every AppsCode UI uses the same three sets, in this order. The design-system components use Lucide too, so
    icons you add look like the ones already on the page.
  </p>
  <ol>
    <li><strong>Lucide</strong> (<code class="prose-code">@lucide/vue</code>) — reach for it first. Clean 24px outline icons, 1,600+ of them.</li>
    <li><strong>Phosphor</strong> via unplugin-icons — only when Lucide has nothing close.</li>
    <li><strong>simple-icons</strong> via unplugin-icons — brand and company logos (GitHub, AWS, Postgres…).</li>
  </ol>
  <p>Don't add a fourth set. The old library's 37 hand-drawn icon components map to Lucide below.</p>

  <DocHeading id="install">Install and use</DocHeading>
  <CodeBlock :code="install" lang="bash" />
  <CodeBlock :code="usage" lang="vue" class="mt-3" />
  <p class="mt-4">Components that display an icon take the icon component as a prop:</p>
  <CodeBlock :code="asProp" lang="vue" />
  <Callout type="note">
    Icons import one by one, so only the icons you use end up in the bundle. Don't
    <code class="prose-code">import * as icons</code>.
  </Callout>

  <DocHeading id="sizes">Size and stroke</DocHeading>
  <p>
    Size icons with Tailwind's <code class="prose-code">size-*</code> class. They take their colour from the text
    (<code class="prose-code">currentColor</code>), so <code class="prose-code">text-muted</code> or
    <code class="prose-code">text-primary</code> on the icon or its parent is all you need. Keep the default stroke width
    of 2 up to 20px and drop to <code class="prose-code">:stroke-width="1.5"</code> for large icons.
  </p>
  <div class="my-5 overflow-hidden rounded-10 border border-border bg-surface shadow-xs">
    <div v-for="s in sizes" :key="s.cls" class="flex items-center gap-4 border-t border-border-light px-4 py-3 first:border-0">
      <span class="flex w-10 justify-center text-heading"><Database :class="s.cls" :stroke-width="s.px >= 32 ? 1.5 : 2" aria-hidden="true" /></span>
      <code class="prose-code">{{ s.cls }}</code>
      <span class="w-10 font-mono text-xs text-muted">{{ s.px }}px</span>
      <span class="text-base text-body">{{ s.use }}</span>
    </div>
  </div>

  <DocHeading id="gallery">Common icons</DocHeading>
  <p>
    The icons AppsCode consoles use most. Click one to copy its import. For everything else, search
    <a href="https://lucide.dev/icons" target="_blank" rel="noopener">lucide.dev/icons</a>.
  </p>
  <div class="relative my-4 max-w-80">
    <Search class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
    <input
      v-model="query"
      type="search"
      placeholder="Filter icons"
      aria-label="Filter icons"
      class="h-8 w-full rounded-6 border border-border bg-surface pr-3 pl-8 text-base text-heading shadow-xs placeholder:text-muted focus:focus-ring"
    />
  </div>
  <div v-for="g in filtered" :key="g.name" class="mb-6">
    <h3 class="mb-2 text-xs font-medium tracking-wide text-muted uppercase">{{ g.name }}</h3>
    <div class="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
      <button
        v-for="[name, icon] in g.icons"
        :key="name"
        type="button"
        class="group flex cursor-pointer flex-col items-center gap-2 rounded-10 border border-border-light bg-surface px-2 py-3.5 text-body transition hover:border-primary-80 hover:bg-primary-97 hover:text-primary-20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        :title="`Copy import for ${name}`"
        @click="copyImport(name)"
      >
        <component :is="icon" class="size-5" aria-hidden="true" />
        <span class="w-full truncate text-center font-mono text-[11px] text-muted group-hover:text-primary-20">
          {{ copied && lastCopied === name ? "Copied!" : name }}
        </span>
      </button>
    </div>
  </div>
  <p v-if="!filtered.length" class="text-muted">No common icon matches “{{ query }}”. Try lucide.dev.</p>

  <DocHeading id="fallback">Phosphor and brand logos</DocHeading>
  <p>When Lucide has nothing close, use Phosphor; for logos use simple-icons. Both come through unplugin-icons:</p>
  <CodeBlock :code="fallback" lang="typescript" />

  <DocHeading id="migration">Old icon components</DocHeading>
  <p>
    The old library shipped its own icon components under <code class="prose-code">vue-components/v3/icons</code>.
    Replace each with its Lucide equivalent:
  </p>
  <div class="my-5 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Old component</th><th class="h-9 px-4 font-medium">Lucide</th></tr>
      </thead>
      <tbody>
        <tr v-for="[from, to] in oldIcons" :key="from" class="border-t border-border-light first:border-0">
          <td class="px-4 py-2.5"><code class="prose-code">{{ from }}</code></td>
          <td class="px-4 py-2.5"><code class="prose-code">{{ to }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />
  <div class="mt-4 flex flex-wrap items-center gap-3">
    <AcButton title="Create Database"><template #icon><Plus class="size-4" /></template></AcButton>
    <AcButton title="Refresh" color="white"><template #icon><RefreshCw class="size-3.5" /></template></AcButton>
    <AcButton title="Delete" color="danger" variant="light"><template #icon><Trash2 class="size-3.5" /></template></AcButton>
  </div>
</template>
