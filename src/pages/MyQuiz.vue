<template>
  <PageContainerResponsive>
    <div v-if="loading" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="myQuiz">
      <h3 class="text-h4 text-accent">{{ myQuiz.quizName }}</h3>
      <q-card>
        <q-card-section class="q-pa-xs">
          <div class="text-body2 q-pa-md">{{ myQuiz.description }}</div>
          <q-separator />
          <div class="q-pa-md">
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Last Updated:</span>
              {{ myQuiz.lastUpdated.toLocaleString() }}
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Pass Mark Percentage: </span
              >{{ myQuiz.passMarkPercentage }}%
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Status: </span
              >{{
                QuizStatus.find((status) => status.dbValue === myQuiz.statusDB)
                  ?.clientValue
              }}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-btn color="accent" class="q-my-lg" @click="onEditQuiz"
        >Edit Quiz Details</q-btn
      >
    </div>
    <div v-else>
      <div class="q-mt-xl">
        <p>Quiz not found</p>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useMyQuizzesStore } from '../stores/myQuizzes';
import { QuizStatus } from '../constants/QuizStatus';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';

const props = defineProps({
  id: { type: String, required: false, default: '' },
});

const { id } = toRefs(props);

const router = useRouter();
const myQuizzesStore = useMyQuizzesStore();
const myQuiz = computed(() =>
  myQuizzesStore.myQuizzes.find((quiz) => quiz.id === id.value)
);
const loading = computed(() => myQuizzesStore.loading);

const onEditQuiz = () => {
  router.push(`/create-edit-quiz/${id.value}`);
};
</script>

<style lang="scss">
.attribute-label {
  width: 200px;
  display: inline-block;
}
</style>
