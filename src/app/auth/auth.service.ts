import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { LoginUserResponse, SignupUserResponse, User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedUser = new Subject<User>();

  constructor(private http: HttpClient) {}

  signUp(newUserEmail: string, newUserPassword: string) {
    return this.http
      .post<SignupUserResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAv1FPE9fkMSVOaD935MOYVu8NrEWytsa0',
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
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAv1FPE9fkMSVOaD935MOYVu8NrEWytsa0',
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

    this.loggedUser.next(user);
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
