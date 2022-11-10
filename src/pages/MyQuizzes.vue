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

    <div
      v-if="generalError"
      class="q-field__bottom q-mt-md q-mx-auto email-exists"
    >
      {{ generalError }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { getMyQuizzes } from '../api';
import QuizOverview from '../components/QuizOverview.vue';

const router = useRouter();
const $q = useQuasar();
const loading = ref(false);
const generalError = ref('');
const myQuizzes = ref([]);

const fetchQuizzes = async () => {
  loading.value = true;

  try {
    const data = await getMyQuizzes();
    myQuizzes.value = data;
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while fetching quizzes',
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchQuizzes();
});

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
