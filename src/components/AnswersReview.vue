<template>
  <h3 class="text-h5 text-accent">{{ heading }}</h3>
  <div class="text-left">
    <div class="q-mb-md">
      {{ questionContent }}
    </div>
    <div v-if="multipleAnswersExist">
      <div
        v-for="(item, index) in answers"
        :key="index"
        class="q-my-sm"
        :class="{ 'green-border': correctAnswersBooleans[index] }"
      >
        <q-checkbox
          v-model="chosenAnswersCheckbox"
          :val="index"
          :label="item"
          disable
          :color="correctAnswersBooleans[index] ? 'green' : 'red'"
          :checked-icon="correctAnswersBooleans[index] ? 'check_box' : 'cancel'"
          unchecked-icon="check_box_outline_blank"
        />
      </div>
    </div>
    <div v-else>
      <div
        v-for="(item, index) in answers"
        :key="index"
        :class="{ 'green-border': index === correctAnswersIndexes[0] }"
      >
        <q-radio
          v-model="chosenAnswerRadio"
          :val="index"
          :label="item"
          disable
          :checked-icon="isAnswerCorrect ? 'task_alt' : 'cancel'"
          unchecked-icon="panorama_fish_eye"
          :color="isAnswerCorrect ? 'green' : 'red'"
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
  answersSelectedIndexes: { type: Array<number>, required: true },
  correctAnswersIndexes: { type: Array<number>, required: true },
});

const {
  questionContent,
  answers,
  answersSelectedIndexes,
  correctAnswersIndexes,
} = toRefs(props);
const chosenAnswerRadio = ref(-1);
const chosenAnswersCheckbox = ref<number[]>([]);

const multipleAnswersExist = computed(
  () => correctAnswersIndexes.value.length > 1
);
const correctAnswersBooleans = computed(() => {
  return answers.value.map(
    (_, idx) => correctAnswersIndexes.value.includes(idx) ?? false
  );
});
const isAnswerCorrect = computed(
  () =>
    JSON.stringify(answersSelectedIndexes.value) ===
    JSON.stringify(correctAnswersIndexes.value)
);

watch(answersSelectedIndexes, () => {
  if (!multipleAnswersExist.value) {
    if (answersSelectedIndexes.value.length === 1) {
      chosenAnswerRadio.value = answersSelectedIndexes.value[0];
      return;
    }
    chosenAnswerRadio.value = -1;
  } else {
    chosenAnswersCheckbox.value = answersSelectedIndexes.value;
  }
});
</script>

<style lang="scss">
.green-border {
  border-radius: 5px;
  border: 2px solid var(--q-accent);
}
</style>
