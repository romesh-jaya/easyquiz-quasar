import { IQuestion } from './IQuestion';
import { IQuiz } from './IQuiz';

export interface IQuizWithDetails extends IQuiz {
  questions: IQuestion[];
}
