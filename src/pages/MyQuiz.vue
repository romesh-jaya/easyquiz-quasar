<template>
  <PageContainerResponsive>
    <div v-if="loading" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="myQuizWithDetails">
      <div class="quiz-header">
        <h3 class="text-h4 text-accent heading">
          {{ myQuizWithDetails.quizName }}
        </h3>
        <q-btn
          dense
          round
          label="..."
          aria-label="Menu"
          class="text-accent menu-button"
        >
          <q-menu auto-close fit class="text-accent text-subtitle1">
            <q-list style="min-width: 200px">
              <q-item
                clickable
                :disable="myQuizWithDetails?.statusDB === 'archived'"
                @click="onDemoQuiz"
              >
                <q-item-section>Demo Quiz</q-item-section>
              </q-item>
              <q-item
                clickable
                :disable="updatesNotAllowed"
                @click="onEditQuiz"
              >
                <q-item-section>Edit Quiz Details</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                :disable="
                  myQuizWithDetails?.statusDB === 'published' ||
                  myQuizWithDetails?.statusDB === 'archived'
                "
                clickable
                @click="onStateChange('published')"
              >
                <q-item-section>Publish</q-item-section>
              </q-item>
              <q-item
                :disable="
                  myQuizWithDetails?.statusDB === 'unpublished' ||
                  myQuizWithDetails?.statusDB === 'archived'
                "
                clickable
                @click="onStateChangePending('unpublished')"
              >
                <q-item-section>Unpublish</q-item-section>
              </q-item>
              <q-item
                :disable="myQuizWithDetails?.statusDB === 'archived'"
                clickable
                @click="onStateChangePending('archived')"
              >
                <q-item-section>Archive</q-item-section>
              </q-item>
              <q-separator />
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <q-card>
        <q-card-section class="q-pa-xs">
          <div class="text-body2 q-pa-md">
            {{ myQuizWithDetails.description }}
          </div>
          <q-separator />
          <div class="q-pa-md">
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Last Updated:</span>
              {{ getLastUpdatedHumanized(myQuizWithDetails.lastUpdated) }}
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Pass Mark Percentage: </span
              >{{ myQuizWithDetails.passMarkPercentage }}%
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Status: </span
              >{{ myQuizWithDetails.status }}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-separator />
      <div class="q-my-xl button-container">
        <q-toggle
          v-if="myQuizWithDetails.questions.length > 1 && !updatesNotAllowed"
          v-model="questionSortMode"
          label="Sort questions mode"
          class="toggle"
        />
        <q-btn
          :disabled="questionSortMode || saving || updatesNotAllowed"
          color="secondary"
          icon="add_circle_outline"
          class="add-question"
          @click="onAddQuestion"
          >Add Question</q-btn
        >
      </div>
      <h3 class="text-h5 text-accent">
        Questions
        <span v-if="myQuizWithDetails.questions.length !== 0">{{
          ` (${myQuizWithDetails.questions.length})`
        }}</span>
      </h3>
      <div v-if="myQuizWithDetails.questions.length === 0" class="q-mt-xl">
        <p v-if="!updatesNotAllowed">
          No questions have been added yet. Press Add Question to add a
          question.
        </p>
      </div>
      <div v-else>
        <div v-if="questionSortMode">
          <SortableVue
            :list="questionsList"
            item-key="id"
            tag="div"
            :options="sortableOptions"
            @end="onOrderChanged"
          >
            <template #item="{ element, index }">
              <q-input
                v-model="element.questionContent"
                filled
                readonly
                :label="'Question ' + (index + 1)"
                class="draggable q-my-lg"
              />
            </template>
          </SortableVue>
        </div>
        <div
          v-for="(item, index) in questionsList"
          v-else
          :key="index"
          class="input-textarea question-container q-my-lg"
        >
          <q-input
            v-model="item.questionContent"
            outlined
            :label="'Question ' + (index + 1)"
            class="question"
            readonly
            @click="onEditQuestion(item.id)"
          />
        </div>
      </div>
      <div class="q-my-xl button-container">
        <q-btn
          v-if="myQuizWithDetails.questions.length > 1 && !updatesNotAllowed"
          color="secondary"
          :loading="saving"
          :disabled="!questionSortMode"
          @click="onSubmit"
          >Save question order</q-btn
        >
        <q-btn
          color="accent"
          :disabled="saving"
          @click="$router.push('/my-quizzes')"
          >Back</q-btn
        >
      </div>
    </div>
    <div v-else>
      <div class="q-mt-xl">
        <p>{{ error ?? 'Quiz not found' }}</p>
      </div>
    </div>
    <div>
      <q-dialog v-model="showStatusChangeConfirmDialog" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="help_outline" color="primary" text-color="white" />
            <span class="q-ml-sm"
              >{{
                pendingStatusChangeTo === 'unpublished'
                  ? 'Are you sure you wish to Unpublish this question? Any unaccepted invitations will not be able to access this quiz.'
                  : 'Are you sure you wish to Archive this question? No further changes will be possible.'
              }}
            </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="No" color="accent" />
            <q-btn
              v-close-popup
              flat
              label="Yes"
              color="accent"
              @click="onStateChange('')"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { computed, toRefs, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { Sortable as SortableVue } from 'sortablejs-vue3';
import type { SortableOptions } from 'sortablejs';
import Sortable from 'sortablejs';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';
import { saveQuestionOrder, updateQuizStatus } from '../api';
import { useMyQuizzesStore } from '../stores/myQuizzes';
import { getLastUpdatedHumanized } from '../utils/common';

interface IQuestionInfo {
  questionContent: string;
  id: string;
}

const props = defineProps({
  id: { type: String, required: false, default: '' },
});

const { id } = toRefs(props);

const $q = useQuasar();
const router = useRouter();
const myQuizzesStore = useMyQuizzesStore();
const myQuizWithDetailsStore = useMyQuizWithDetailsStore();
const myQuizWithDetails = computed(
  () => myQuizWithDetailsStore.myQuizWithDetails
);
const questionsList = ref<IQuestionInfo[]>(
  myQuizWithDetails.value
    ? myQuizWithDetails.value.questions.map((question) => ({
        questionContent: question.questionContent,
        id: question.id,
      }))
    : []
);
const loading = computed(() => myQuizWithDetailsStore.loading);
const error = ref('');
const questionSortMode = ref(false);
const saving = ref(false);
const updatesNotAllowed = computed(
  () =>
    myQuizWithDetails.value?.statusDB === 'archived' ||
    myQuizWithDetails.value?.statusDB === 'published'
);
const showStatusChangeConfirmDialog = ref(false);
const pendingStatusChangeTo = ref('');

watch(myQuizWithDetails, () => {
  if (myQuizWithDetails.value) {
    questionsList.value = myQuizWithDetails.value.questions.map((question) => ({
      questionContent: question.questionContent,
      id: question.id,
    }));
  }
});

const sortableOptions = computed<SortableOptions>(() => {
  return {
    disabled: saving.value || !questionSortMode.value,
    draggable: '.draggable',
    ghostClass: 'ghost',
    dragClass: 'drag',
  };
});

const moveItemInArray = (array: IQuestionInfo[], from: number, to: number) => {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item);
};

const onStateChangePending = (newStatus: string) => {
  showStatusChangeConfirmDialog.value = true;
  pendingStatusChangeTo.value = newStatus;
};

const onStateChange = async (newState?: string) => {
  console.log('newState', newState);
  console.log('pendingStatusChangeTo.value', pendingStatusChangeTo.value);
  const changeStateTo = newState ?? pendingStatusChangeTo.value;
  if (changeStateTo === 'published' && questionsList.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'Cannot publish a quiz without any questions',
    });
    return;
  }

  saving.value = true;

  try {
    const response = await updateQuizStatus(changeStateTo, id.value);

    if (response.error) {
      $q.notify({
        type: 'negative',
        message: response.error,
      });
      return;
    }

    myQuizzesStore.setDataStale();
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while trying to save quiz',
    });
    return;
  } finally {
    saving.value = false;
  }

  fetchQuizWithDetails(true);
};

const onOrderChanged = (event: Sortable.SortableEvent) => {
  // Have to manually move the items in the array according to https://github.com/MaxLeiter/sortablejs-vue3
  moveItemInArray(
    questionsList.value,
    event.oldIndex || 0,
    event.newIndex || 0
  );
};

const onSubmit = async () => {
  saving.value = true;

  try {
    const questionOrder = questionsList.value.map((question) => question.id);
    const response = await saveQuestionOrder(questionOrder, id.value);

    if (response.error) {
      $q.notify({
        type: 'negative',
        message: response.error,
      });
      return;
    }

    $q.notify({
      type: 'positive',
      message: 'Question order saved',
    });

    myQuizzesStore.setDataStale();
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while trying to save quiz',
    });
    return;
  } finally {
    saving.value = false;
  }

  fetchQuizWithDetails(true);
};

const fetchQuizWithDetails = async (forceFetch = false) => {
  try {
    await myQuizWithDetailsStore.fetchQuiz(id.value, forceFetch);
  } catch (err) {
    console.error(err);
    error.value = 'Error loading quiz';
  }
};

const onDemoQuiz = () => {
  router.push(`${router.currentRoute.value.path}/demo-quiz`);
};

const onEditQuiz = () => {
  router.push(`/create-edit-quiz/${id.value}`);
};

const onEditQuestion = (questionId: string) => {
  router.push(
    `${router.currentRoute.value.path}/create-edit-question/${questionId}`
  );
};

const onAddQuestion = () => {
  router.push(`${router.currentRoute.value.path}/create-edit-question`);
};

onMounted(() => {
  fetchQuizWithDetails();
});
</script>

<style lang="scss">
.attribute-label {
  width: 200px;
  display: inline-block;
}

.question-container {
  display: flex;
  place-items: center;
}

.question {
  flex: 1;
  padding-bottom: 0 !important;
  input {
    cursor: pointer !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.add-question {
  i {
    margin-right: 10px;
  }
}

.toggle {
  flex: 1;
  justify-content: center;
}

.quiz-header {
  display: flex;
  place-items: center;
}

.heading {
  flex: 1;
}

.menu-button {
  height: 32px;
}
</style>
