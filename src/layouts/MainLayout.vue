<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header bg-white">
      <q-toolbar class="container-responsive">
        <q-avatar>
          <img src="../assets/logo.svg" />
        </q-avatar>
        <q-toolbar-title class="text-accent title"> EasyQuiz </q-toolbar-title>
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
            <q-btn
              to="/others-quizzes"
              label="Others Quizzes"
              flat
              color="white"
              text-color="accent"
              class="text-subtitle1"
              no-caps
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
                <q-item clickable class="xs">
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

    <q-page-container v-if="!loadingAuth">
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
  @media #{$xs} {
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
</style>
