<template>
  <PageContainerResponsive>
    <div v-if="loading" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="error" class="q-mt-xl">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="demoQuiz">
      <h3 class="text-h4 text-accent">
        {{ `Demo quiz - ${demoQuiz.quizName}` }}
      </h3>
      <div class="inner-container">
        <QuizStartPage v-if="quizPhase === QuizPhase.STARTPAGE" />
      </div>
      <div class="q-my-xl button-container quiz-button-container">
        <div class="exit-button-container">
          <q-btn id="btn-exit" color="accent" @click="$router.go(-1)"
            >Exit Quiz</q-btn
          >
        </div>
        <q-btn
          v-if="isBackButtonVisible"
          id="btn-back"
          color="accent"
          @click="onBack"
          >Back</q-btn
        >
        <q-btn id="btn-next" color="secondary" @click="onNext">{{
          nextButtonLabel
        }}</q-btn>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted, watch } from 'vue';
//import { useRouter } from 'vue-router';
//import { useQuasar } from 'quasar';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';
import { QuizPhase } from '../enums/QuizPhase';
import QuizStartPage from '../components/QuizStartPage.vue';
import { IQuestion } from '../interfaces/IQuestion';

// const router = useRouter();
// const $q = useQuasar();

const props = defineProps({
  quizId: { type: String, required: false, default: '' },
});

const { quizId } = toRefs(props);
const myQuizWithDetailsStore = useMyQuizWithDetailsStore();
const demoQuiz = computed(() => myQuizWithDetailsStore.myQuizWithDetails);
const questions = ref<IQuestion[]>(
  myQuizWithDetailsStore.myQuizWithDetails?.questions || []
);
const currentQuestion = ref<IQuestion | undefined>();
const currentQuestionIndex = ref<number>(-1);

const loading = computed(() => myQuizWithDetailsStore.loading);
const error = ref('');
const quizPhase = ref<QuizPhase>(QuizPhase.STARTPAGE);

watch(demoQuiz, () => {
  if (demoQuiz.value) {
    questions.value = demoQuiz.value.questions;
  }
});

watch(questions, () => {
  console.log('questions', questions.value);
});

watch(currentQuestionIndex, () => {
  console.log('currentQuestionIndex', currentQuestionIndex.value);
});

const isBackButtonVisible = computed(
  () =>
    (quizPhase.value === QuizPhase.IN_PROGRESS ||
      quizPhase.value === QuizPhase.VIEW_ANSWERS) &&
    currentQuestionIndex.value !== 0
);

const nextButtonLabel = computed(() => {
  if (quizPhase.value === QuizPhase.STARTPAGE) {
    return 'Start Quiz';
  }
  if (
    (quizPhase.value === QuizPhase.IN_PROGRESS ||
      quizPhase.value === QuizPhase.VIEW_ANSWERS) &&
    currentQuestionIndex.value !== questions.value.length - 1
  ) {
    return 'Next';
  }

  return 'Finish';
});

const fetchQuizWithDetails = async () => {
  if (quizId.value) {
    try {
      await myQuizWithDetailsStore.fetchQuiz(quizId.value);
    } catch (err) {
      console.error(err);
      error.value = 'Error loading quiz';
    }
  }
};

const onBack = () => {
  currentQuestionIndex.value -= 1;
  currentQuestion.value = questions.value[currentQuestionIndex.value];
};

const onNext = () => {
  if (quizPhase.value === QuizPhase.STARTPAGE) {
    quizPhase.value = QuizPhase.IN_PROGRESS;
    currentQuestionIndex.value = 0;
    currentQuestion.value = questions.value[0];
    return;
  }

  if (quizPhase.value === QuizPhase.IN_PROGRESS) {
    currentQuestionIndex.value += 1;
    currentQuestion.value = questions.value[currentQuestionIndex.value];
    return;
  }
};

onMounted(() => {
  fetchQuizWithDetails();
});
</script>

<style lang="scss">
@import '../css/globals.scss';

.quiz-button-container {
  max-width: $xs-screen;
  margin-left: auto;
  margin-right: auto;
}

.exit-button-container {
  display: flex;
  flex: 1;
}

.inner-container {
  min-height: 300px;
}
</style>
