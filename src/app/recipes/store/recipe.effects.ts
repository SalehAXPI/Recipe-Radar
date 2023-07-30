import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addRecipeIngredients } from './recipe.actions';
import { of, switchMap } from 'rxjs';
import { addIngredient } from '../../shopping-list/store/shopping-list.actions';

@Injectable()
export class RecipeEffects {
  updateIngredientEffect = createEffect(() =>
    this.action$.pipe(
      ofType(addRecipeIngredients),
      switchMap((action) => {
        return of(addIngredient({ ingredients: action.recipeIng }));
      })
    )
  );

  constructor(private action$: Actions) {}
}
