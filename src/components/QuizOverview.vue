<template>
  <q-card class="my-card">
    <q-card-section
      class="bg-secondary text-white q-pa-xs"
      @click="onCardClicked"
    >
      <div class="text-h6">{{ title }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section v-snip="{ lines: 3 }" class="card-body q-ma-md">
      {{ description }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const { id } = toRefs(props);

const onCardClicked = () => {
  router.push(`/my-quizzes/${id.value}`);
};
</script>

<style lang="scss">
.my-card {
  width: 100%;
  max-width: 250px;
  cursor: pointer;
}

.card-body {
  padding: 0 !important;
  height: 72px;
}
</style>
