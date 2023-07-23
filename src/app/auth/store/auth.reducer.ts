import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import { login, logout } from './auth.actions';

export interface AuthState {
  user: User | undefined;
}

const initialState: AuthState = {
  user: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state, action) => {
    const { email, id, _token, _tokenExpirationDate } = action;
    return {
      ...state,
      user: new User(email, id, _token, _tokenExpirationDate),
    };
  }),
  on(logout, (state) => {
    return { ...state, user: undefined };
  })
);
