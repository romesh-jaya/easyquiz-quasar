<template>
  <PageContainerResponsive>
    <div v-if="loadingMyQuizzes" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="error" class="q-mt-xl">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <h3 class="text-h4 text-accent">
        {{ myQuizForEdit ? 'Edit quiz' : 'Create quiz' }}
      </h3>
      <q-input
        ref="quizNameRef"
        v-model="quizName"
        outlined
        label="Quiz Name"
        :rules="[
          (val) => !!val || '* Required',
          (val) => val.length <= 16 || 'Please use maximum 16 characters',
        ]"
        lazy-rules
        class="input-field"
        :disable="loading"
        @update:model-value="onFieldChange"
      />
      <q-input
        ref="descriptionRef"
        v-model="description"
        outlined
        label="Description"
        :rules="[
          (val) => !!val || '* Required',
          (val) => val.length <= 250 || 'Please use maximum 250 characters',
        ]"
        lazy-rules
        class="input-field"
        :disable="loading"
        @update:model-value="onFieldChange"
      />
      <q-input
        ref="passMarkPercentageRef"
        v-model="passMarkPercentage"
        outlined
        label="Pass Mark %"
        :rules="[
          (val) => !!val || '* Required',
          (val) => val <= 100 || 'Please use a value less or equal to 100',
        ]"
        lazy-rules
        class="input-field"
        mask="###"
        :disable="loading"
        @update:model-value="onFieldChange"
      />
      <div class="q-mt-md button-container">
        <q-btn color="secondary" :loading="loading" @click="onSubmit">{{
          myQuizForEdit ? 'Save quiz' : 'Create'
        }}</q-btn>
        <q-btn color="accent" :disabled="loading" @click="$router.go(-1)"
          >Back</q-btn
        >
      </div>
      <div
        v-if="generalError"
        class="q-field__bottom q-mt-md q-mx-auto email-exists"
      >
        {{ generalError }}
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { saveQuizData } from '../api';
import { useMyQuizzesStore } from '../stores/myQuizzes';
import { useMyQuizWithDetailsStore } from '../stores/myQuizWithDetails';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';

const myQuizzesStore = useMyQuizzesStore();
const myQuizWithDetailsStore = useMyQuizWithDetailsStore();
const myQuizWithDetails = computed(
  () => myQuizWithDetailsStore.myQuizWithDetails
);
const router = useRouter();
const $q = useQuasar();

const props = defineProps({
  id: { type: String, required: false, default: '' },
});

const { id } = toRefs(props);
const error = ref('');

const myQuizForEdit = computed(() =>
  myQuizzesStore.myQuizzes.find((quiz) => quiz.id === id.value)
);

const quizName = ref(myQuizForEdit.value?.quizName);
const quizNameRef = ref();
const description = ref(myQuizForEdit.value?.description);
const descriptionRef = ref();
const passMarkPercentage = ref<number | null | undefined>(
  myQuizForEdit.value?.passMarkPercentage
);
const passMarkPercentageRef = ref();
const generalError = ref('');
const loading = ref(false);
const loadingMyQuizzes = computed(() => myQuizzesStore.loading);

watch(myQuizForEdit, () => {
  if (myQuizForEdit.value) {
    quizName.value = myQuizForEdit.value.quizName;
    description.value = myQuizForEdit.value.description;
    passMarkPercentage.value = myQuizForEdit.value.passMarkPercentage;
  }
});

const saveQuiz = async () => {
  loading.value = true;

  try {
    const response = await saveQuizData(
      quizName.value || '',
      description.value || '',
      passMarkPercentage.value || 0,
      id.value
    );

    if (response.error) {
      if (response.isGeneralError) {
        generalError.value = response.error;
        return;
      }
      $q.notify({
        type: 'negative',
        message: response.error,
      });
      return;
    }

    myQuizzesStore.setDataStale();
    if (myQuizWithDetails.value?.id === id.value) {
      myQuizWithDetailsStore.clearQuiz();
    }
    router.push(`/my-quizzes/${response.id}`);
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while trying to save quiz',
    });
    return;
  } finally {
    loading.value = false;
  }
};

const fetchQuizzes = async () => {
  try {
    await myQuizzesStore.fetchQuizzes();
  } catch (err) {
    console.error(err);
    error.value = 'Error loading quizzes';
  }
};

const onSubmit = () => {
  quizNameRef.value.validate();
  descriptionRef.value.validate();
  passMarkPercentageRef.value.validate();

  if (
    quizNameRef.value.hasError ||
    descriptionRef.value.hasError ||
    passMarkPercentageRef.value.hasError
  ) {
    return;
  }
  saveQuiz();
};

const onFieldChange = () => {
  generalError.value = '';
};

onMounted(() => {
  fetchQuizzes();
});
</script>

<style lang="scss"></style>
