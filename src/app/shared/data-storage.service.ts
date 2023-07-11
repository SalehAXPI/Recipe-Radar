import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

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
    const fetchedRecipes = this.http.get<Recipe[]>(
      'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json'
    );

    fetchedRecipes.subscribe((recipe: Recipe[]) => {
      recipe ? this.recipeService.fetchedData(recipe) : null;
    });
  }
}
