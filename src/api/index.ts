import { IUserDataDB } from '@/interfaces/IQuizUser';
import { api } from 'boot/axios';
import { getBackendURL } from '../utils/backend';

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
