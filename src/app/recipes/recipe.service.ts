import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { addIngredient } from '../shopping-list/store/shopping-list.actions';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private store: Store) {}

  getRecipes(): Recipe[] {
    // When use spread operator (...)
    // or slice method we are not copying recipes deeply
    // because there are nested objects and array like ingredients,
    // and those two methods don't copy them and reference to original ones!
    // (So we have to do copying like this)
    return this.recipes.map((recipe) => ({
      ...recipe,
      ingredients: [...recipe.ingredients],
    }));
  }

  getRecipeById(id: number) {
    return this.getRecipes()[id];
  }

  updateIngredients(ing: Ingredient[]) {
    this.store.dispatch(
      addIngredient({
        ingredients: [...ing.map((ing) => new Ingredient(ing.name, ing.amount))],
      })
    );
  }

  updateRecipe(index: number, updatedRecipe: Recipe) {
    this.recipes[index] = updatedRecipe;
    this.notifyRecipeUpdated();
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.notifyRecipeUpdated();
  }

  deleteRecipe(recipeId: number) {
    this.recipes.splice(recipeId, 1);
    this.notifyRecipeUpdated();
  }

  fetchedData(recipe: Recipe[]) {
    this.recipes = recipe;
    this.recipeChanged.next(this.getRecipes());
  }

  onLogout() {
    this.recipes = [];
    this.recipeChanged.next(this.getRecipes());
  }

  private notifyRecipeUpdated() {
    this.recipeChanged.next(this.getRecipes());
  }
}
