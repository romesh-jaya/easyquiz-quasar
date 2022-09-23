<template>
  <h1>Create an Account</h1>
  <p>
    <q-input
      ref="emailRef"
      v-model="email"
      type="email"
      placeholder="Email"
      :rules="[(val) => !!val || '* Required', emailValidateSuccess]"
      lazy-rules
      @update:model-value="onFieldChange"
    />
  </p>
  <p>
    <q-input
      ref="passwordRef"
      v-model="password"
      type="password"
      placeholder="Password"
      :rules="[
        (val) => !!val || '* Required',
        (val) => val.length >= 6 || 'Please enter minimum 6 characters',
      ]"
      lazy-rules
      @update:model-value="onFieldChange"
    />
  </p>
  <p><button @click="onSubmit">Sign up</button></p>
  <div v-if="emailAlreadyExists" class="q-field__bottom email-exists">
    Email address is already in use
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { emailValid } from '../utils/email';

const email = ref('');
const emailRef = ref();
const emailAlreadyExists = ref(false);
const password = ref('');
const passwordRef = ref();
const router = useRouter();

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
          emailAlreadyExists.value = true;
          break;
        default:
          alert(errorMessage);
          break;
      }
    });
};

const onSubmit = () => {
  emailRef.value.validate();
  passwordRef.value.validate();

  if (emailRef.value.hasError || passwordRef.value.hasError) {
    return;
  }
  register();
};

const onFieldChange = () => {
  emailAlreadyExists.value = false;
};

const emailValidateSuccess = () => {
  return emailValid(email.value) || 'Please enter a valid email address';
};
</script>

<style lang="scss">
@import '../css/globals.scss';

.email-exists {
  color: var(--q-negative);
  padding: 0 !important;
}
</style>
