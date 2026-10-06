<script setup lang="ts">
import { AcCard, AcPage } from "@/lib";
</script>

<template>
  <div class="rounded-10 border border-dashed border-border bg-surface-sunken">
    <AcPage width="narrow" gap="small">
      <AcCard title="Narrow page"><p>Capped at 768px and centred: good for forms and settings.</p></AcCard>
      <AcCard title="Small gap"><p>Cards 12px apart.</p></AcCard>
    </AcPage>
  </div>
</template>
