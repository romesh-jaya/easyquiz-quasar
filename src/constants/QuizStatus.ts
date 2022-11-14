import { IDbClientValue } from '@/interfaces/IDbClientValue';

export const QuizStatus: IDbClientValue[] = [
  { dbValue: 'published', clientValue: 'Published' },
  { dbValue: 'unpublished', clientValue: 'Unpublished' },
  { dbValue: 'archived', clientValue: 'Archived' },
];
