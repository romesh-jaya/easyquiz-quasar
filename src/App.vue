<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss">
@import './css/quasar.variables.scss';

html,
body {
  font-size: 1rem;
  color: $text-color;
}
</style>
