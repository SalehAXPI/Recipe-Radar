import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsEdited = new Subject<number>();

  editIngredientsIndex(i: number) {
    this.ingredientsEdited.next(i);
  }
}
