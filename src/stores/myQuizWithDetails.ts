import { defineStore } from 'pinia';
import { IQuizWithDetails } from '../interfaces/IQuizWithDetails';
import { getQuizWithDetails } from '../api';

export interface IQuizWithDetailsState {
  myQuizWithDetails?: IQuizWithDetails;
  loading: boolean;
}

export const useMyQuizWithDetailsStore = defineStore('myQuizWithDetails', {
  state: () =>
    ({
      myQuizWithDetails: undefined,
      loading: true,
    } as IQuizWithDetailsState),
  getters: {},
  actions: {
    async fetchQuiz(quizId: string): Promise<void> {
      try {
        this.loading = true;
        this.myQuizWithDetails = await getQuizWithDetails(quizId);
      } finally {
        this.loading = false;
      }
    },
  },
});
