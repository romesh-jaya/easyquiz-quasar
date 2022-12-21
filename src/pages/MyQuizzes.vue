<template>
  <PageContainerResponsive>
    <div class="create-quiz-container">
      <q-btn
        color="accent"
        class="q-mt-lg"
        :disabled="loading"
        @click="onCreateQuiz"
        >Create Quiz</q-btn
      >
    </div>
    <h3 class="text-h4 text-accent">My Quizzes</h3>
    <div class="q-mt-md">
      <div v-if="loading" class="q-gutter-y-md">
        <q-skeleton height="20px" />
        <q-skeleton height="150px" />
        <q-skeleton height="20px" />
      </div>
      <div v-else-if="error" class="q-mt-xl">
        <p>{{ error }}</p>
      </div>
      <div v-else class="quiz-container">
        <QuizOverview
          v-for="myQuiz in myQuizzes"
          :id="myQuiz.id"
          :key="myQuiz"
          :title="myQuiz.quizName"
          :description="myQuiz.description"
          :status="myQuiz.status"
          :status-db="myQuiz.statusDB"
        />
        <p v-if="!loading && myQuizzes.length === 0">
          You currently have not created any quizzes. Click Create Quiz to
          create your first Quiz!
        </p>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import QuizOverview from '../components/QuizOverview.vue';
import { useMyQuizzesStore } from '../stores/myQuizzes';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';

const router = useRouter();
const myQuizzesStore = useMyQuizzesStore();
const myQuizzes = computed(() => myQuizzesStore.myQuizzes);
const loading = computed(() => myQuizzesStore.loading);
const error = ref('');

const fetchQuizzes = async () => {
  try {
    await myQuizzesStore.fetchQuizzes();
  } catch (err) {
    console.error(err);
    error.value = 'Error loading quizzes';
  }
};

const onCreateQuiz = async () => {
  router.push('/create-edit-quiz');
};

onMounted(() => {
  fetchQuizzes();
});
</script>

<style lang="scss">
.quiz-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.create-quiz-container {
  text-align: right;
  @media (max-width: $breakpoint-xs-max) {
    text-align: center;
  }
}
</style>
