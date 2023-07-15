import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

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
      .pipe(
        catchError((errorRes) => {
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              return throwError(
                () => new Error('This Email has already signed up!')
              );
          }
          return throwError(() => new Error('An unknown error occurs!'));
        })
      );
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
      .pipe(
        catchError((errorRes) => {
          switch (errorRes.error.error.message) {
            case 'INVALID_PASSWORD':
              return throwError(
                () => new Error('Password Is Not Correct, Please Try Again!')
              );
              break;

            case 'EMAIL_NOT_FOUND':
              return throwError(
                () => new Error('Email Not Found, Please Try Again!')
              );
              break;
          }
          return throwError(() => new Error('An unknown error occurs!'));
        })
      );
  }
}
