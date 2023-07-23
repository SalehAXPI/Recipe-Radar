import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { LoadingService } from './loading.service';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  authToken: string | undefined;

  // TODO Try using interceptors to add token in every outgoing request instead of this
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  saveData() {
    this.store.select('auth').subscribe((state) => {
      this.authToken = state.user?.token;
    });
    console.log('SaveData Token!');

    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json',
        recipes,
        this.authToken
          ? {
              params: { auth: this.authToken },
            }
          : {}
      )
      .subscribe({
        error: (errorResponse) => {
          if (errorResponse.error instanceof ErrorEvent) {
            this.loadingService.error.next(
              `Error : ${errorResponse.error.message}`
            );
          } else
            this.loadingService.error.next(
              `Error Code : ${errorResponse.status}, Message : ${errorResponse.message}`
            );
        },
      });
  }

  fetchData() {
    this.store.select('auth').subscribe((state) => {
      this.authToken = state.user?.token;
    });
    const fetchedRecipes = this.http.get<Recipe[]>(
      'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json',
      this.authToken
        ? {
            params: { auth: this.authToken },
          }
        : {}
    );

    fetchedRecipes.subscribe({
      next: (recipe: Recipe[]) => {
        recipe ? this.recipeService.fetchedData(recipe) : null;
      },
      error: (errorResponse) => {
        if (errorResponse.error instanceof ErrorEvent) {
          this.loadingService.error.next(
            `Error : ${errorResponse.error.message}`
          );
        } else
          this.loadingService.error.next(
            `Error Code : ${errorResponse.status}, Message : ${errorResponse.message}`
          );
      },
    });
  }
}
