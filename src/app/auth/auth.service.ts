import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(newUserEmail: string, newUserPassword: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAv1FPE9fkMSVOaD935MOYVu8NrEWytsa0',
        {
          email: newUserEmail,
          password: newUserPassword,
          returnSecureToken: true,
        }
      )
      .pipe(catchError((err) => this.errorHandling(err)));
  }

  login(userEmail: string, userPassword: string) {
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAv1FPE9fkMSVOaD935MOYVu8NrEWytsa0',
        {
          email: userEmail,
          password: userPassword,
          returnSecureToken: true,
        }
      )
      .pipe(catchError((err) => this.errorHandling(err)));
  }

  private errorHandling(errorRes: HttpErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(errorRes.error.error.message);
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

      default:
        return 'An unknown error occurs!';
    }
  }
}
