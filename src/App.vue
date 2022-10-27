<template>
  <router-view />
</template>

<script setup>
import { auth } from './firebase';
import { onAuthStateChanged } from './utils/auth';

auth.onAuthStateChanged((user) => onAuthStateChanged(user));
</script>

<style lang="scss">
@import './css/quasar.variables.scss';

html,
body {
  font-size: 1rem;
  color: $text-color;
}
</style>
