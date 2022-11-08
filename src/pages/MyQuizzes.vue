<template>
  <div class="text-center">
    <h3 class="text-h4 text-accent">My Quizzes</h3>

    <div
      v-if="generalError"
      class="q-field__bottom q-mt-md q-mx-auto email-exists"
    >
      {{ generalError }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getMyQuizzes } from '../api';

const $q = useQuasar();
const loading = ref(false);
const generalError = ref('');

const fetchQuizzes = async () => {
  loading.value = true;

  try {
    const data = await getMyQuizzes();
    console.log('data', data);
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Unknown error occured while fetching quizzes',
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchQuizzes();
});
</script>

<style lang="scss"></style>
