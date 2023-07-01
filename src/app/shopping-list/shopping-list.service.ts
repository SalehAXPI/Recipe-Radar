import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import {Subject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[] = [];

  getIngredients() {
    return this.ingredients.slice();
  }

  addNewIng(ing: Ingredient | Ingredient[]) {
    this.ingredients.push(...(Array.isArray(ing) ? ing : [ing]));
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
