import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private loadingService: LoadingService
  ) {}

  saveData() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((recipes) => console.log(recipes));
  }

  fetchData() {
    this.loadingService.error.next(undefined);

    const fetchedRecipes = this.http.get<Recipe[]>(
      'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json'
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
