export interface IQuiz {
  quizName: string;
  description: string;
  passMarkPercentage: number;
  createdByUser: string;
  id: string;
  statusDB: string;
  question_order?: string[];
  last_updated: Date;
}
