import { IUserDataDB } from '@/interfaces/IQuizUser';
import { api } from 'boot/axios';
import { getBackendURL } from '../utils/backend';
import { IAPIError } from '../interfaces/IAPIError';
import { IQuiz } from '../interfaces/IQuiz';
import { IQuizWithDetails } from '@/interfaces/IQuizWithDetails';
import { IQuestion } from '@/interfaces/IQuestion';

const quizDbToClient = (dataOne: any): IQuiz => {
  return {
    quizName: dataOne.name,
    description: dataOne.description,
    passMarkPercentage: dataOne.pass_mark_percentage,
    createdByUser: dataOne.created_by_user,
    id: dataOne.id,
    statusDB: dataOne.status,
    questionOrder: dataOne.question_order,
    lastUpdated: new Date(dataOne.last_updated),
  };
};

const questionDbToClient = (dataOne: any): IQuestion => {
  return {
    quizId: dataOne.quiz_id,
    questionContent: dataOne.question_content,
    answers: JSON.parse(dataOne.answers),
    id: dataOne.id,
    lastUpdated: new Date(dataOne.last_updated),
  };
};

export const getUserData = async (email: string): Promise<IUserDataDB> => {
  const response = await api.get(`${getBackendURL()}/api/auth/users/${email}`);
  if (response.data) {
    return {
      firstName: response.data.first_name,
      lastName: response.data.last_name,
    };
  }
  return { firstName: '', lastName: '' };
};

export const getMyQuizzes = async (): Promise<IQuiz[]> => {
  const response = await api.get(`${getBackendURL()}/api/auth/quizzes`);
  const quizzes = response.data.map((dataOne: any) => quizDbToClient(dataOne));
  return quizzes;
};

export const getQuizWithDetails = async (
  quizId: string
): Promise<IQuizWithDetails> => {
  const response = await api.get(
    `${getBackendURL()}/api/auth/quizzes/${quizId}`
  );
  if (response.data) {
    const quiz = {
      ...quizDbToClient(response.data),
      questions: response.data.questions.map((dataOne: any) =>
        questionDbToClient(dataOne)
      ),
    };
    return quiz;
  }
  throw new Error('Invalid data format for Quiz');
};

export const saveQuizData = async (
  quizName: string,
  description: string,
  passMarkPercentage: number,
  id?: string
): Promise<IAPIError> => {
  if (id) {
    const response = await api.put(
      `${getBackendURL()}/api/auth/quizzes/${id}`,
      {
        quizName,
        description,
        passMarkPercentage,
      }
    );
    return response.data as IAPIError;
  }

  const response = await api.post(`${getBackendURL()}/api/auth/quizzes`, {
    quizName,
    description,
    passMarkPercentage,
  });
  return response.data as IAPIError;
};

export const saveQuestionData = async (
  quizId: string,
  questionContent: string,
  answers: string,
  id?: string
): Promise<IAPIError> => {
  if (id) {
    const response = await api.put(
      `${getBackendURL()}/api/auth/quizzes/${quizId}/questions/${id}`,
      {
        questionContent,
        answers,
      }
    );
    return response.data as IAPIError;
  }

  const response = await api.post(
    `${getBackendURL()}/api/auth/quizzes/${quizId}/questions`,
    {
      questionContent,
      answers,
    }
  );
  return response.data as IAPIError;
};

export const deleteQuestion = async (
  quizId: string,
  id: string
): Promise<IAPIError> => {
  const response = await api.delete(
    `${getBackendURL()}/api/auth/quizzes/${quizId}/questions/${id}`
  );
  return response.data as IAPIError;
};
