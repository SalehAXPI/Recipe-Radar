import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    // When use spread operator (...) or slice method we are not copying recipes deeply because there are nested objects and array like ingredients and those two methods doesn't copy them and reference to original ones! (So we have to do copying like this)
    return this.recipes.map((recipe) => ({
      ...recipe,
      ingredients: [...recipe.ingredients],
    }));
  }

  getRecipeById(id: number) {
    return this.getRecipes()[id];
  }

  updateIngredients(ing: Ingredient[]) {
    this.shoppingListService.addNewIng(ing);
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
