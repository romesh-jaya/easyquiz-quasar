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
          @update:model-value="onAnswersChangedCheckbox"
        />
      </div>
    </div>
    <div v-else>
      <div v-for="(item, index) in answers" :key="index">
        <q-radio
          v-model="chosenAnswerRadio"
          :val="index"
          :label="item"
          @update:model-value="onAnswersChangedRadio"
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
  multipleAnswersExist: { type: Boolean, required: true },
});

const { questionContent, answers, answersSelected, multipleAnswersExist } =
  toRefs(props);
const chosenAnswerRadio = ref(-1);
const chosenAnswersCheckbox = ref<number[]>([]);

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

const onAnswersChangedCheckbox = (index: number[]) => {
  emit('answersSelected', index);
};

const onAnswersChangedRadio = (index: number) => {
  emit('answersSelected', [index]);
};
</script>

<style lang="scss"></style>
