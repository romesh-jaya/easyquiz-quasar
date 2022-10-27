import { Notify } from 'quasar';
import { getUserData } from '../api';
import { User } from 'firebase/auth';
import { useAuthStore } from '../stores/auth';

export const onAuthStateChanged = async (firebaseUser: User) => {
  const authStore = useAuthStore();

  if (firebaseUser) {
    console.log('Firebase logged in: ', firebaseUser.email);
    try {
      const userDataDB = await getUserData(firebaseUser.email || '');
      if (!userDataDB.firstName) {
        await authStore.logOut();
        Notify.create({
          type: 'negative',
          message: 'No user exists in database. Please contact Admin',
        });
        return;
      }
      authStore.setQuizUser({ ...userDataDB, firebaseUser });
      console.log('QuizUser logged in: ', firebaseUser.email);
    } catch (err) {
      console.error(err);

      await authStore.logOut();
      Notify.create({
        type: 'negative',
        message:
          'Unknown error occured while trying to login. Please try again',
      });
    }
  }
  authStore.setLoading(false);
};
