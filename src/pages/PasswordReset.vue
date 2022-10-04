<template>
  <div class="text-center">
    <h3 class="text-h4 text-accent">Password Reset</h3>
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
    <div class="q-mt-md">
      <q-btn color="accent" @click="onSubmit">Send Password Reset email</q-btn>
      <q-btn color="secondary" class="q-ml-md" @click="router.push('/login')"
        >Back to Login</q-btn
      >
    </div>
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
import { sendPasswordResetEmail } from 'firebase/auth';
import { emailValid } from '../utils/email';
import { auth } from '../firebase';
import { IFirebaseAuthError } from '../interfaces/IFirebaseAuthError';

const email = ref('');
const emailRef = ref();
const generalError = ref('');
const router = useRouter();
const $q = useQuasar();

const reset = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value);
    $q.notify({
      type: 'positive',
      message: `Password reset email sent to ${email.value}`,
    });
  } catch (err) {
    const error = err as IFirebaseAuthError;
    switch (error.code) {
      case 'auth/user-not-found':
        generalError.value = 'Email address not found in database';
        break;
      default:
        $q.notify({
          type: 'negative',
          message:
            'Unknown error occured while trying to send password reset email',
        });
        break;
    }
  }
};

const onSubmit = () => {
  emailRef.value.validate();

  if (emailRef.value.hasError) {
    return;
  }

  reset();
};

const onFieldChange = () => {
  generalError.value = '';
};

const emailValidateSuccess = () => {
  return emailValid(email.value) || 'Please enter a valid email address';
};
</script>

<style lang="scss"></style>
