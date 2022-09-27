<template>
  <router-view />
</template>

<script setup>
import { auth } from './firebase';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Logged in: ', user.email);
    authStore.setUser(user);
  }
  authStore.setLoading(false);
});
</script>

<style lang="scss">
@import './css/quasar.variables.scss';

html,
body {
  font-size: 1rem;
  color: $text-color;
}
</style>
