<template>
  <q-card class="my-card">
    <q-card-section class="bg-secondary text-white q-pa-xs">
      <div class="text-h6">{{ title }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section v-snip="{ lines: 3 }" class="card-body q-ma-md">
      {{ description }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
});
defineEmits(['click']);
</script>

<style lang="scss">
.my-card {
  width: 100%;
  max-width: 250px;
}

.card-body {
  padding: 0 !important;
  height: 72px;
}
</style>
