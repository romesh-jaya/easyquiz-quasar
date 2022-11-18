import { Notify } from 'quasar';
import { getUserData } from '../api';
import { User } from 'firebase/auth';
import { useAuthStore } from '../stores/auth';
import { useMyQuizzesStore } from '../stores/myQuizzes';

export const onAuthStateChanged = async (firebaseUser: User) => {
  const authStore = useAuthStore();
  const myQuizzesStore = useMyQuizzesStore();

  if (firebaseUser) {
    authStore.setLoading(true);
    console.log('Firebase logged in: ', firebaseUser.email);
    authStore.setQuizUser({ firebaseUser }); // This is needed for the interceptor to function correctly
    try {
      // Load user data
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
      return;
    } finally {
      authStore.setLoading(false);
    }

    try {
      // Fetch quizzes
      await myQuizzesStore.fetchQuizzes();
    } catch (err) {
      console.error(err);

      Notify.create({
        type: 'negative',
        message: 'Unknown error occured while fetching quizzes',
      });
    }
  }
  authStore.setLoading(false); // Note: this has to be OUTSIDE the if (firebaseUser)... block
};
