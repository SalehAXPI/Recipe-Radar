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
  signup,
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
import { RecipeService } from '../../recipes/recipe.service';
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

        const loadedUser = new User(
          parsedUserData.email,
          parsedUserData.id,
          parsedUserData._token,
          exp
        );

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
          .post<LoginUserResponse>(this.LOGIN_API_URL, {
            email,
            password,
            returnSecureToken: true,
          })
          .pipe(
            map((responseData) =>
              login(this.createUserAndStoreInLocalStorage(responseData))
            ),
            catchError((errorRes: HttpErrorResponse) => {
              return of(
                loginError({
                  errorMessage: this.getErrorMessage(
                    errorRes.error.error.message
                  ),
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
          .post<SignupUserResponse>(this.SIGNUP_API_URL, {
            email,
            password,
            returnSecureToken: true,
          })
          .pipe(
            map((responseData) =>
              signup(this.createUserAndStoreInLocalStorage(responseData))
            ),
            catchError((errorRes: HttpErrorResponse) => {
              return of(
                loginError({
                  errorMessage: this.getErrorMessage(
                    errorRes.error.error.message
                  ),
                })
              );
            })
          );
      })
    )
  );
  logoutEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.clearLogOutTimer();
          this.router.navigate(['auth']);
          localStorage.removeItem('userData');
          this.recipeService.onLogout();
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

  signupReflect = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
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
          if (action.user) this.router.navigate(['/recipes']);

          if (action.authError) {
            this.loadingService.isFetching.next(false);
            this.loadingService.error.next(action.authError);
          }
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
    private recipeService: RecipeService,
    private loadingService: LoadingService
  ) {}

  setLogOutTimer(expTime: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(logout());
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
