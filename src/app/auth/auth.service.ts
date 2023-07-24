import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginUserResponse, SignupUserResponse } from './user.model';
import { RecipeService } from '../recipes/recipe.service';
import { environment } from '../../environments/environment.development';
import { Store } from '@ngrx/store';
import { logout } from './store/auth.actions';

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

  onLogout() {
    this.store.dispatch(logout());
    localStorage.removeItem('userData');
    this.recipeService.onLogout();
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {}

  private handleAuth(responseData: LoginUserResponse | SignupUserResponse) {
    // const expirationDate = new Date(
    //   new Date().getTime() + +responseData.expiresIn * 1000
    // );
    //
    // const user = new User(
    //   responseData.email,
    //   responseData.localId,
    //   responseData.idToken,
    //   expirationDate
    // );
    //
    // // this.loggedUser.next(user);
    // this.store.dispatch(login(user));
    //
    // this.autoLogout(+responseData.expiresIn * 1000);
    // localStorage.setItem('userData', JSON.stringify(user));
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
