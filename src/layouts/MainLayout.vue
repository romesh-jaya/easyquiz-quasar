<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header">
      <q-toolbar class="container">
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>
        <q-toolbar-title> EasyQuiz </q-toolbar-title>
        <div><q-btn flat dense round icon="menu" aria-label="Menu" /></div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>

<style lang="scss">
@import '../styles/globals.scss';

.header {
  display: flex;
  height: 4rem;
}

.container {
  margin: auto;
  width: 90%;
  max-width: $xl-screen;
}
</style>
