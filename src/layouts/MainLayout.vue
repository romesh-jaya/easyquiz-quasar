<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header bg-white">
      <q-toolbar class="container">
        <q-avatar>
          <img src="../assets/logo.svg" />
        </q-avatar>
        <q-toolbar-title class="text-accent title"> EasyQuiz </q-toolbar-title>
        <div class="link-container gt-xs">
          <div>
            <q-btn
              to="/my-quizzes"
              label="My Quizzes"
              flat
              color="white"
              text-color="accent"
            />
            <q-btn
              to="/others-quizzes"
              label="Others Quizzes"
              flat
              color="white"
              text-color="accent"
            />
          </div>
        </div>
        <div>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            class="text-accent"
          />
        </div>
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
@import '../css/globals.scss';

.header {
  display: flex;
  justify-content: center;
  height: 4rem;
}

.title {
  flex: unset !important;
  @media #{$xs} {
    flex: 1 !important;
  }
}

.link-container {
  display: flex;
  flex: 1;
}

.container {
  margin: auto;
  width: 90%;
  max-width: $xl-screen;
}
</style>
