<template>
  <q-page>
    <div class="hero-container bg-primary">
      <q-img src="../assets/hero.jpg" fit="contain">
        <div class="absolute-bottom text-subtitle1 text-center">
          Welcome to the best in-class quiz app solution!
        </div>
      </q-img>
    </div>
    <div class="q-mt-md container-responsive">
      <p v-if="isLoggedIn" class="text-center">
        Click here to start your first quiz.
      </p>
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

const authStore = useAuthStore();
const isLoggedIn = computed(() => !!authStore.quizUser);
</script>

<style lang="scss">
.hero-container {
  display: flex;
  height: 420px;
  width: 100%;
}
</style>
