<template>
  <PageContainerResponsive>
    <div v-if="loadingAuth || loadingMyQuizzes" class="q-mt-xl q-gutter-y-md">
      <q-skeleton height="20px" />
      <q-skeleton height="150px" />
      <q-skeleton height="20px" />
    </div>
    <div v-else-if="myQuizForEdit">
      <q-breadcrumbs class="q-my-lg">
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el :label="myQuizForEdit.quizName" />
        <q-breadcrumbs-el
          :label="myQuizForEdit ? 'Edit question' : 'Create question'"
        />
      </q-breadcrumbs>
      <q-input
        ref="questionContentRef"
        v-model="questionContent"
        outlined
        label="Question Content"
        :rules="[
          (val) => !!val || '* Required',
          (val) => val.length <= 16 || 'Please use maximum 1000 characters',
        ]"
        lazy-rules
        class="input-textarea"
        type="textarea"
      />
      <div class="q-mt-md q-mb-lg button-container">
        <q-btn color="secondary" :loading="loading" @click="onSubmit">{{
          myQuizForEdit ? 'Save question' : 'Create'
        }}</q-btn>
        <q-btn color="accent" @click="$router.go(-1)">Back</q-btn>
      </div>
      <q-separator />
      <h3 class="text-h5 text-accent">Answers</h3>
      <q-toggle
        v-model="answerSortMode"
        label="Sort answers mode"
        @update:model-value="onSortAnswerToggle"
      />
      <div v-if="answerSortMode">
        <SortableVue
          :list="answersList"
          item-key="answer"
          tag="div"
          :options="sortableOptions"
          @end="onOrderChanged"
        >
          <template #item="{ element, index }">
            <q-input
              v-model="element.answer"
              filled
              readonly
              :label="'Answer ' + (index + 1)"
              class="draggable q-my-lg"
            />
          </template>
        </SortableVue>
      </div>
      <div v-else>
        <div
          v-for="(item, index) in answersList"
          :key="index"
          class="input-textarea answer-container q-my-lg"
        >
          <q-input
            ref="answersListRef"
            v-model="item.answer"
            outlined
            :label="'Answer ' + (index + 1)"
            :rules="[(val) => !!val || '* Required']"
            lazy-rules
            class="answer"
          />
          <q-btn flat dense round>
            <q-icon
              size="1.5em"
              name="close"
              class="close-icon"
              @click="() => onAnswerRemove(index)"
            />
          </q-btn>
        </div>
        <div class="q-my-lg button-container">
          <q-btn color="secondary" @click="onAddAnswer">Add Answer</q-btn>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="q-mt-xl">
        <p>Quiz not found</p>
      </div>
    </div>
  </PageContainerResponsive>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
import { Sortable as SortableVue } from 'sortablejs-vue3';
import { QInput } from 'quasar';
// import { useRouter } from 'vue-router';
//import { useQuasar } from 'quasar';
import type { SortableOptions } from 'sortablejs';
import Sortable from 'sortablejs';
import { useAuthStore } from '../stores/auth';
import { useMyQuizzesStore } from '../stores/myQuizzes';
import PageContainerResponsive from '../components/PageContainerResponsive.vue';

interface IAnswer {
  answer: string;
}

const authStore = useAuthStore();
const myQuizzesStore = useMyQuizzesStore();
// const router = useRouter();
//const $q = useQuasar();

const props = defineProps({
  quizId: { type: String, required: false, default: '' },
});

const { quizId } = toRefs(props);

const myQuizForEdit = computed(() =>
  myQuizzesStore.myQuizzes.find((quiz) => quiz.id === quizId.value)
);

const questionContent = ref(myQuizForEdit.value?.quizName);
const questionContentRef = ref();
const answersList = ref<IAnswer[]>([{ answer: '' }, { answer: '' }]);
const answersListRef = ref<QInput[]>([]);
const answerSortMode = ref(false);
const loading = ref(false);
const loadingAuth = computed(() => authStore.loading);
const loadingMyQuizzes = computed(() => myQuizzesStore.loading);

/*
watch(myQuizForEdit, () => {
  if (myQuizForEdit.value) {
    quizName.value = myQuizForEdit.value.quizName;
    description.value = myQuizForEdit.value.description;
    passMarkPercentage.value = myQuizForEdit.value.passMarkPercentage;
  }
});
*/

const sortableOptions = computed<SortableOptions>(() => {
  return {
    draggable: '.draggable',
    ghostClass: 'ghost',
    dragClass: 'drag',
  };
});

const moveItemInArray = (array: IAnswer[], from: number, to: number) => {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item);
};

const onOrderChanged = (event: Sortable.SortableEvent) => {
  // Have to manually move the items in the array according to https://github.com/MaxLeiter/sortablejs-vue3
  moveItemInArray(answersList.value, event.oldIndex || 0, event.newIndex || 0);
};

const doAnswersHaveErrors = () => {
  answersListRef.value.forEach((answerRef) => answerRef.validate());
  return answersListRef.value.find((answerRef) => answerRef.hasError);
};

const onSortAnswerToggle = (isToggleOn: boolean) => {
  if (isToggleOn) {
    if (doAnswersHaveErrors()) {
      answerSortMode.value = false;
    }
  }
};

const onAnswerRemove = (index: number) => {
  answersList.value.splice(index, 1);
};

const onAddAnswer = () => {
  answersList.value.push({ answer: '' });
};

const onSubmit = () => {
  questionContentRef.value.validate();
  if (questionContentRef.value.hasError || doAnswersHaveErrors()) {
    return;
  }
  // saveQuiz();
};
</script>

<style lang="scss">
.button-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.draggable {
  input {
    cursor: move !important;
  }
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ghost {
  opacity: 0.5;
  background: #fff;
  border: 1px dashed #ccc;
}

.drag {
  background: var(--q-primary);
}

.close-icon {
  padding: 12px;
  cursor: pointer;
}

.answer-container {
  display: flex;
  place-items: center;
}

.answer {
  flex: 1;
  padding-bottom: 0 !important;
}
</style>
