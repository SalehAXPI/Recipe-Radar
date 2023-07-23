import { createAction, props } from '@ngrx/store';
import { userResponseNeededData } from '../user.model';

export const login = createAction(
  '[Auth] Login',
  props<userResponseNeededData>()
);

export const logout = createAction('[Auth] Logout');
