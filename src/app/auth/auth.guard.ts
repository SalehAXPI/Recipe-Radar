import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
class PermissionService {
  constructor(private authService: AuthService, private router: Router) {}

  isAuth() {
    return !!this.authService.loggedUser.getValue();
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
