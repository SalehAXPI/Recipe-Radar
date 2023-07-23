import { createReducer } from '@ngrx/store';
import { User } from '../user.model';

export interface AuthState {
  user: User | undefined;
}

const initialState: AuthState = {
  user: undefined,
};

export const authReducer = createReducer(initialState);
