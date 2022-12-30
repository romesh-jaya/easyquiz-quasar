import { IAnswer } from './IAnswer';

export interface IQuestion {
  quizId: string;
  questionContent: string;
  answers: IAnswer[];
  id: string;
  revision: number;
  lastUpdated: Date;
}
