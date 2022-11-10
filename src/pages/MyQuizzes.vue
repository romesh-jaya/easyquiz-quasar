<template>
  <div class="text-center q-mb-lg">
    <div class="create-quiz-container container-responsive">
      <q-btn
        color="accent"
        class="q-mt-xl"
        :disabled="loading"
        @click="onCreateQuiz"
        >Create Quiz</q-btn
      >
    </div>
    <h3 class="text-h4 text-accent">My Quizzes</h3>

    <div class="q-gutter-md q-mt-md container-responsive">
      <div v-if="loading">
        <q-skeleton height="20px" />
        <q-skeleton height="150px" />
        <q-skeleton height="20px" />
      </div>
      <div class="quiz-container">
        <QuizOverview
          v-for="myQuiz in myQuizzes"
          :key="myQuiz"
          :title="myQuiz.name"
          :description="myQuiz.description"
        />
        <p v-if="!loading && myQuizzes.length === 0">
          You currently have not created any quizzes. Click Create Quiz to
          create your first Quiz!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import QuizOverview from '../components/QuizOverview.vue';
import { useMyQuizzesStore } from '../stores/myQuizzes';

const router = useRouter();
const myQuizzesStore = useMyQuizzesStore();
const myQuizzes = computed(() => myQuizzesStore.myQuizzes);
const loading = computed(() => myQuizzesStore.loading);

const onCreateQuiz = async () => {
  router.push('/create-edit-quiz');
};
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
