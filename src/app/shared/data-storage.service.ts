import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { LoadingService } from './loading.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  // TODO Try using interceptors to add token in every outgoing request instead of this
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  saveData() {
    const authToken = this.authService.loggedUser.getValue()?.token;
    console.log('SaveData Token!');

    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json',
        recipes,
        authToken
          ? {
              params: { auth: authToken },
            }
          : {}
      )
      .subscribe((recipes) => console.log(recipes));
  }

  fetchData() {
    const authToken = this.authService.loggedUser.getValue()?.token;
    const fetchedRecipes = this.http.get<Recipe[]>(
      'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json',
      authToken
        ? {
            params: { auth: authToken },
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
