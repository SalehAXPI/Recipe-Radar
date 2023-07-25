import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
class PermissionService {
  isUserLoggedIn: boolean = false;

  constructor(private router: Router, private store: Store<AppState>) {}

  isAuth() {
    this.store.select('auth').subscribe((state) => {
      this.isUserLoggedIn = !!state.user;
    });
    return this.isUserLoggedIn;
  }

  routeToAuthPage() {
    return this.router.createUrlTree(['/auth']);
  }
}

export const authGuard: CanActivateFn = ():
  | boolean
  | UrlTree
  | Promise<boolean | UrlTree>
  | Observable<boolean | UrlTree> => {
  return inject(PermissionService).isAuth()
    ? true
    : inject(PermissionService).routeToAuthPage();
};
