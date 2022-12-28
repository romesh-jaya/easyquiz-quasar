import { IQuestion } from '@/interfaces/IQuestion';

export const getNoOfCorrectAnswers = (
  questions: IQuestion[],
  answersSelectedForAllQuestions: number[][]
): number => {
  const answersComputedIndexes = getAnswersComputedIndexes(questions);

  // We need to sort this array numerically, as the order in which the user selects the checkboxes of the answer may
  // vary. E.g. answersSelectedForAllQuestions[idx] may have [1,0,3] as the indexes. But we need to sort it to [0,1,3]
  // in order to compare with answersComputedIndexes
  const sortedAnswersSelectedForAllQuestions =
    answersSelectedForAllQuestions.map((answers) => {
      return answers.sort((a, b) => {
        return a - b;
      });
    });

  const correctAnswers = answersComputedIndexes.map((computed, idx) => {
    const selectedAnswersString = JSON.stringify(
      sortedAnswersSelectedForAllQuestions[idx]
    );
    return selectedAnswersString === JSON.stringify(computed);
  });

  return correctAnswers.filter((answer) => answer).length;
};

export const getAnswersComputedIndexes = (
  questions: IQuestion[]
): number[][] => {
  return questions.map((question) => {
    const indexes: number[] = [];
    question.answers.forEach((answer, idx) => {
      if (answer.isCorrect) {
        indexes.push(idx);
      }
    });
    return indexes;
  });
};
