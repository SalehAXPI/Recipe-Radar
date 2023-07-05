import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Sandwich',
      'A super tasty sandwich',
      'https://img.taste.com.au/mOx3fOxf/w720-h480-cfill-q80/taste/2022/09/garlic-chilli-prawn-pasta-181440-1.jpg',
      [new Ingredient('meat', 1), new Ingredient('French Fries', 2)]
    ),
    new Recipe(
      'Huge Berger',
      'Tasty huge berger!!',
      'https://img.taste.com.au/mOx3fOxf/w720-h480-cfill-q80/taste/2022/09/garlic-chilli-prawn-pasta-181440-1.jpg',
      [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
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

  private notifyRecipeUpdated() {
    this.recipeChanged.next(this.getRecipes());
  }
}
