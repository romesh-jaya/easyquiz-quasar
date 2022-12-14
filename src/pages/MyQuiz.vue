<template>
  <PageContainerResponsive>
    <div v-if="loading" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="myQuizWithDetails">
      <h3 class="text-h4 text-accent">{{ myQuizWithDetails.quizName }}</h3>
      <q-card>
        <q-card-section class="q-pa-xs">
          <div class="text-body2 q-pa-md">
            {{ myQuizWithDetails.description }}
          </div>
          <q-separator />
          <div class="q-pa-md">
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Last Updated:</span>
              {{ getLastUpdatedHumanized() }}
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Pass Mark Percentage: </span
              >{{ myQuizWithDetails.passMarkPercentage }}%
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Status: </span
              >{{
                QuizStatus.find(
                  (status) => status.dbValue === myQuizWithDetails?.statusDB
                )?.clientValue
              }}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-my-lg button-container">
        <q-btn color="accent" :disabled="saving" @click="onEditQuiz"
          >Edit Quiz Details</q-btn
        >
      </div>
      <q-separator />
      <div class="q-my-lg button-container">
        <q-toggle
          v-if="myQuizWithDetails.questions.length > 1"
          v-model="questionSortMode"
          label="Sort questions mode"
          class="toggle"
        />
        <q-btn
          :disabled="questionSortMode || saving"
          color="secondary"
          icon="add_circle_outline"
          class="add-question"
          @click="onAddQuestion"
          >Add Question</q-btn
        >
      </div>
      <h3 class="text-h5 text-accent">Questions</h3>
      <div v-if="myQuizWithDetails.questions.length === 0" class="q-mt-xl">
        <p>
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
        <div class="q-my-xl button-container">
          <q-btn
            v-if="myQuizWithDetails.questions.length > 1"
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
    </div>
    <div v-else>
      <div class="q-mt-xl">
        <p>{{ error ?? 'Quiz not found' }}</p>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { computed, toRefs, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import humanizeDuration from 'humanize-duration';
import { Sortable as SortableVue } from 'sortablejs-vue3';
import type { SortableOptions } from 'sortablejs';
import Sortable from 'sortablejs';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';
import { QuizStatus } from '../constants/QuizStatus';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';
import { saveQuestionOrder } from '../api';
import { useMyQuizzesStore } from '../stores/myQuizzes';

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

const getLastUpdatedHumanized = () => {
  let timeDiffMs: number;
  let durationHumanFriendly = 'unknown';
  let lastRefreshedText = '';

  if (myQuizWithDetails.value && myQuizWithDetails.value.lastUpdated) {
    timeDiffMs =
      new Date().getTime() - myQuizWithDetails.value.lastUpdated.getTime();
    if (timeDiffMs / 1000 < 60) {
      // in the last minute
      lastRefreshedText = 'Just now';
    } else {
      durationHumanFriendly = humanizeDuration(timeDiffMs, {
        largest: 1,
      });
      lastRefreshedText = `${durationHumanFriendly} ago`;
    }
  }

  return lastRefreshedText;
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
</style>
