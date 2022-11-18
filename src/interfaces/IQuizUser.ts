import { User } from 'firebase/auth';

export interface IUserDataDB {
  firstName?: string;
  lastName?: string;
}

export interface IQuizUser extends IUserDataDB {
  firebaseUser: User;
}
