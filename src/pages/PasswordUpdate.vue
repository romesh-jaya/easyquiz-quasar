<template>
  <div class="text-center">
    <h3 class="text-h4 text-accent">Update Password</h3>
    <q-input
      ref="oldPasswordRef"
      v-model="oldPassword"
      outlined
      dense
      type="password"
      placeholder="Old Password"
      :rules="[(val) => !!val || '* Required']"
      lazy-rules
      class="input-field"
      @update:model-value="onFieldChange"
    />
    <PasswordWithConfirm
      ref="passwordWithConfirmRef"
      @password-update="onFieldChange"
    />
    <q-btn color="accent" class="q-mt-md" :loading="loading" @click="onSubmit"
      >Update</q-btn
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
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../firebase';
import PasswordWithConfirm from '../components/PasswordWithConfirm.vue';
import { IFirebaseAuthError } from '../interfaces/IFirebaseAuthError';

const oldPassword = ref('');
const oldPasswordRef = ref();
const passwordWithConfirmRef = ref();
const generalError = ref('');
const router = useRouter();
const $q = useQuasar();
const loading = ref(false);

const update = async (oldPassword: string, newPassword: string) => {
  if (!auth.currentUser) {
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email || '',
      oldPassword
    );
    loading.value = true;
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
    $q.notify({
      type: 'positive',
      message: 'Password updated',
    });
    router.push('/');
  } catch (err) {
    const error = err as IFirebaseAuthError;
    switch (error.code) {
      case 'auth/wrong-password':
        generalError.value = 'Old password is incorrect';
        break;
      default:
        $q.notify({
          type: 'negative',
          message: 'Unknown error occured while trying to update password',
        });
        break;
    }
  } finally {
    loading.value = false;
  }
};

const onSubmit = () => {
  oldPasswordRef.value.validate();
  const passwordWithConfirmData =
    passwordWithConfirmRef.value.getPasswordOrError();

  if (
    oldPasswordRef.value.hasError ||
    passwordWithConfirmData.validationError
  ) {
    return;
  }

  if (passwordWithConfirmData.errorMessage) {
    generalError.value = passwordWithConfirmData.errorMessage;
    return;
  }
  update(oldPassword.value, passwordWithConfirmData.password);
};

const onFieldChange = () => {
  generalError.value = '';
};
</script>

<style lang="scss"></style>
