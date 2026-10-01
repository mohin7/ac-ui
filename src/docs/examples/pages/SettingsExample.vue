<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { Bell, Copy, Check, KeyRound, Palette, Plus, Trash2, TriangleAlert, User, Users } from "lucide-vue-next";
import {
  AcAlert,
  AcAvatar,
  AcButton,
  AcCheckBox,
  AcDeleteModal,
  AcFileUpload,
  AcForm,
  AcFormFooter,
  AcFormSection,
  AcInput,
  AcKbd,
  AcModal,
  AcPagination,
  AcSectionContent,
  AcSelect,
  AcSideTabs,
  AcSwitch,
  AcTable,
  AcTag,
  AcThemeMode,
  useToast,
} from "@/lib";
import type { Component } from "vue";

type SectionKey = "profile" | "appearance" | "notifications" | "tokens" | "members" | "danger";
type Role = "owner" | "admin" | "editor" | "viewer";

interface Token extends Record<string, unknown> {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  created: string;
  lastUsed: string;
  expires: string;
}

interface Member extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: Role;
  lastActive: string;
}

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  on: boolean;
}

const SECTIONS: { key: SectionKey; label: string; group: string; icon: Component; description: string; tone?: "danger" }[] = [
  { key: "profile", label: "Profile", group: "Account", icon: User, description: "How you appear to people in your organisation." },
  { key: "appearance", label: "Appearance", group: "Account", icon: Palette, description: "Theme and colour for this browser." },
  { key: "notifications", label: "Notifications", group: "Account", icon: Bell, description: "Choose what reaches your inbox and Slack. Changes save as you go." },
  { key: "tokens", label: "API tokens", group: "Account", icon: KeyRound, description: "Personal tokens for the AppsCode API, kubectl-dba and CI pipelines." },
  { key: "members", label: "Members", group: "Organisation", icon: Users, description: "People in the appscode organisation and what they can do." },
  { key: "danger", label: "Danger zone", group: "Organisation", icon: TriangleAlert, tone: "danger", description: "Irreversible actions for the whole organisation." },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PHOTO = 2 * 1024 * 1024;

const SCOPE_OPTIONS = [
  { value: "databases:read", label: "databases:read" },
  { value: "databases:write", label: "databases:write" },
  { value: "backups:write", label: "backups:write" },
  { value: "billing:read", label: "billing:read" },
];

const EXPIRY_OPTIONS = [
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "1 year" },
  { value: "never", label: "No expiry", description: "Not recommended" },
];

const ROLE_OPTIONS: { value: Role; label: string; description: string; disabled?: boolean }[] = [
  { value: "owner", label: "Owner", description: "Billing and every setting", disabled: true },
  { value: "admin", label: "Admin", description: "Manage members and clusters" },
  { value: "editor", label: "Editor", description: "Create and change databases" },
  { value: "viewer", label: "Viewer", description: "Read-only access" },
];

const tokenColumns = [
  { key: "name", label: "Name" },
  { key: "scopes", label: "Scopes" },
  { key: "lastUsed", label: "Activity" },
  { key: "actions", label: "", align: "right" as const, width: "48px" },
];

const memberColumns = [
  { key: "name", label: "Member" },
  { key: "role", label: "Role", width: "168px" },
  { key: "lastActive", label: "Last active", align: "right" as const },
];

const PEOPLE = [
  "Jamie Rahman", "Tamal Saha", "Nusrat Jahan", "Arnob Kumar", "Sadia Islam", "Imtiaz Ahmed", "Farhana Akter", "Rafiq Hasan",
  "Mehedi Hasan", "Priya Nair", "Lucas Martin", "Ayesha Siddiqa", "Kenji Watanabe", "Sofia Rossi", "Omar Faruk", "Emma Schulz",
  "Tanvir Alam", "Nadia Chowdhury", "Diego Alvarez", "Ruhul Amin", "Mina Park", "Hasib Karim", "Zara Khan",
];

const ACTIVITY = ["Just now", "5 min ago", "1 hour ago", "Today", "Yesterday", "3 days ago", "Last week", "2 weeks ago"];

const toast = useToast();

const section = ref<SectionKey>("profile");

// Profile
const savedProfile = ref({ name: "Jamie Rahman", email: "jamie@appscode.com" });
const profile = ref({ ...savedProfile.value });
const photo = ref<File[]>([]);
const photoUrl = ref("");
const savedPhotoUrl = ref("");
const profileSubmitted = ref(false);
const savingProfile = ref(false);

// Notifications
const emailNotifications = ref<NotificationSetting[]>([
  { key: "backup-failed", label: "Backup failed", description: "A scheduled KubeStash backup didn't finish.", on: true },
  { key: "db-health", label: "Database unhealthy", description: "A database turns Critical or loses its primary.", on: true },
  { key: "upgrades", label: "Upgrades available", description: "A new patch release exists for a version you run.", on: false },
  { key: "usage", label: "Weekly usage report", description: "Cost and resource use every Monday morning.", on: true },
]);
const slackNotifications = ref<NotificationSetting[]>([
  { key: "slack-critical", label: "Critical alerts", description: "Posts to #db-alerts as soon as a database turns Critical.", on: true },
  { key: "slack-ops", label: "OpsRequests", description: "Upgrades, scaling and restarts, when they start and finish.", on: false },
]);

// API tokens
const tokens = ref<Token[]>([
  { id: "t1", name: "github-actions", prefix: "ac_7f3e", scopes: ["databases:read", "databases:write"], created: "Mar 2, 2026", lastUsed: "2 hours ago", expires: "Mar 2, 2027" },
  { id: "t2", name: "grafana-exporter", prefix: "ac_19bd", scopes: ["databases:read"], created: "Jan 18, 2026", lastUsed: "Just now", expires: "Never" },
  { id: "t3", name: "laptop-kubectl-dba", prefix: "ac_c04a", scopes: ["databases:read", "backups:write"], created: "Aug 30, 2026", lastUsed: "Yesterday", expires: "Nov 28, 2026" },
]);
const createOpen = ref(false);
const newToken = ref({ name: "", scopes: ["databases:read"] as string[], expiry: "90" as string | null });
const tokenSubmitted = ref(false);
const creatingToken = ref(false);
const revealedToken = ref("");
const revealBox = ref<HTMLElement | null>(null);
const copied = ref(false);
const revokeOpen = ref(false);
const revoking = ref(false);
const tokenToRevoke = ref<Token | null>(null);

// Members
const members = ref<Member[]>(
  PEOPLE.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.split(" ")[0]!.toLowerCase()}@appscode.com`,
    role: i === 0 ? "admin" : i === 1 ? "owner" : (["admin", "editor", "editor", "viewer"] as const)[i % 4]!,
    lastActive: ACTIVITY[i % ACTIVITY.length]!,
  })),
);
const memberPage = ref(1);
const memberPageSize = ref(5);

// Danger zone
const deleteOrgOpen = ref(false);
const deletingOrg = ref(false);

const current = computed(() => SECTIONS.find((s) => s.key === section.value)!);

const profileErrors = computed(() => ({
  name: profile.value.name.trim() ? "" : "Enter your name.",
  email: !profile.value.email ? "Enter your email." : EMAIL.test(profile.value.email) ? "" : "Enter a valid email address.",
}));
const profileDirty = computed(
  () =>
    profile.value.name !== savedProfile.value.name ||
    profile.value.email !== savedProfile.value.email ||
    photoUrl.value !== savedPhotoUrl.value,
);
const avatarUrl = computed(() => photoUrl.value || savedPhotoUrl.value);

const tokenErrors = computed(() => ({
  name: !newToken.value.name.trim()
    ? "Give the token a name."
    : tokens.value.some((t) => t.name === newToken.value.name.trim())
      ? "A token with this name already exists."
      : "",
  scopes: newToken.value.scopes.length ? "" : "Pick at least one scope.",
}));

const pagedMembers = computed(() => {
  const start = (memberPage.value - 1) * memberPageSize.value;
  return members.value.slice(start, start + memberPageSize.value);
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setPhoto(files: File[]) {
  if (photoUrl.value && photoUrl.value !== savedPhotoUrl.value) URL.revokeObjectURL(photoUrl.value);
  photoUrl.value = files[0] ? URL.createObjectURL(files[0]) : "";
}

function discardProfile() {
  profile.value = { ...savedProfile.value };
  photo.value = [];
  photoUrl.value = savedPhotoUrl.value;
  profileSubmitted.value = false;
}

async function saveProfile() {
  profileSubmitted.value = true;
  if (profileErrors.value.name || profileErrors.value.email) {
    await nextTick();
    document.querySelector<HTMLElement>('#settings-profile [aria-invalid="true"]')?.focus();
    return;
  }
  savingProfile.value = true;
  await wait(900);
  savedProfile.value = { ...profile.value };
  savedPhotoUrl.value = photoUrl.value;
  photo.value = [];
  profileSubmitted.value = false;
  savingProfile.value = false;
  toast.success("Profile saved");
}

function openCreateToken() {
  newToken.value = { name: "", scopes: ["databases:read"], expiry: "90" };
  tokenSubmitted.value = false;
  revealedToken.value = "";
  copied.value = false;
  createOpen.value = true;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return `ac_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function expiryDate(expiry: string | null) {
  if (!expiry || expiry === "never") return "Never";
  const date = new Date(Date.now() + Number(expiry) * 86_400_000);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function createToken() {
  if (revealedToken.value || creatingToken.value) return;
  tokenSubmitted.value = true;
  if (tokenErrors.value.name || tokenErrors.value.scopes) return;
  creatingToken.value = true;
  await wait(800);
  const token = randomToken();
  tokens.value = [
    {
      id: token,
      name: newToken.value.name.trim(),
      prefix: token.slice(0, 7),
      scopes: [...newToken.value.scopes],
      created: "Today",
      lastUsed: "Never",
      expires: expiryDate(newToken.value.expiry),
    },
    ...tokens.value,
  ];
  revealedToken.value = token;
  creatingToken.value = false;
  // The form that held focus is gone, so hand focus to the copy button.
  await nextTick();
  revealBox.value?.querySelector("button")?.focus();
}

function onCreateKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    createToken();
  }
}

async function copyToken() {
  try {
    await navigator.clipboard.writeText(revealedToken.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    toast.error("Couldn't copy", { description: "Select the token and copy it by hand." });
  }
}

function askRevoke(row: Token) {
  tokenToRevoke.value = row;
  revokeOpen.value = true;
}

async function revokeToken() {
  const target = tokenToRevoke.value;
  if (!target) return;
  revoking.value = true;
  await wait(700);
  tokens.value = tokens.value.filter((t) => t.id !== target.id);
  revoking.value = false;
  revokeOpen.value = false;
  toast.success(`Revoked ${target.name}`, { description: "Requests using it are now refused." });
}

function changeRole(member: Member, value: unknown) {
  const role = ROLE_OPTIONS.find((r) => r.value === value);
  if (!role || role.value === member.role) return;
  members.value = members.value.map((m) => (m.id === member.id ? { ...m, role: role.value } : m));
  toast.success(`${member.name} is now ${role.label.toLowerCase() === "admin" ? "an admin" : `a ${role.label.toLowerCase()}`}`);
}

async function deleteOrganisation() {
  deletingOrg.value = true;
  await wait(1200);
  deletingOrg.value = false;
  deleteOrgOpen.value = false;
  toast.success("appscode was deleted", { description: "This is a demo, so nothing actually happened." });
}

watch(photo, setPhoto);

onBeforeUnmount(() => {
  for (const url of new Set([photoUrl.value, savedPhotoUrl.value])) if (url) URL.revokeObjectURL(url);
});
</script>

<template>
  <div class="bg-surface-muted">
    <AcSideTabs v-model="section" :items="SECTIONS" label="Settings" class="min-h-[640px]" :sticky="false">
      <main class="@container/main min-w-0 px-4 py-6 @lg:px-8 @lg:py-8">
        <div class="mb-6">
          <h4>{{ current.label }}</h4>
          <p class="mt-1 text-base text-muted">{{ current.description }}</p>
        </div>

        <!-- Profile -->
        <div v-if="section === 'profile'" id="settings-profile" class="max-w-160 rounded-10 border border-border bg-surface px-5 pt-5 shadow-xs">
          <AcForm width="full" novalidate @submit="saveProfile">
            <AcFormSection title="Photo" description="A square image of at least 256 × 256 pixels works best.">
              <div class="flex items-center gap-4">
                <AcAvatar :name="profile.name || savedProfile.name" :img-url="avatarUrl" size="large" alt="" />
                <div class="min-w-0 flex-1">
                  <AcFileUpload v-model="photo" small accept="image/png,image/jpeg,image/webp" :max-size="MAX_PHOTO" label="Profile photo" />
                </div>
              </div>
            </AcFormSection>
            <AcFormSection title="Details" :columns="2">
              <AcInput v-model="profile.name" label="Full name" required :error-msg="profileSubmitted ? profileErrors.name : ''" />
              <AcInput
                v-model.trim="profile.email"
                type="email"
                label="Email"
                required
                :error-msg="profileSubmitted ? profileErrors.email : ''"
                hint="We send alerts and invoices here."
              />
            </AcFormSection>
            <template #footer>
              <AcFormFooter
                submit-label="Save profile"
                cancel-label="Discard"
                sticky="none"
                :hide-cancel="!profileDirty"
                :disabled="!profileDirty"
                :loading="savingProfile"
                class="-mx-5 mt-0 w-auto! [&>div]:rounded-b-10 [&>div]:bg-surface-muted [&>div]:px-5"
                @cancel="discardProfile"
              >
                <template #left>
                  <span v-if="profileDirty">Unsaved changes</span>
                </template>
              </AcFormFooter>
            </template>
          </AcForm>
        </div>

        <!-- Appearance -->
        <div v-else-if="section === 'appearance'" class="max-w-160 space-y-4">
          <AcSectionContent title="Theme" subtitle="Saved in this browser" :padded="false">
            <div class="flex flex-col gap-3 px-5 py-4 @lg/main:flex-row @lg/main:items-center @lg/main:justify-between">
              <div class="min-w-0">
                <p class="font-medium text-heading">Colour mode</p>
                <p class="mt-0.5 text-xs text-muted">System follows your operating system and switches with it.</p>
              </div>
              <AcThemeMode display="labels" class="self-start @lg/main:self-auto" />
            </div>
          </AcSectionContent>

          <div class="flex gap-3 rounded-10 border border-border bg-surface p-4 shadow-xs">
            <div class="flex shrink-0 -space-x-1.5 pt-0.5" aria-hidden="true">
              <span class="size-5 rounded-full bg-primary-30 ring-2 ring-surface" />
              <span class="size-5 rounded-full bg-primary ring-2 ring-surface" />
              <span class="size-5 rounded-full bg-primary-70 ring-2 ring-surface" />
              <span class="size-5 rounded-full bg-primary-90 ring-2 ring-surface" />
            </div>
            <div class="min-w-0 text-base">
              <p class="font-medium text-heading">Brand colour</p>
              <p class="mt-0.5 text-body">
                Every primary shade comes from one hue, <code class="rounded-4 bg-surface-muted px-1 font-mono text-xs text-heading ring-1 ring-border">--primary-hue</code>
                (149, AppsCode green). White-label consoles set it once on <code class="rounded-4 bg-surface-muted px-1 font-mono text-xs text-heading ring-1 ring-border">&lt;html&gt;</code>
                and buttons, focus rings and charts follow in both themes.
              </p>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-else-if="section === 'notifications'" class="max-w-160 space-y-4">
          <AcSectionContent title="Email" subtitle="Sent to jamie@appscode.com" :padded="false">
            <ul class="divide-y divide-border-light">
              <li v-for="n in emailNotifications" :key="n.key" class="px-5 py-3.5">
                <AcSwitch v-model="n.on" :label="n.label" class="[&>div]:justify-between [&_label]:font-medium" />
                <p class="mt-0.5 pr-12 text-xs text-muted">{{ n.description }}</p>
              </li>
            </ul>
          </AcSectionContent>
          <AcSectionContent title="Slack" subtitle="#db-alerts in appscode.slack.com" :padded="false">
            <ul class="divide-y divide-border-light">
              <li v-for="n in slackNotifications" :key="n.key" class="px-5 py-3.5">
                <AcSwitch v-model="n.on" :label="n.label" class="[&>div]:justify-between [&_label]:font-medium" />
                <p class="mt-0.5 pr-12 text-xs text-muted">{{ n.description }}</p>
              </li>
            </ul>
          </AcSectionContent>
        </div>

        <!-- API tokens -->
        <div v-else-if="section === 'tokens'" class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-base text-body">
              Send a token as <code class="rounded-4 bg-surface px-1 font-mono text-xs text-heading ring-1 ring-border">Authorization: Bearer …</code>
            </p>
            <AcButton title="Create token" @click="openCreateToken">
              <template #icon><Plus aria-hidden="true" /></template>
            </AcButton>
          </div>
          <AcTable :columns="tokenColumns" :rows="tokens" empty-text="No tokens yet.">
            <template #cell-name="{ row }">
              <p class="font-medium text-heading">{{ row.name }}</p>
              <p class="font-mono text-xs text-muted">{{ row.prefix }}…</p>
            </template>
            <template #cell-scopes="{ row }">
              <div class="flex max-w-60 flex-wrap gap-1.5 py-2">
                <AcTag v-for="s in (row as Token).scopes" :key="s" :label="s" :color="s.endsWith(':write') ? 'warning' : 'neutral'" />
              </div>
            </template>
            <template #cell-lastUsed="{ row }">
              <p class="text-heading">{{ row.lastUsed === "Never" ? "Never used" : `Used ${String(row.lastUsed).toLowerCase()}` }}</p>
              <p class="text-xs" :class="row.expires === 'Never' ? 'text-yellow-30' : 'text-muted'">
                {{ row.expires === "Never" ? "Never expires" : `Expires ${row.expires}` }}
              </p>
            </template>
            <template #cell-actions="{ row }">
              <AcButton color="ghost" size="small" :aria-label="`Revoke ${row.name}`" @click="askRevoke(row as Token)">
                <template #icon><Trash2 aria-hidden="true" /></template>
              </AcButton>
            </template>
          </AcTable>
          <p class="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            Tip: in the create dialog, press <AcKbd :keys="['mod', 'enter']" size="small" /> to create without reaching for the mouse.
          </p>
        </div>

        <!-- Members -->
        <div v-else-if="section === 'members'" class="space-y-4">
          <AcTable :columns="memberColumns" :rows="pagedMembers">
            <template #cell-name="{ row }">
              <div class="flex items-center gap-3">
                <AcAvatar :name="String(row.name)" alt="" />
                <div class="min-w-0">
                  <p class="font-medium text-heading">{{ row.name }}</p>
                  <p class="text-xs text-muted">{{ row.email }}</p>
                </div>
              </div>
            </template>
            <template #cell-role="{ row }">
              <AcSelect
                :model-value="(row as Member).role"
                :options="ROLE_OPTIONS"
                size="compact"
                :placeholder="`Role for ${row.name}`"
                :disabled="row.role === 'owner'"
                @update:model-value="changeRole(row as Member, $event)"
              />
            </template>
          </AcTable>
          <AcPagination v-model:page="memberPage" v-model:page-size="memberPageSize" :total="members.length" :page-sizes="[5, 10, 20]" item-label="members" />
        </div>

        <!-- Danger zone -->
        <div v-else class="max-w-160 rounded-10 border border-red-80 bg-surface shadow-xs">
          <div class="flex flex-col gap-4 p-5 @lg/main:flex-row @lg/main:items-center @lg/main:justify-between">
            <div class="min-w-0">
              <p class="font-medium text-heading">Delete this organisation</p>
              <p class="mt-0.5 text-base text-muted">
                Removes appscode, its {{ members.length }} members, 4 clusters and every backup. Running databases are stopped first.
              </p>
            </div>
            <AcButton title="Delete organisation" color="danger" class="shrink-0 self-start @lg/main:self-auto" @click="deleteOrgOpen = true" />
          </div>
        </div>
      </main>
    </AcSideTabs>
  </div>

  <AcModal
    v-model:open="createOpen"
    :title="revealedToken ? 'Copy your new token' : 'Create API token'"
    :description="revealedToken ? undefined : 'Tokens act as you, limited to the scopes you pick.'"
    :closable="!creatingToken"
  >
    <div v-if="revealedToken" class="space-y-4">
      <AcAlert color="warning">This is the only time the token is shown. Store it in a secret manager before you close this dialog.</AcAlert>
      <div ref="revealBox" class="flex items-center gap-2 rounded-6 border border-border bg-surface-muted py-1 pr-1 pl-3">
        <code class="min-w-0 flex-1 font-mono text-base break-all text-heading select-all">{{ revealedToken }}</code>
        <AcButton :title="copied ? 'Copied' : 'Copy'" color="white" size="small" class="shrink-0" @click="copyToken">
          <template #icon>
            <component :is="copied ? Check : Copy" aria-hidden="true" />
          </template>
        </AcButton>
      </div>
      <p class="sr-only" aria-live="polite">{{ copied ? "Token copied to the clipboard" : "" }}</p>
    </div>
    <div v-else class="space-y-5" @keydown="onCreateKeydown">
      <AcInput
        v-model="newToken.name"
        label="Token name"
        required
        autofocus
        :error-msg="tokenSubmitted ? tokenErrors.name : ''"
        hint="Say where it's used, e.g. github-actions."
        @keydown.enter.exact.prevent="createToken"
      />
      <div>
        <p class="mb-2 text-xs font-medium text-label">Scopes</p>
        <AcCheckBox v-model="newToken.scopes" :options="SCOPE_OPTIONS" name="scopes" :error-msg="tokenSubmitted ? tokenErrors.scopes : ''" />
      </div>
      <AcSelect v-model="newToken.expiry" :options="EXPIRY_OPTIONS" label="Expires after" />
    </div>

    <template #footer-left>
      <span v-if="!revealedToken" class="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
        <AcKbd :keys="['mod', 'enter']" size="small" /> to create
      </span>
    </template>
    <template #footer>
      <template v-if="revealedToken">
        <AcButton title="Done" @click="createOpen = false" />
      </template>
      <template v-else>
        <AcButton title="Cancel" color="white" :disabled="creatingToken" @click="createOpen = false" />
        <AcButton title="Create token" :loading="creatingToken" @click="createToken" />
      </template>
    </template>
  </AcModal>

  <AcDeleteModal
    v-model:open="revokeOpen"
    title="Revoke token"
    message="Revoke"
    :item-name="tokenToRevoke?.name"
    detail="Scripts and pipelines using it stop working immediately."
    confirm-text="Revoke token"
    :loading="revoking"
    @confirm="revokeToken"
  />

  <AcDeleteModal
    v-model:open="deleteOrgOpen"
    title="Delete organisation"
    message="Permanently delete the organisation"
    item-name="appscode"
    :detail="`All ${members.length} members lose access, and clusters, databases and backups are removed. This can't be undone.`"
    confirm-text="Delete organisation"
    confirm-by-typing
    :loading="deletingOrg"
    @confirm="deleteOrganisation"
  />
</template>
