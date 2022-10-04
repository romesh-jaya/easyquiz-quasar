<template>
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
</template>

<script lang="ts">
import { ref } from 'vue';
import { defineComponent } from 'vue';

// Note: had to use defineComponent as otherwise, can't access
export default defineComponent({
  name: 'PasswordWithConfirm',
  emits: ['password-update'],
  setup(props, context) {
    const password = ref('');
    const passwordRef = ref();
    const passwordConfirm = ref('');
    const passwordConfirmRef = ref();

    const getPasswordOrError = () => {
      passwordRef.value.validate();
      passwordConfirmRef.value.validate();

      if (passwordRef.value.hasError || passwordConfirmRef.value.hasError) {
        return { password: '', errorMessage: '', validationError: true };
      }

      if (password.value !== passwordConfirm.value) {
        return {
          password: '',
          errorMessage: 'Password and Confirm Password do not match',
          validationError: false,
        };
      }
      return {
        password: password.value,
        errorMessage: '',
        validationError: false,
      };
    };

    const onFieldChange = () => {
      context.emit('password-update');
    };

    return {
      password,
      passwordRef,
      passwordConfirm,
      passwordConfirmRef,
      getPasswordOrError,
      onFieldChange,
    };
  },
});
</script>

<style lang="scss"></style>
