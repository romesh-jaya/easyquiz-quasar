<template>
  <div class="container">
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
    <q-input
      ref="passwordConfirmRef"
      v-model="passwordConfirm"
      outlined
      dense
      type="password"
      placeholder="Confirm Password"
      :rules="[(val) => !!val || '* Required']"
      lazy-rules
      class="input-field"
      @update:model-value="onFieldChange"
    />
    <q-btn color="accent" @click="onSubmit">Create</q-btn>
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
import { auth } from '../firebase';
import { useQuasar } from 'quasar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { emailValid } from '../utils/email';

const email = ref('');
const emailRef = ref();
const generalError = ref('');
const password = ref('');
const passwordRef = ref();
const passwordConfirm = ref('');
const passwordConfirmRef = ref();
const router = useRouter();
const $q = useQuasar();

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Successfully registered!');
      router.push('/');
    })
    .catch((error) => {
      const errorMessage = 'Unknown error occured while trying to signup.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          generalError.value = 'Email address is already in use';
          break;
        default:
          $q.notify({
            type: 'negative',
            message: errorMessage,
          });
          break;
      }
    });
};

const onSubmit = () => {
  emailRef.value.validate();
  passwordRef.value.validate();
  passwordConfirmRef.value.validate();

  if (
    emailRef.value.hasError ||
    passwordRef.value.hasError ||
    passwordConfirmRef.value.hasError
  ) {
    return;
  }

  if (password.value !== passwordConfirm.value) {
    generalError.value = 'Password and Confirm Password do not match';
    return;
  }
  register();
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
