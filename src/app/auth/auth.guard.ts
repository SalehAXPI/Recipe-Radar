import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
class PermissionService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  isAuth() {
    let bemola;
    this.store.select('auth').subscribe((state) => {
      bemola = !!state.user;
    });
    return bemola;
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
