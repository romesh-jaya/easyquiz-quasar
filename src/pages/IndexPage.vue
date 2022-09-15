<template>
  <q-page class="">
    <div class="hero-container bg-primary">
      <q-img src="../assets/hero.jpg" fit="contain">
        <div class="absolute-bottom text-subtitle1 text-center">
          Welcome to the best in-class quiz app solution!
        </div>
      </q-img>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
});
</script>

<style lang="scss">
.hero-container {
  display: flex;
  height: 420px;
  width: 100%;
}
</style>
