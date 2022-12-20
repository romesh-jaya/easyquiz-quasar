<template>
  <q-page>
    <div class="hero-container bg-primary">
      <q-img src="../assets/hero.jpg" fit="contain">
        <div class="absolute-bottom text-subtitle1 text-center">
          Welcome to the best in-class quiz app solution!
        </div>
      </q-img>
    </div>
    <div v-if="!loadingAuth" class="q-mt-md container-responsive">
      <div v-if="isLoggedIn && !loadingQuizzes">
        <p v-if="myQuizzes.length === 0" class="text-center">
          Click <router-link to="/create-edit-quiz">here</router-link> to start
          your first quiz.
        </p>
        <p v-else class="text-center">
          Click
          <router-link :to="`/my-quizzes/${myQuizzes[0].id}`">here</router-link>
          to keep working on your last quiz,
          {{ myQuizzes[0].quizName }}.
        </p>
      </div>
      <p v-if="!isLoggedIn" class="text-center">
        Existing user? <router-link to="/login">Login</router-link> or
        <router-link to="/signup">Create a free account.</router-link>
      </p>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useMyQuizzesStore } from '../stores/myQuizzes';

const authStore = useAuthStore();
const myQuizzesStore = useMyQuizzesStore();
const isLoggedIn = computed(() => !!authStore.quizUser);
const loadingAuth = computed(() => authStore.loading);
const myQuizzes = computed(() => myQuizzesStore.myQuizzes);
const loadingQuizzes = computed(() => myQuizzesStore.loading);
</script>

<style lang="scss">
.hero-container {
  display: flex;
  height: 420px;
  width: 100%;
}
</style>
