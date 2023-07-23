import { createAction, props } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export const startEditing = createAction(
  '[shopping-list] StartEdit',
  props<{ ingIndex: number }>()
);

export const stopEditing = createAction('[shopping-list] StopEdit');

export const addIngredient = createAction(
  '[shopping-list] AddIng',
  props<{ ingArr: Ingredient[] }>()
);

export const editIngredient = createAction(
  '[shopping-list] EditIng',
  props<{ ingIndex: number; newIng: Ingredient }>()
);
export const deleteIngredient = createAction(
  '[shopping-list] DeleteIng',
  props<{ ingIndex: number }>()
);
