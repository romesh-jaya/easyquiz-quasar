<template>
  <div class="text-center q-mb-lg">
    <div class="q-gutter-md q-mt-md container-responsive">
      <div v-if="loading" class="q-mt-xl q-gutter-y-md">
        <q-skeleton height="20px" />
        <q-skeleton height="150px" />
        <q-skeleton height="20px" />
      </div>
      <div v-else-if="myQuiz">
        <h3 class="text-h4 text-accent">{{ myQuiz.quizName }}</h3>
        <q-card class="my-card">
          <q-card-section class="q-pa-xs">
            <div class="text-body2 q-pa-md">{{ myQuiz.description }}</div>
            <q-separator />
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Last Updated:</span>
              {{ myQuiz.lastUpdated.toLocaleString() }}
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Pass Mark Percentage: </span
              >{{ myQuiz.passMarkPercentage }}%
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Status: </span>{{ myQuiz.statusDB }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-else>
        <div class="q-mt-xl">
          <p>Quiz not found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, toRefs, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMyQuizzesStore } from '../stores/myQuizzes';

const props = defineProps({
  id: { type: String, required: false, default: '' },
});

const { id } = toRefs(props);

const router = useRouter();
const myQuizzesStore = useMyQuizzesStore();
const myQuiz = computed(() =>
  myQuizzesStore.myQuizzes.find((quiz) => quiz.id === id.value)
);
const myQuizzes = computed(() => myQuizzesStore.myQuizzes);
const loading = computed(() => myQuizzesStore.loading);
const routeError = ref('');

watch(myQuiz, (newValue, oldValue) => {
  console.log('myQuiz', newValue);
});
</script>

<style lang="scss">
.attribute-label {
  width: 200px;
  display: inline-block;
}
</style>
