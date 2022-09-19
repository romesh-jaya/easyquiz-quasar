<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { auth } from './firebase';

export default defineComponent({
  name: 'App',
  setup() {
    auth.onAuthStateChanged((user) => {
      console.log('user', user);
      //store.dispatch('fetchUser', user);
    });
  },
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
