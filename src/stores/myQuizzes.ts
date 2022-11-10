import { defineStore } from 'pinia';
import { IQuiz } from '../interfaces/IQuiz';
import { getMyQuizzes } from '../api';

export interface IMyQuizzesState {
  myQuizzes: IQuiz[];
  loading: boolean;
}

export const useMyQuizzesStore = defineStore('myQuizzes', {
  state: () =>
    ({
      myQuizzes: [],
      loading: true,
    } as IMyQuizzesState),
  getters: {},
  actions: {
    async fetchQuizzes(): Promise<void> {
      try {
        this.myQuizzes = await getMyQuizzes();
      } finally {
        this.loading = false;
      }
    },
  },
});
