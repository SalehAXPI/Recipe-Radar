import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  initLogin,
  login,
  loginError,
  logout,
  signup,
  startLogin,
  startSignup,
} from './auth.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  LoginUserResponse,
  SignupUserResponse,
  User,
  userResponseNeededData,
} from '../user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

const LOGIN_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;
const SIGNUP_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;

const createUserAndStoreInLocalStorage = (
  responseData: LoginUserResponse | SignupUserResponse
): User => {
  const expirationDate = new Date(
    new Date().getTime() + +responseData.expiresIn * 1000
  );
  const user = new User(
    responseData.email,
    responseData.localId,
    responseData.idToken,
    expirationDate
  );
  localStorage.setItem('userData', JSON.stringify(user));
  return user;
};

const getErrorMessage = (errorMessage: string): string => {
  switch (errorMessage) {
    case 'INVALID_PASSWORD':
      return 'Password Is Not Correct, Please Try Again!';

    case 'EMAIL_NOT_FOUND':
      return 'Email Not Found, Please Try Again!';

    case 'EMAIL_EXISTS':
      return 'This Email has already signed up!';

    case 'INVALID_EMAIL':
      return "Email Isn't Valid, Please Try With Another Email!";

    default:
      return 'An unknown error occurs!';
  }
};

@Injectable()
export class AuthEffects {
  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(initLogin),
      switchMap(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) return of(logout());

        const parsedUserData = JSON.parse(userData) as userResponseNeededData;

        const exp = new Date(
          new Date(parsedUserData._tokenExpirationDate).getTime()
        );

        const loadedUser = new User(
          parsedUserData.email,
          parsedUserData.id,
          parsedUserData._token,
          exp
        );

        const expRemain = exp.getTime() - new Date().getTime();
        setTimeout(() => {
          return of(logout);
        }, expRemain);

        if (loadedUser.token) return of(login(loadedUser));
        else return of(logout());
      })
    )
  );

  loginEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(startLogin),
      switchMap(({ email, password }) => {
        if (!email && !password) return of();

        return this.http
          .post<LoginUserResponse>(LOGIN_API_URL, {
            email,
            password,
            returnSecureToken: true,
          })
          .pipe(
            map((responseData) =>
              signup(createUserAndStoreInLocalStorage(responseData))
            ),
            catchError((errorRes: HttpErrorResponse) => {
              return of(
                loginError({
                  errorMessage: getErrorMessage(errorRes.error.error.message),
                })
              );
            })
          );
      })
    )
  );

  signupEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(startSignup),
      switchMap(({ email, password }) => {
        if (!email && !password) return of();

        return this.http
          .post<SignupUserResponse>(SIGNUP_API_URL, {
            email,
            password,
            returnSecureToken: true,
          })
          .pipe(
            map((responseData) =>
              signup(createUserAndStoreInLocalStorage(responseData))
            ),
            catchError((errorRes: HttpErrorResponse) => {
              return of(
                loginError({
                  errorMessage: getErrorMessage(errorRes.error.error.message),
                })
              );
            })
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private http: HttpClient
  ) {}
}
