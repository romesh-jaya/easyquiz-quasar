import { IAPIError } from './IAPIError';

export interface IIdAPIError extends IAPIError {
  message?: string;
  data: {
    id?: string;
  };
}
