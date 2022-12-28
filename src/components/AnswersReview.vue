<template>
  <h3 class="text-h5 text-accent">{{ heading }}</h3>
  <div class="text-left">
    <div class="q-mb-md">
      {{ questionContent }}
    </div>
    <div v-if="multipleAnswersExist">
      <div v-for="(item, index) in answers" :key="index">
        <q-checkbox
          v-model="chosenAnswersCheckbox"
          :val="index"
          :label="item"
          disable
        />
      </div>
    </div>
    <div v-else>
      <div
        v-for="(item, index) in answers"
        :key="index"
        :class="{ 'green-border': index === correctAnswers[0] }"
      >
        <q-radio
          v-model="chosenAnswerRadio"
          :val="index"
          :label="item"
          disable
          :checked-icon="
            answersSelected[0] === correctAnswers[0] ? 'task_alt' : 'cancel'
          "
          unchecked-icon="panorama_fish_eye"
          :color="answersSelected[0] === correctAnswers[0] ? 'green' : 'red'"
        />
      </div>
    </div>
    <div class="q-my-md">
      Result:
      <span
        :class="isAnswerCorrect ? 'text-green' : 'text-red'"
        class="text-bold"
        >{{ isAnswerCorrect ? 'Correct' : 'Incorrect' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue';

const props = defineProps({
  heading: { type: String, required: true },
  questionContent: { type: String, required: true },
  answers: { type: Array<string>, required: true },
  answersSelected: { type: Array<number>, required: true },
  correctAnswers: { type: Array<number>, required: true },
});

const { questionContent, answers, answersSelected, correctAnswers } =
  toRefs(props);
const chosenAnswerRadio = ref(-1);
const chosenAnswersCheckbox = ref<number[]>([]);

const multipleAnswersExist = computed(() => correctAnswers.value.length > 1);
const isAnswerCorrect = computed(
  () =>
    JSON.stringify(answersSelected.value) ===
    JSON.stringify(correctAnswers.value)
);

console.log('multipleAnswersExist', multipleAnswersExist.value);
console.log('answersSelected', answersSelected.value);
console.log('correctAnswers', correctAnswers.value);

watch(answersSelected, () => {
  if (!multipleAnswersExist.value) {
    if (answersSelected.value.length === 1) {
      chosenAnswerRadio.value = answersSelected.value[0];
      return;
    }
    chosenAnswerRadio.value = -1;
  } else {
    chosenAnswersCheckbox.value = answersSelected.value;
  }
});

watch(correctAnswers, () => {
  console.log('correctAnswers', correctAnswers.value);
});

watch(answersSelected, () => {
  console.log('answersSelected', answersSelected.value);
});
</script>

<style lang="scss">
.green-border {
  border-radius: 5px;
  border: 2px solid var(--q-accent);
}
</style>
