import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import {
  isFormValid,
  login,
  loginError,
  logout,
  signup,
  startLogin,
  startSignup,
  switchAuthMode,
} from './auth.actions';

export interface AuthState {
  user: User | undefined;
  form: { authMode: 'signup' | 'login'; isFormValid: boolean };
  authError: string | undefined;
}

const initialState: AuthState = {
  user: undefined,
  form: { authMode: 'login', isFormValid: true },
  authError: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state, { email, id, _token, _tokenExpirationDate }) => {
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
  }),
  on(isFormValid, (state, action) => {
    return { ...state, form: { ...state.form, isFormValid: action.isValid } };
  }),
  on(switchAuthMode, (state) => {
    return {
      ...state,
      form: {
        authMode: state.form.authMode === 'signup' ? 'login' : 'signup',
        isFormValid: true,
      },
    };
  })
);
