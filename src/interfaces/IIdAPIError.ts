import { IAPIError } from './IAPIError';

export interface IIdAPIError extends IAPIError {
  id: string;
}
