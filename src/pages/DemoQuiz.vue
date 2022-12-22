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
      <div class="q-mt-md button-container">
        <q-btn color="accent" :disabled="loading" @click="$router.go(-1)"
          >Exit Quiz</q-btn
        >
        <q-btn color="accent" :disabled="loading" @click="onBack">Back</q-btn>
        <q-btn color="secondary" :loading="loading" @click="onNext">{{
          demoQuiz ? 'Save quiz' : 'Create'
        }}</q-btn>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted } from 'vue';
//import { useRouter } from 'vue-router';
//import { useQuasar } from 'quasar';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';

// const router = useRouter();
// const $q = useQuasar();

const props = defineProps({
  quizId: { type: String, required: false, default: '' },
});

const { quizId } = toRefs(props);
const myQuizWithDetailsStore = useMyQuizWithDetailsStore();
const demoQuiz = computed(() => myQuizWithDetailsStore.myQuizWithDetails);

const loading = computed(() => myQuizWithDetailsStore.loading);
// const saving = ref(false);
const error = ref('');

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
  return;
};

const onNext = () => {
  return;
};

onMounted(() => {
  fetchQuizWithDetails();
});
</script>

<style lang="scss"></style>
