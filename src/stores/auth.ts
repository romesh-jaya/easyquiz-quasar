import { defineStore } from 'pinia';
import { User } from '@firebase/auth-types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export interface IAuthState {
  user?: User;
  authToken: string;
}

export interface IFirebaseSignupError {
  code: string;
}

export interface ISignupError {
  error: string;
  isGeneralError?: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      user: undefined,
      authToken: '',
    } as IAuthState),
  getters: {},
  actions: {
    async registerUser(email: string, password: string): Promise<ISignupError> {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Successfully registered!');
        return { error: '' };
      } catch (err) {
        const error = err as IFirebaseSignupError;
        switch (error.code) {
          case 'auth/email-already-in-use':
            return {
              error: 'Email address is already in use',
              isGeneralError: true,
            };
          default:
            return {
              error: 'Unknown error occured while trying to signup',
              isGeneralError: false,
            };
        }
      }
    },
  },
});
