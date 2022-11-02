import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { IQuizUser } from '../interfaces/IQuizUser';
import { IFirebaseAuthError } from '../interfaces/IFirebaseAuthError';
import { getBackendURL } from '../utils/backend';
import { IAPIError } from '../interfaces/IAPIError';

export interface IAuthState {
  quizUser?: IQuizUser;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      quizUser: undefined,
      loading: true,
    } as IAuthState),
  getters: {},
  actions: {
    async registerUser(
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ): Promise<IAPIError> {
      try {
        const response = await api.post(
          `${getBackendURL()}/api/public/users/register-user`,
          {
            email,
            password,
            firstName,
            lastName,
          }
        );
        if (response.data && response.data.error) {
          return response.data as IAPIError;
        }
        return { error: '' };
      } catch (err) {
        console.error(err);

        return {
          error: 'Unknown error occured while trying to signup',
          isGeneralError: false,
        };
      }
    },
    async logIn(email: string, password: string) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { error: '' };
      } catch (err) {
        const error = err as IFirebaseAuthError;
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            return {
              error: 'Email address or password is incorrect',
              isGeneralError: true,
            };
          case 'auth/too-many-requests':
            return {
              error:
                'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
              isGeneralError: true,
            };
          default:
            return {
              error: 'Unknown error occured while trying to login',
              isGeneralError: false,
            };
        }
      }
    },
    async logOut() {
      await signOut(auth);
      this.quizUser = undefined;
    },
    setQuizUser(quizUser: IQuizUser) {
      this.quizUser = quizUser;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
  },
});
