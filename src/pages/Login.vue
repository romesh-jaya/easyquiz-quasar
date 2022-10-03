<template>
  <div class="container">
    <h3 class="text-h4 text-accent">Login</h3>
    <q-input
      ref="emailRef"
      v-model="email"
      outlined
      dense
      type="email"
      placeholder="Email"
      :rules="[(val) => !!val || '* Required', emailValidateSuccess]"
      lazy-rules
      class="input-field"
      @update:model-value="onFieldChange"
    />
    <q-input
      ref="passwordRef"
      v-model="password"
      outlined
      dense
      type="password"
      placeholder="Password"
      :rules="[
        (val) => !!val || '* Required',
        (val) => val.length >= 6 || 'Please enter minimum 6 characters',
      ]"
      lazy-rules
      class="input-field"
      @update:model-value="onFieldChange"
    />
    <q-btn color="accent" class="q-mt-md" @click="onSubmit">Login</q-btn>
    <div
      v-if="generalError"
      class="q-field__bottom q-mt-md q-mx-auto email-exists"
    >
      {{ generalError }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { emailValid } from '../utils/email';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const emailRef = ref();
const generalError = ref('');
const password = ref('');
const passwordRef = ref();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const login = async () => {
  const errorInfo = await authStore.logIn(email.value, password.value);
  if (errorInfo.error) {
    if (errorInfo.isGeneralError) {
      generalError.value = errorInfo.error;
      return;
    }
    $q.notify({
      type: 'negative',
      message: errorInfo.error,
    });
    return;
  }
  router.push('/');
};

const onSubmit = () => {
  emailRef.value.validate();
  passwordRef.value.validate();

  if (emailRef.value.hasError || passwordRef.value.hasError) {
    return;
  }

  login();
};

const onFieldChange = () => {
  generalError.value = false;
};

const emailValidateSuccess = () => {
  return emailValid(email.value) || 'Please enter a valid email address';
};
</script>

<style lang="scss">
@import '../css/globals.scss';

.container {
  text-align: center;
}

.input-field {
  max-width: 300px;
  margin: auto;
}

.email-exists {
  max-width: 300px;
  color: var(--q-negative);
  padding: 0 !important;
}
</style>
