<script setup lang="ts">
import { AcAvatar } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Always pass `name`, even with an image: it gives the fallback initials and the accessible name.", "Use `circle` for people and `square` for organisations, teams and products.", "Set `alt=\"\"` when the name is written right next to the avatar."];
const donts = ["Don't use an avatar as the only way to identify someone in a list — show the name too.", "Don't show more than about five avatars in a group; end with a `+N` overflow.", "Don't use the colour to mean anything: it is derived from the name, not from a role or status."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use an avatar to show who owns or did something: members, organisations, the user menu, audit rows. With no image or a broken one it shows initials on a colour chosen from the name, so the same person always gets the same colour.</p>
  <ComponentPlayground
    tag="AcAvatar"
    :component="AcAvatar"
    :controls="[{'prop': 'name', 'type': 'text'}, {'prop': 'size', 'type': 'select', 'options': ['xs', 'small', 'normal', 'large']}, {'prop': 'shape', 'type': 'select', 'options': ['circle', 'square']}, {'prop': 'status', 'type': 'select', 'options': ['', 'online', 'away', 'busy', 'offline']}, {'prop': 'imgUrl', 'type': 'text'}]"
    :initial="{'name': 'Nadia Islam', 'size': 'large', 'shape': 'circle', 'status': 'online', 'imgUrl': ''}"
    :defaults="{'name': '', 'size': 'normal', 'shape': 'circle', 'status': '', 'imgUrl': ''}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="image-initials" :level="3">Image and initials</DocHeading>
  <p>Initials come from the first two words of <code class="prose-code">name</code> (dots, dashes and underscores count as spaces, and an email's domain is dropped). An image that fails to load falls back to them. With no name it shows a neutral blank.</p>
  <ComponentExample name="avatar/AvatarBasic" />
  <DocHeading id="sizes" :level="3">Sizes</DocHeading>
  <p><code class="prose-code">xs</code> 20px for dense tables, <code class="prose-code">small</code> 24px for inline mentions, <code class="prose-code">normal</code> 32px for lists and the user menu, <code class="prose-code">large</code> 48px for member cards.</p>
  <ComponentExample name="avatar/AvatarSizes" />
  <DocHeading id="shapes" :level="3">Circle and square</DocHeading>
  <p>People are circles; organisations, teams and products are squares with rounded corners.</p>
  <ComponentExample name="avatar/AvatarShapes" />
  <DocHeading id="status" :level="3">Status</DocHeading>
  <p><code class="prose-code">status</code> adds a presence dot. Its meaning is added to the accessible name, e.g. “Samira Khan (Busy)”.</p>
  <ComponentExample name="avatar/AvatarStatus" />
  <DocHeading id="group" :level="3">Group</DocHeading>
  <p>Stack avatars in a wrapper with <code class="prose-code">flex -space-x-2 *:ring-2 *:ring-surface</code>: they overlap and a ring in the surface colour separates them. End with <code class="prose-code">overflow-count</code> for the rest.</p>
  <ComponentExample name="avatar/AvatarGroup" />
  <Callout type="tip">Use <code class="prose-code">-space-x-1.5</code> for <code class="prose-code">xs</code> and <code class="prose-code">small</code> avatars and <code class="prose-code">-space-x-3</code> for <code class="prose-code">large</code>. Give the wrapper <code class="prose-code">role="group"</code> and an <code class="prose-code">aria-label</code>.</Callout>
  <DocHeading id="with-name" :level="3">With a name</DocHeading>
  <p>Next to a written name the avatar is decorative, so pass <code class="prose-code">alt=""</code> to keep screen readers from reading the name twice.</p>
  <ComponentExample name="avatar/AvatarWithName" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The avatar is <code class="prose-code">role="img"</code>, named by <code class="prose-code">alt</code> or <code class="prose-code">name</code>, plus the status. The image and initials inside are hidden.</li>
    <li>With <code class="prose-code">alt=""</code> (or no name) the whole avatar is <code class="prose-code">aria-hidden</code>.</li>
    <li>The overflow avatar reads “4 more”; pass <code class="prose-code">alt</code> to say more, e.g. “4 more members”.</li>
    <li>Initials use -20 text on a -90 tint of the name's colour: 7:1 or better in both themes.</li>
  </ul>

  <ApiTables component="AcAvatar" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">size-5 size-6 size-8 size-12</code></td><td class="px-4 py-3">Sizes</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-full</code> / <code class="prose-code">rounded-4 … rounded-10</code></td><td class="px-4 py-3">Circle / square</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-{hue}-90 text-{hue}-20</code></td><td class="px-4 py-3">Initials (primary, blue, purple, yellow, red, green, secondary)</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-sunken text-label</code></td><td class="px-4 py-3">No name, <code class="prose-code">+N</code> overflow</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">ring-1 ring-inset ring-heading/8</code></td><td class="px-4 py-3">Hairline edge</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-success bg-warning bg-danger bg-slate-60 ring-2 ring-surface</code></td><td class="px-4 py-3">Status dot</td></tr>
      </tbody>
    </table>
  </div>
</template>
