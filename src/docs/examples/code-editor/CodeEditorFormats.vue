<script setup lang="ts">
import { ref } from "vue";
import { parse, stringify } from "yaml";
import { AcSegmentedControl } from "@/lib";
import { AcCodeEditor, type EditorProblem } from "@/lib/editor";

const format = ref<"yaml" | "json">("yaml");
const text = ref(`apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
data:
  datasource.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus-operated:9090
`);
const problems = ref<EditorProblem[]>([]);

function switchTo(next: "yaml" | "json") {
  // Converting needs valid text; the switch is disabled until the problems are fixed.
  const value = parse(text.value);
  text.value = next === "json" ? JSON.stringify(value, null, 2) + "\n" : stringify(value);
  format.value = next;
}
</script>

<template>
  <AcCodeEditor v-model="text" :language="format" title="grafana-datasources" height="300px" @validate="problems = $event">
    <template #actions>
      <AcSegmentedControl
        :model-value="format"
        :options="[{ value: 'yaml', label: 'YAML' }, { value: 'json', label: 'JSON' }]"
        :disabled="problems.length > 0"
        size="small"
        label="Format"
        @update:model-value="(v) => v && switchTo(v)"
      />
    </template>
  </AcCodeEditor>
</template>
