<script setup lang="ts">
import { AcLogo } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Use the full logo where there's room for it: the sign-in page, the navbar of the main console, empty states and emails.",
  "Use the mark alone in tight spaces: a collapsed sidebar, favicons, avatars, and next to a product name such as KubeDB.",
  "Keep clear space of half the logo's height on every side.",
  "Use `tone=\"white\"` on navy or photo backgrounds.",
];
const donts = [
  "Don't recolour, outline, add shadows to, or rotate the logo. Its colours are fixed brand values.",
  "Don't stretch it. Set only its height (`size` or an `h-*` class); the width follows.",
  "Don't use the full logo below 16px tall; the wordmark becomes unreadable. Use the mark.",
  "Don't put the logo on a busy image or a green background, where the mark's green disappears.",
];

const assets = [
  { name: "Full logo (SVG)", href: "/logos/appscode-logo.svg", note: "639 × 132, navy and green" },
  { name: "Mark (SVG)", href: "/favicon.svg", note: "132 × 132, also the favicon" },
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    <code class="prose-code">AcLogo</code> draws the AppsCode logo as inline SVG, so it's sharp at every size and needs no image file. In dark mode the navy
    "Apps" turns light so it stays readable; the green "Code" and the mark keep their brand colours.
  </p>
  <ComponentPlayground
    tag="AcLogo"
    :component="AcLogo"
    :controls="[{'prop': 'variant', 'type': 'select', 'options': ['full', 'mark']}, {'prop': 'size', 'type': 'select', 'options': [16, 24, 32, 48]}, {'prop': 'tone', 'type': 'select', 'options': ['auto', 'white']}]"
    :initial="{'variant': 'full', 'size': 32, 'tone': 'auto'}"
    :defaults="{'variant': 'full', 'size': 24, 'tone': 'auto'}"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="variants" :level="3">Full logo and mark</DocHeading>
  <p>The full logo is the mark followed by the wordmark. The mark alone is a square, for places too small for the wordmark.</p>
  <ComponentExample name="logo/LogoVariants" center />

  <DocHeading id="sizes" :level="3">Sizes</DocHeading>
  <p><code class="prose-code">size</code> sets the height in pixels and the width follows. A height class such as <code class="prose-code">h-8</code> overrides it. 24px is the default and fits the navbar and sidebar.</p>
  <ComponentExample name="logo/LogoSizes" />

  <DocHeading id="surfaces" :level="3">Light, dark and navy surfaces</DocHeading>
  <p>
    On light and dark surfaces the default <code class="prose-code">tone="auto"</code> picks the right wordmark colour. On the brand navy, or any dark
    colour that isn't the dark theme, use <code class="prose-code">tone="white"</code>.
  </p>
  <ComponentExample name="logo/LogoSurfaces" />

  <DocHeading id="in-the-shell" :level="3">In the navbar and sidebar</DocHeading>
  <p>
    In the main console, show the full logo and a divider before the section name. In a product console, show the mark with the product name, as KubeDB
    does. When the logo sits next to text that names it, pass <code class="prose-code">label=""</code> so screen readers don't read the name twice.
  </p>
  <ComponentExample name="logo/LogoInNavbar" />

  <DocHeading id="clear-space" :level="3">Clear space</DocHeading>
  <p>Keep at least half the logo's height free on every side: 12px around a 24px logo. Nothing else, including other logos, goes in that space.</p>
  <ComponentExample name="logo/LogoClearSpace" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="files">Files</DocHeading>
  <p>For places that can't use the component, such as emails, slides or a README:</p>
  <ul>
    <li v-for="a in assets" :key="a.href">
      <a :href="a.href" download>{{ a.name }}</a> <span class="text-muted">— {{ a.note }}</span>
    </li>
  </ul>
  <Callout type="note">
    The brand colours are navy <code class="prose-code">#193D4B</code> and green <code class="prose-code">#00A651</code>, available as
    <code class="prose-code">brand-navy</code> and <code class="prose-code">brand-green</code> for the logo only. Interface colour comes from the primary
    scale, which a customer can re-hue; the logo's colours never change.
  </Callout>

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>With a <code class="prose-code">label</code> (default "AppsCode") the SVG is an image with that name. With <code class="prose-code">label=""</code> it's hidden from screen readers.</li>
    <li>When the logo is a home link, name the link rather than the logo, e.g. <code class="prose-code">&lt;a href="/" aria-label="AppsCode home"&gt;</code> around an unlabelled logo.</li>
  </ul>

  <ApiTables component="AcLogo" />
</template>
