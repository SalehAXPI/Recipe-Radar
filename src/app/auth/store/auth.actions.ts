import { createAction, props } from '@ngrx/store';
import { userResponseNeededData } from '../user.model';

export const initLogin = createAction('[Auth] Init Login');

export const startLogin = createAction(
  '[Auth] Start Login',
  props<{ email: string; password: string }>()
);

export const login = createAction(
  '[Auth] Login',
  props<userResponseNeededData>()
);

export const loginError = createAction(
  '[Auth] Login Error',
  props<{ errorMessage: string }>()
);

export const signup = createAction(
  '[Auth] Signup',
  props<userResponseNeededData>()
);

export const startSignup = createAction(
  '[Auth] Start Signup',
  props<{ email: string; password: string }>()
);

export const logout = createAction('[Auth] Logout');
