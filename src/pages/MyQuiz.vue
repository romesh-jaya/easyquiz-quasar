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
        <q-btn color="secondary" @click="onEditQuiz">Edit Quiz Details</q-btn>
      </div>
      <q-separator />
      <h3 class="text-h5 text-accent">Questions</h3>
      <div
        v-for="(item, index) in myQuizWithDetails.questions"
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
      <div class="q-my-lg button-container">
        <q-btn color="secondary" @click="onAddQuestion">Add Question</q-btn>
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
import { computed, toRefs, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import humanizeDuration from 'humanize-duration';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';
import { QuizStatus } from '../constants/QuizStatus';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';

const props = defineProps({
  id: { type: String, required: false, default: '' },
});

const { id } = toRefs(props);

const router = useRouter();
const myQuizWithDetailsStore = useMyQuizWithDetailsStore();
const myQuizWithDetails = computed(
  () => myQuizWithDetailsStore.myQuizWithDetails
);
const loading = computed(() => myQuizWithDetailsStore.loading);
const error = ref('');

const fetchQuizWithDetails = async () => {
  try {
    await myQuizWithDetailsStore.fetchQuiz(id.value);
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
</style>
