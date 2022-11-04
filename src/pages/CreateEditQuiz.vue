<template>
  <div class="text-center">
    <h3 class="text-h4 text-accent">Create quiz</h3>
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
      @update:model-value="onFieldChange"
    />
    <q-input
      ref="passMarkPercentageRef"
      v-model="passMarkPercentage"
      outlined
      label="Pass Mark Percentage"
      :rules="[
        (val) => !!val || '* Required',
        (val) => val <= 100 || 'Please use a value less or equal to 100',
      ]"
      lazy-rules
      class="input-field"
      onkeypress="return event.charCode >= 48 && event.charCode <= 57"
      @update:model-value="onFieldChange"
    />
    <q-btn
      color="accent"
      class="q-mt-md"
      :loading="loading || loadingAuth"
      @click="onSubmit"
      >Create</q-btn
    >
    <div
      v-if="generalError"
      class="q-field__bottom q-mt-md q-mx-auto email-exists"
    >
      {{ generalError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { saveQuizData } from '../api';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const quizName = ref('');
const quizNameRef = ref();
const description = ref('');
const descriptionRef = ref();
const passMarkPercentage = ref(0);
const passMarkPercentageRef = ref();
const generalError = ref('');
//const router = useRouter();
const $q = useQuasar();
const loading = ref(false);
const loadingAuth = computed(() => authStore.loading);

const saveQuiz = async () => {
  loading.value = true;
  const errorInfo = await saveQuizData(
    quizName.value,
    description.value,
    passMarkPercentage.value
  );
  loading.value = false;
  if (errorInfo.error) {
    if (errorInfo.isGeneralError) {
      generalError.value = errorInfo.error;
      return;
    }
    $q.notify({
      type: 'negative',
      message: errorInfo.error,
    });
    return;
  }
  //router.push('/login');
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
</script>

<style lang="scss"></style>
