import { createAction, props } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export const startEditing = createAction(
  '[Shopping List] Start Editing',
  props<{ ingredientIndex: number }>()
);

export const stopEditing = createAction('[Shopping List] Stop Editing');

export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<{ ingredients: Ingredient[] }>()
);

export const editIngredient = createAction(
  '[Shopping List] Edit Ingredient',
  props<{ ingredientIndex: number; updatedIngredient: Ingredient }>()
);

export const deleteIngredient = createAction(
  '[Shopping List] Delete Ingredient',
  props<{ ingredientIndex: number }>()
);
