<template>
  <PageContainerResponsive>
    <div v-if="loadingAuth || loadingMyQuizzes" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="myQuizForEdit">
      <q-breadcrumbs class="q-my-lg">
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el :label="myQuizForEdit.quizName" />
        <q-breadcrumbs-el
          :label="myQuizForEdit ? 'Edit question' : 'Create question'"
        />
      </q-breadcrumbs>
      <q-input
        ref="questionContentRef"
        v-model="questionContent"
        outlined
        label="Question Content"
        :rules="[
          (val) => !!val || '* Required',
          (val) => val.length <= 16 || 'Please use maximum 1000 characters',
        ]"
        lazy-rules
        class="input-textarea"
        type="textarea"
      />
      <div class="q-mt-md button-container">
        <q-btn color="secondary" :loading="loading" @click="onSubmit">{{
          myQuizForEdit ? 'Save question' : 'Create'
        }}</q-btn>
        <q-btn color="accent" @click="$router.go(-1)">Back</q-btn>
      </div>
    </div>
    <div v-else>
      <div class="q-mt-xl">
        <p>Quiz not found</p>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
// import { useRouter } from 'vue-router';
//import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';
import { useMyQuizzesStore } from '../stores/myQuizzes';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';

const authStore = useAuthStore();
const myQuizzesStore = useMyQuizzesStore();
// const router = useRouter();
//const $q = useQuasar();

const props = defineProps({
  quizId: { type: String, required: false, default: '' },
});

const { quizId } = toRefs(props);

const myQuizForEdit = computed(() =>
  myQuizzesStore.myQuizzes.find((quiz) => quiz.id === quizId.value)
);

const questionContent = ref(myQuizForEdit.value?.quizName);
const questionContentRef = ref();
const loading = ref(false);
const loadingAuth = computed(() => authStore.loading);
const loadingMyQuizzes = computed(() => myQuizzesStore.loading);

/*
watch(myQuizForEdit, () => {
  if (myQuizForEdit.value) {
    quizName.value = myQuizForEdit.value.quizName;
    description.value = myQuizForEdit.value.description;
    passMarkPercentage.value = myQuizForEdit.value.passMarkPercentage;
  }
});
*/

const onSubmit = () => {
  questionContentRef.value.validate();

  if (questionContentRef.value.hasError) {
    return;
  }
  // saveQuiz();
};
</script>

<style lang="scss">
.button-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
