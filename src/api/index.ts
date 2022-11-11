import { IUserDataDB } from '@/interfaces/IQuizUser';
import { api } from 'boot/axios';
import { getBackendURL } from '../utils/backend';
import { IAPIError } from '../interfaces/IAPIError';
import { IQuiz } from '../interfaces/IQuiz';

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
  const quizzes: IQuiz[] = response.data.map((dataOne: any) => ({
    quizName: dataOne.name,
    description: dataOne.description,
    passMarkPercentage: dataOne.pass_mark_percentage,
    createdByUser: dataOne.created_by_user,
    id: dataOne.id,
    statusDB: dataOne.status,
    questionOrder: dataOne.question_order,
    lastUpdated: new Date(dataOne.last_updated),
  }));
  return quizzes;
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
