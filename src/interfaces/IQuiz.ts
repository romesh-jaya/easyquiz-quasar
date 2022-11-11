export interface IQuiz {
  quizName: string;
  description: string;
  passMarkPercentage: number;
  createdByUser: string;
  id: string;
  statusDB: string;
  questionOrder?: string[];
  lastUpdated: Date;
}
