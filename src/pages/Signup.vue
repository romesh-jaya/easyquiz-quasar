<template>
  <div class="text-center">
    <h3 class="text-h4 text-accent">Create account</h3>
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
    <PasswordWithConfirm
      ref="passwordWithConfirmRef"
      @password-update="onFieldChange"
    />
    <q-btn color="accent" class="q-mt-md" :loading="loading" @click="onSubmit"
      >Create</q-btn
    >
    <div
      v-if="generalError"
      class="q-field__bottom q-mt-md q-mx-auto email-exists"
    >
      {{ generalError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { emailValid } from '../utils/email';
import { useAuthStore } from '../stores/auth';
import PasswordWithConfirm from '../components/PasswordWithConfirm.vue';

const email = ref('');
const emailRef = ref();
const passwordWithConfirmRef = ref();
const generalError = ref('');
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const loading = ref(false);

const register = async (email: string, password: string) => {
  loading.value = true;
  const errorInfo = await authStore.registerUser(email, password);
  loading.value = false;
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
  const passwordWithConfirmData =
    passwordWithConfirmRef.value.getPasswordOrError();

  if (emailRef.value.hasError || passwordWithConfirmData.validationError) {
    return;
  }

  if (passwordWithConfirmData.errorMessage) {
    generalError.value = passwordWithConfirmData.errorMessage;
    return;
  }
  register(email.value, passwordWithConfirmData.password);
};

const onFieldChange = () => {
  generalError.value = '';
};

const emailValidateSuccess = () => {
  return emailValid(email.value) || 'Please enter a valid email address';
};
</script>

<style lang="scss"></style>
