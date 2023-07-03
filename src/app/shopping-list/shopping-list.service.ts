import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredientsEdited = new Subject<number>();

  private ingredients: Ingredient[] = [];

  get getIngredients() {
    return this.ingredients.slice();
  }

  addNewIng(ing: Ingredient | Ingredient[]) {
    this.ingredients.push(...(Array.isArray(ing) ? ing : [ing]));
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  editIngredientsIndex(i: number) {
    this.ingredientsEdited.next(i);
  }

  editIngredient(ingEditIndex: number, newName: string, newAmount: number) {
    this.ingredients[ingEditIndex].name = newName;
    this.ingredients[ingEditIndex].amount = newAmount;
    console.log(this.ingredients);
  }

  deleteIngredient(ingIndex: number) {
    this.ingredients.splice(ingIndex, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
