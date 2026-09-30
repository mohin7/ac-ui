<script setup lang="ts">
import { AcButton, useToast } from "@/lib";

const { toast, success, error, warning, info } = useToast();
</script>

<template>
  <AcButton title="Success" color="white" @click="success('Database created', { description: 'demo-postgres is provisioning in namespace demo.' })" />
  <AcButton title="Error" color="white" @click="error('Backup failed', { description: 'The repository s3://kubedb-backups is unreachable.' })" />
  <AcButton title="Warning" color="white" @click="warning('Certificate expires in 7 days')" />
  <AcButton title="Info" color="white" @click="info('Cluster upgrade scheduled', { description: 'prod-us-east-1 moves to v1.30 on Sunday 02:00 UTC.' })" />
  <AcButton title="Neutral" color="white" @click="toast('Copied to clipboard', { duration: 2000 })" />
</template>
