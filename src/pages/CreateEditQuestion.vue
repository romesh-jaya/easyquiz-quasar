<template>
  <PageContainerResponsive>
    <div v-if="loading" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="myQuizWithDetails">
      <q-breadcrumbs class="q-my-lg">
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el :label="myQuizWithDetails.quizName" />
        <q-breadcrumbs-el
          :label="questionId ? 'Edit question' : 'Create question'"
        />
      </q-breadcrumbs>
      <q-input
        ref="questionContentRef"
        v-model="questionContent"
        outlined
        label="Question Content"
        :rules="[
          (val) => !!val || '* Required',
          (val) => val.length <= 1000 || 'Please use maximum 1000 characters',
        ]"
        lazy-rules
        class="input-textarea"
        type="textarea"
      />
      <h3 class="text-h5 text-accent">Answers</h3>
      <div class="q-my-lg button-container">
        <q-toggle
          v-model="answerSortMode"
          label="Sort answers mode"
          class="toggle"
          @update:model-value="onSortAnswerToggle"
        />
        <q-btn
          :disabled="answerSortMode"
          color="secondary"
          icon="add_circle_outline"
          class="add-answer"
          @click="onAddAnswer"
          >Add Answer</q-btn
        >
      </div>

      <div v-if="answerSortMode">
        <SortableVue
          :list="answersList"
          item-key="answer"
          tag="div"
          :options="sortableOptions"
          @end="onOrderChanged"
        >
          <template #item="{ element, index }">
            <q-input
              v-model="element.answer"
              filled
              readonly
              :label="'Answer ' + (index + 1)"
              class="draggable q-my-lg"
            />
          </template>
        </SortableVue>
      </div>
      <div v-else>
        <div
          v-for="(item, index) in answersList"
          :key="index"
          class="input-textarea answer-container q-my-lg"
        >
          <q-input
            ref="answersListRef"
            v-model="item.answer"
            outlined
            :label="'Answer ' + (index + 1)"
            :rules="[(val) => !!val || '* Required']"
            lazy-rules
            class="answer"
          />
          <q-toggle
            v-model="item.isCorrect"
            label="Correct answer"
            :indeterminate-value="false"
          />
          <q-btn flat dense round>
            <q-icon
              size="1.5em"
              name="close"
              class="close-icon"
              @click="() => onAnswerRemove(index)"
            />
          </q-btn>
        </div>
      </div>

      <div class="q-my-xl button-container">
        <q-btn color="secondary" :loading="saving" @click="onSubmit">{{
          questionId ? 'Save question' : 'Create'
        }}</q-btn>
        <q-btn
          v-if="questionId"
          color="negative"
          :loading="saving"
          @click="deleteQuestionInternal"
        >
          Delete question
        </q-btn>
        <q-btn color="accent" @click="$router.go(-1)">Back</q-btn>
      </div>
    </div>
    <div v-else>
      <div class="q-mt-xl">
        <p>{{ error ?? 'Quiz not found' }}</p>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted, watch } from 'vue';
import { Sortable as SortableVue } from 'sortablejs-vue3';
import { QInput } from 'quasar';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { SortableOptions } from 'sortablejs';
import Sortable from 'sortablejs';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';
import { saveQuestionData, deleteQuestion } from '../api';
import { IAnswer } from '../interfaces/IAnswer';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';

const router = useRouter();
const $q = useQuasar();

const props = defineProps({
  quizId: { type: String, required: false, default: '' },
  questionId: { type: String, required: false, default: '' },
});

const { quizId, questionId } = toRefs(props);
const myQuizWithDetailsStore = useMyQuizWithDetailsStore();
const myQuizWithDetails = computed(
  () => myQuizWithDetailsStore.myQuizWithDetails
);
const questionMatched = myQuizWithDetails.value?.questions.find(
  (question) => question.id === questionId.value
);
const loading = computed(() => myQuizWithDetailsStore.loading);
const saving = ref(false);
const error = ref('');

const questionContent = ref(
  questionMatched ? questionMatched.questionContent : ''
);
const questionContentRef = ref();
const answersList = ref<IAnswer[]>(
  questionMatched
    ? questionMatched.answers
    : [
        { answer: '', isCorrect: false },
        { answer: '', isCorrect: false },
      ]
);
const answersListRef = ref<QInput[]>([]);
const answerSortMode = ref(false);

watch(myQuizWithDetails, () => {
  if (myQuizWithDetails.value) {
    const questionMatched = myQuizWithDetails.value.questions.find(
      (question) => question.id === questionId.value
    );
    if (questionMatched) {
      questionContent.value = questionMatched.questionContent;
      answersList.value = questionMatched.answers;
    }
  }
});

const sortableOptions = computed<SortableOptions>(() => {
  return {
    draggable: '.draggable',
    ghostClass: 'ghost',
    dragClass: 'drag',
  };
});

const moveItemInArray = (array: IAnswer[], from: number, to: number) => {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item);
};

const onOrderChanged = (event: Sortable.SortableEvent) => {
  // Have to manually move the items in the array according to https://github.com/MaxLeiter/sortablejs-vue3
  moveItemInArray(answersList.value, event.oldIndex || 0, event.newIndex || 0);
};

const doAnswersHaveErrors = () => {
  answersListRef.value.forEach((answerRef) => answerRef.validate());
  return answersListRef.value.find((answerRef) => answerRef.hasError);
};

const onSortAnswerToggle = (isToggleOn: boolean) => {
  if (isToggleOn) {
    if (doAnswersHaveErrors()) {
      answerSortMode.value = false;
    }
  }
};

const onAnswerRemove = (index: number) => {
  answersList.value.splice(index, 1);
};

const onAddAnswer = () => {
  answersList.value.push({ answer: '', isCorrect: false });
};

const browseBackToQuiz = async () => {
  try {
    saving.value = true;
    await myQuizWithDetailsStore.fetchQuiz(quizId.value, true);
    router.push(`/my-quizzes/${quizId.value}`);
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while fetching quiz',
    });
  } finally {
    saving.value = false;
  }
};

const saveQuestion = async () => {
  saving.value = true;

  try {
    const errorInfo = await saveQuestionData(
      quizId.value || '',
      questionContent.value || '',
      JSON.stringify(answersList.value) || '',
      questionId.value
    );

    if (errorInfo.error) {
      $q.notify({
        type: 'negative',
        message: errorInfo.error,
      });
    }
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while trying to save Question',
    });
    return;
  } finally {
    saving.value = false;
  }

  browseBackToQuiz();
};

const deleteQuestionInternal = async () => {
  saving.value = true;

  try {
    const errorInfo = await deleteQuestion(
      quizId.value || '',
      questionId.value
    );

    if (errorInfo.error) {
      $q.notify({
        type: 'negative',
        message: errorInfo.error,
      });
    } else {
      $q.notify({
        type: 'positive',
        message: 'Question deleted',
      });
    }
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while trying to delete Question',
    });
    return;
  } finally {
    saving.value = false;
  }

  browseBackToQuiz();
};

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

const onSubmit = () => {
  questionContentRef.value.validate();
  if (questionContentRef.value.hasError || doAnswersHaveErrors()) {
    return;
  }
  saveQuestion();
};

onMounted(() => {
  fetchQuizWithDetails();
});
</script>

<style lang="scss">
.draggable {
  input {
    cursor: move !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.ghost {
  opacity: 0.5;
  background: #fff;
  border: 1px dashed #ccc;
}

.drag {
  background: var(--q-primary);
}

.close-icon {
  padding: 12px;
  cursor: pointer;
}

.answer-container {
  display: flex;
  place-items: center;
}

.answer {
  flex: 1;
  padding-bottom: 0 !important;
}

.toggle {
  flex: 1;
  justify-content: center;
}

.add-answer {
  i {
    margin-right: 10px;
  }
}
</style>
