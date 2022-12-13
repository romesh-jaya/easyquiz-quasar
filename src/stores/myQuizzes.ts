import { defineStore } from 'pinia';
import { IQuiz } from '../interfaces/IQuiz';
import { getMyQuizzes } from '../api';

export interface IMyQuizzesState {
  myQuizzes: IQuiz[];
  loading: boolean;
  dataStale: boolean;
}

export const useMyQuizzesStore = defineStore('myQuizzes', {
  state: () =>
    ({
      myQuizzes: [],
      loading: true,
      dataStale: true,
    } as IMyQuizzesState),
  getters: {},
  actions: {
    async fetchQuizzes(): Promise<void> {
      try {
        if (this.dataStale) {
          this.loading = true;
          this.myQuizzes = await getMyQuizzes();
          this.dataStale = false;
        }
      } finally {
        this.loading = false;
      }
    },
    setDataStale(): void {
      this.dataStale = true;
    },
  },
});
