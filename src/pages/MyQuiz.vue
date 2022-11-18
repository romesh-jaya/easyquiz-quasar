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
              {{ getLastUpdatedHumanized() }}
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Pass Mark Percentage: </span
              >{{ myQuiz.passMarkPercentage }}%
            </div>
            <div class="text-body2 q-pa-xs text-left flex">
              <span class="attribute-label">Status: </span
              >{{
                QuizStatus.find((status) => status.dbValue === myQuiz?.statusDB)
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

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import humanizeDuration from 'humanize-duration';
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

const getLastUpdatedHumanized = () => {
  let timeDiffMs: number;
  let durationHumanFriendly = 'unknown';
  let lastRefreshedText = '';

  if (myQuiz.value && myQuiz.value.lastUpdated) {
    timeDiffMs = new Date().getTime() - myQuiz.value.lastUpdated.getTime();
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
</script>

<style lang="scss">
.attribute-label {
  width: 200px;
  display: inline-block;
}
</style>
