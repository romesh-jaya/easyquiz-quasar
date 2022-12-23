<template>
  <h3 class="text-h5 text-accent">{{ heading }}</h3>
  <div class="text-left">
    <div class="q-mb-md">
      {{ questionContent }}
    </div>
    <div>
      <div v-for="(item, index) in answers" :key="index">
        <q-radio
          v-model="chosenAnswer"
          :val="index"
          :label="item"
          @update:model-value="onAnswersChanged"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';

const emit = defineEmits(['answersSelected']);

const props = defineProps({
  heading: { type: String, required: true },
  questionContent: { type: String, required: true },
  answers: { type: Array<string>, required: true },
  answersSelected: { type: Array<number>, required: true },
});

const { questionContent, answers, answersSelected } = toRefs(props);
const chosenAnswer = ref('');

watch(answersSelected, () => {
  if (answersSelected.value.length === 1) {
    chosenAnswer.value = answersSelected.value[0] + '';
    return;
  }
  chosenAnswer.value = '';
});

const onAnswersChanged = (index: string) => {
  emit('answersSelected', [parseInt(index)]);
};
</script>

<style lang="scss"></style>
