import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import {
  login,
  loginError,
  logout,
  signup,
  startLogin,
  startSignup,
} from './auth.actions';

export interface AuthState {
  user: User | undefined;
  authError: string | undefined;
}

const initialState: AuthState = {
  user: undefined,
  authError: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state, action) => {
    const { email, id, _token, _tokenExpirationDate } = action;
    return {
      ...state,
      user: new User(email, id, _token, _tokenExpirationDate),
      authError: undefined,
    };
  }),
  on(startLogin, (state) => {
    return { ...state, authError: undefined };
  }),
  on(startSignup, (state) => {
    return { ...state, authError: undefined };
  }),
  on(signup, (state, action) => {
    const { email, id, _token, _tokenExpirationDate } = action;
    return {
      ...state,
      user: new User(email, id, _token, _tokenExpirationDate),
      authError: undefined,
    };
  }),
  on(logout, (state) => {
    return { ...state, user: undefined, authError: undefined };
  }),
  on(loginError, (state, action) => {
    return { ...state, authError: action.errorMessage };
  })
);
