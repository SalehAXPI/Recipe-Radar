import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
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

  onLogout() {
    this.store.dispatch(logout());
    localStorage.removeItem('userData');
    this.recipeService.onLogout();
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }
}
