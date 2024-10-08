<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header bg-white">
      <q-toolbar class="container-responsive">
        <q-btn to="/" flat no-caps class="title">
          <q-avatar>
            <img src="../assets/logo.svg" />
          </q-avatar>
          <q-toolbar-title class="text-accent"> EasyQuiz </q-toolbar-title>
        </q-btn>
        <div v-if="!loadingAuth && isLoggedIn" class="link-container gt-xs">
          <div>
            <q-btn
              to="/my-quizzes"
              label="My Quizzes"
              flat
              color="white"
              text-color="accent"
              no-caps
              class="text-subtitle1"
            />
          </div>
        </div>
        <div>
          <q-btn
            v-if="!loadingAuth && isLoggedIn"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            class="text-accent"
          >
            <q-menu auto-close fit class="text-accent text-subtitle1">
              <q-list style="min-width: 200px">
                <q-item disabled>
                  <q-item-section class="text-subtitle2 welcome"
                    >Welcome, {{ firstName }}</q-item-section
                  >
                </q-item>
                <q-separator class="xs" />
                <q-item clickable to="/my-quizzes" class="xs">
                  <q-item-section>My Quizzes</q-item-section>
                </q-item>
                <q-item clickable class="xs">
                  <q-item-section>Others Quizzes</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section @click="onLogout">Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="linear-progress-container">
        <q-linear-progress v-if="loadingAuth" indeterminate color="accent" />
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const loadingAuth = computed(() => authStore.loading);
const isLoggedIn = computed(() => !!authStore.quizUser);
const firstName = computed(() => authStore.quizUser?.firstName);
const router = useRouter();

const onLogout = async () => {
  await authStore.logOut();
  router.push('/');
};
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
  @media (max-width: $breakpoint-xs-max) {
    flex: 1 !important;
  }
}

.link-container {
  display: flex;
  flex: 1;
}

.welcome {
  white-space: nowrap;
  overflow: hidden;
}

.linear-progress-container {
  /* prevent CLS */
  position: absolute;
  width: 100%;
  z-index: 1000;
}
</style>
