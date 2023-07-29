import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  initLogin,
  login,
  loginError,
  logout,
  signInDone,
  startAuth,
  startLogin,
  startSignup,
} from './auth.actions';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  LoginUserResponse,
  SignupUserResponse,
  User,
  userResponseNeededData,
} from '../user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/loading.service';

@Injectable()
export class AuthEffects {
  LOGIN_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;
  SIGNUP_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(initLogin),
      switchMap(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) return of();

        const parsedUserData = JSON.parse(userData) as userResponseNeededData;

        const exp = new Date(
          new Date(parsedUserData._tokenExpirationDate).getTime()
        );

        this.clearLogOutTimer();
        this.setLogOutTimer(exp.getTime() - new Date().getTime());

        const user = new User(
          parsedUserData.email,
          parsedUserData.id,
          parsedUserData._token,
          exp
        );

        if (user.token) return of(login({ user, autoLogged: true }));
        else return of(logout({}));
      })
    )
  );
  loginOrSignupEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(startLogin, startSignup),
      switchMap(({ email, password, type }) => {
        if (!email && !password) return of();

        const apiUrl = this.getLoginOrSignupApiUrl(type);
        const request$ = this.http.post<LoginUserResponse | SignupUserResponse>(
          apiUrl,
          {
            email,
            password,
            returnSecureToken: true,
          }
        );

        return request$.pipe(
          map((responseData) =>
            this.createUserAndStoreInLocalStorage(responseData)
          ),
          map((user) => login({ user, autoLogged: false })),
          catchError((errorRes: HttpErrorResponse) =>
            of(
              loginError({
                errorMessage: this.getErrorMessage(
                  errorRes.error.error.message
                ),
              })
            )
          )
        );
      })
    )
  );

  private getLoginOrSignupApiUrl(type: string): string {
    return type === '[Auth] Start Login'
      ? this.LOGIN_API_URL
      : this.SIGNUP_API_URL;
  }

  logoutEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(({ reason }) => {
          this.clearLogOutTimer();
          this.router.navigate(['auth']);
          localStorage.removeItem('userData');
          if (reason) this.loadingService.error.next(reason);
        })
      ),
    { dispatch: false }
  );

  authEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(startAuth),
      withLatestFrom(this.store.select((state) => state.auth.form.authMode)),
      switchMap(([{ email, password }, authMode]) => {
        return authMode === 'signup'
          ? of(startSignup({ email, password }))
          : of(startLogin({ email, password }));
      })
    )
  );

  loginReflect = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(() => of(signInDone()))
    )
  );

  logInErrorReflect = createEffect(() =>
    this.actions$.pipe(
      ofType(loginError),
      switchMap(() => of(signInDone()))
    )
  );

  signInDone = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInDone),
        withLatestFrom(this.store.select('auth')),
        switchMap(([_, action]) => {
          if (action.authError) {
            this.loadingService.isFetching.next(false);
            this.loadingService.error.next(action.authError);
          }

          if (!action.autoLogged) this.router.navigate(['/recipes']);

          return of();
        })
      ),
    { dispatch: false }
  );

  private tokenExpirationTimer: any;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  setLogOutTimer(expTime: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(
        logout({
          reason: 'Your token is automatically expired, please Login again!',
        })
      );
    }, expTime);
  }

  clearLogOutTimer() {
    if (this.tokenExpirationTimer) {
      console.log(this.tokenExpirationTimer);
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private createUserAndStoreInLocalStorage(
    responseData: LoginUserResponse | SignupUserResponse
  ): User {
    const expirationDate = new Date(
      new Date().getTime() + +responseData.expiresIn * 1000
    );

    this.clearLogOutTimer();
    this.setLogOutTimer(expirationDate.getTime() - new Date().getTime());

    const user = new User(
      responseData.email,
      responseData.localId,
      responseData.idToken,
      expirationDate
    );
    localStorage.setItem('userData', JSON.stringify(user));
    return user;
  }

  private getErrorMessage(errorMessage: string): string {
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
  }
}
