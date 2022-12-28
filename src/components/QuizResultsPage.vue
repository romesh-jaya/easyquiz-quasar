<template>
  <div class="text-left">
    <p
      v-if="scorePercentage >= passMarkPercentage"
      class="text-positive text-bold"
    >
      Congratulations! You passed the quiz.
    </p>
    <p v-else class="text-negative text-bold">
      Sorry, but you failed the quiz.
    </p>
    Here are your stats:
    <div class="q-my-lg">
      <span class="score-label">No. of total Questions: </span
      >{{ noOfTotalQuestions }}<br />
      <span class="score-label">No. of correct Answers: </span
      >{{ noOfCorrectAnswers }}<br />
      <span class="score-label">Pass Percentage: </span
      >{{ passMarkPercentage }}%<br />
      <p
        class="text-bold"
        :class="{
          'text-positive': scorePercentage >= passMarkPercentage,
          'text-negative': scorePercentage < passMarkPercentage,
        }"
      >
        <span class="score-label">Your score: </span>{{ scorePercentage }}%
      </p>
    </div>
    <div>You can now review your answers.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps({
  noOfTotalQuestions: { type: Number, required: true },
  noOfCorrectAnswers: { type: Number, required: true },
  passMarkPercentage: { type: Number, required: true },
});

const { noOfCorrectAnswers, noOfTotalQuestions } = toRefs(props);

const scorePercentage = computed(() =>
  Math.round((noOfCorrectAnswers.value * 100) / noOfTotalQuestions.value)
);
</script>

<style lang="scss">
.score-label {
  display: inline-block;
  width: 200px;
}
</style>
