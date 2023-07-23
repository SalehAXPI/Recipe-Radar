import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  LoginUserResponse,
  SignupUserResponse,
  User,
  userResponseNeededData,
} from './user.model';
import { RecipeService } from '../recipes/recipe.service';
import { environment } from '../../environments/environment.development';
import { Store } from '@ngrx/store';
import { login, logout } from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store
  ) {}

  signUp(newUserEmail: string, newUserPassword: string) {
    return this.http
      .post<SignupUserResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
        {
          email: newUserEmail,
          password: newUserPassword,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((responseData: SignupUserResponse) =>
          this.handleAuth(responseData)
        ),
        catchError((err) => this.errorHandling(err))
      );
  }

  login(userEmail: string, userPassword: string) {
    return this.http
      .post<LoginUserResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
          email: userEmail,
          password: userPassword,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((responseData: LoginUserResponse) => this.handleAuth(responseData)),
        catchError((err) => this.errorHandling(err))
      );
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) return;

    const parsedUserData = JSON.parse(userData) as userResponseNeededData;
    const loadedUser = new User(
      parsedUserData.email,
      parsedUserData.id,
      parsedUserData._token,
      new Date(parsedUserData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      // this.loggedUser.next(loadedUser);
      this.store.dispatch(login(loadedUser));

      const exp =
        loadedUser._tokenExpirationDate.getTime() - new Date().getTime();

      this.autoLogout(exp);
    }

    console.log('AUTO LOGGED IN!');
  }

  onLogout() {
    this.store.dispatch(logout());
    localStorage.removeItem('userData');
    this.recipeService.onLogout();
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.onLogout();
    }, expirationDuration);
  }

  private handleAuth(responseData: LoginUserResponse | SignupUserResponse) {
    const expirationDate = new Date(
      new Date().getTime() + +responseData.expiresIn * 1000
    );

    const user = new User(
      responseData.email,
      responseData.localId,
      responseData.idToken,
      expirationDate
    );

    // this.loggedUser.next(user);
    this.store.dispatch(login(user));

    this.autoLogout(+responseData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private errorHandling(errorRes: HttpErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(errorRes.error?.error?.message);
    return throwError(() => errorMessage);
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
