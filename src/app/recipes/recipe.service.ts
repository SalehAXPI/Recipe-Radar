import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

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
    return this.recipes.slice();
  }

  getRecipeById(id: number) {
    return this.recipes.slice()[id];
  }

  updateIngredients(ing: Ingredient[]) {
    this.shoppingListService.addNewIng(ing);
  }
}
