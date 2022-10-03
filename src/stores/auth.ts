import { defineStore } from 'pinia';
import { User } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

export interface IAuthState {
  user?: User;
  loading: boolean;
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
      loading: true,
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
    async logIn(email: string, password: string) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { error: '' };
      } catch (err) {
        const error = err as IFirebaseSignupError;
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            return {
              error: 'Email address or password is incorrect',
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
    async logOut() {
      await signOut(auth);
      this.user = undefined;
    },
    setUser(user: User) {
      this.user = user;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
  },
});
