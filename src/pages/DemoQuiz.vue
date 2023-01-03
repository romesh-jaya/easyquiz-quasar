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
        <QuizStartPage v-if="quizPhase === QuizPhase.START_PAGE" />
        <QuestionAndAnswers
          v-else-if="quizPhase === QuizPhase.IN_PROGRESS && currentQuestion"
          :question-content="currentQuestion.questionContent"
          :multiple-answers-exist="
            currentQuestion.answers.filter((answer) => answer.isCorrect)
              .length > 1
          "
          :answers="currentQuestion.answers.map((answer) => answer.answer)"
          :heading="`Question ${currentQuestionIndex + 1}/${questions.length}`"
          :answers-selected="
            answersSelectedForAllQuestions[currentQuestionIndex]
          "
          @answers-selected="onAnswersSelected"
        />
        <QuizResultsPage
          v-else-if="quizPhase === QuizPhase.RESULTS_PAGE"
          :no-of-total-questions="questions.length"
          :no-of-correct-answers="noOfCorrectAnswers"
          :pass-mark-percentage="demoQuiz.passMarkPercentage"
        />
        <AnswersReview
          v-else-if="quizPhase === QuizPhase.VIEW_ANSWERS && currentQuestion"
          :question-content="currentQuestion.questionContent"
          :correct-answers-indexes="
            correctAnswers ? correctAnswers[currentQuestionIndex] : []
          "
          :answers="currentQuestion.answers.map((answer) => answer.answer)"
          :heading="`Question ${currentQuestionIndex + 1}/${questions.length}`"
          :answers-selected-indexes="
            answersSelectedForAllQuestions[currentQuestionIndex]
          "
        />
      </div>
      <div class="q-my-xl button-container quiz-button-container">
        <div class="exit-button-container">
          <q-btn
            id="btn-exit"
            color="accent"
            @click="onPendingQuizActionChange('EXIT_QUIZ')"
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
    <div>
      <CustomDialog
        :show-dialog="showActionConfirmDialog"
        negative-label="No"
        positive-label="Yes"
        @negative-button-clicked="showActionConfirmDialog = false"
        @positive-button-clicked="onActionConfirm"
      >
        <span class="q-ml-sm"
          >{{
            `Are you sure you wish to ${
              pendingQuizAction === 'EXIT_QUIZ' ? 'exit' : 'finish'
            } the quiz?`
          }}
        </span>
      </CustomDialog>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
//import { useQuasar } from 'quasar';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';
import { QuizPhase } from '../enums/QuizPhase';
import QuizStartPage from '../components/QuizStartPage.vue';
import CustomDialog from '../components/CustomDialog.vue';
import QuestionAndAnswers from '../components/QuestionAndAnswers.vue';
import QuizResultsPage from '../components/QuizResultsPage.vue';
import AnswersReview from '../components/AnswersReview.vue';
import { IQuestion } from '../interfaces/IQuestion';
import {
  getNoOfCorrectAnswers,
  getAnswersComputedIndexes,
} from '../utils/scores';

const router = useRouter();
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
const answersSelectedForAllQuestions = ref<number[][]>(
  myQuizWithDetailsStore.myQuizWithDetails?.questions
    ? Array.from({ length: questions.value.length }, () => [])
    : []
);
const currentQuestion = ref<IQuestion | undefined>();
const currentQuestionIndex = ref<number>(-1);
const loading = computed(() => myQuizWithDetailsStore.loading);
const error = ref('');
const quizPhase = ref<QuizPhase>(QuizPhase.START_PAGE);
const pendingQuizAction = ref('');
const showActionConfirmDialog = ref(false);
const noOfCorrectAnswers = ref(0);
const correctAnswers = ref<number[][] | undefined>();

watch(demoQuiz, () => {
  if (demoQuiz.value) {
    questions.value = demoQuiz.value.questions;
  }
});

watch(questions, () => {
  answersSelectedForAllQuestions.value = Array.from(
    { length: questions.value.length },
    () => []
  );
});

const isBackButtonVisible = computed(
  () =>
    (quizPhase.value === QuizPhase.IN_PROGRESS ||
      quizPhase.value === QuizPhase.VIEW_ANSWERS) &&
    currentQuestionIndex.value !== 0
);

const nextButtonLabel = computed(() => {
  if (quizPhase.value === QuizPhase.START_PAGE) {
    return 'Start Quiz';
  }
  if (quizPhase.value === QuizPhase.RESULTS_PAGE) {
    return 'Review Answers';
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

const onAnswersSelected = (answersSelected: number[]) => {
  answersSelectedForAllQuestions.value[currentQuestionIndex.value] =
    answersSelected;
};

const onPendingQuizActionChange = (action: string) => {
  showActionConfirmDialog.value = true;
  pendingQuizAction.value = action;
};

const onActionConfirm = () => {
  showActionConfirmDialog.value = false;
  if (pendingQuizAction.value === 'EXIT_QUIZ') {
    router.go(-1);
    return;
  }
  noOfCorrectAnswers.value = getNoOfCorrectAnswers(
    questions.value,
    answersSelectedForAllQuestions.value
  );
  correctAnswers.value = getAnswersComputedIndexes(questions.value);
  quizPhase.value = QuizPhase.RESULTS_PAGE;
};

const onBack = () => {
  currentQuestionIndex.value -= 1;
  currentQuestion.value = questions.value[currentQuestionIndex.value];
};

const onNext = () => {
  if (quizPhase.value === QuizPhase.START_PAGE) {
    quizPhase.value = QuizPhase.IN_PROGRESS;
    currentQuestionIndex.value = 0;
    currentQuestion.value = questions.value[0];
    return;
  }

  if (quizPhase.value === QuizPhase.IN_PROGRESS) {
    if (currentQuestionIndex.value === questions.value.length - 1) {
      onPendingQuizActionChange('FINISH_QUIZ');
      return;
    }
    currentQuestionIndex.value += 1;
    currentQuestion.value = questions.value[currentQuestionIndex.value];
    return;
  }

  if (quizPhase.value === QuizPhase.VIEW_ANSWERS) {
    if (currentQuestionIndex.value === questions.value.length - 1) {
      router.go(-1);
      return;
    }
    currentQuestionIndex.value += 1;
    currentQuestion.value = questions.value[currentQuestionIndex.value];
    return;
  }

  if (quizPhase.value === QuizPhase.RESULTS_PAGE) {
    quizPhase.value = QuizPhase.VIEW_ANSWERS;
    currentQuestionIndex.value = 0;
    currentQuestion.value = questions.value[0];
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
