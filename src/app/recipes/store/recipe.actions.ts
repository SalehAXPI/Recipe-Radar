import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import { Ingredient } from '../../shared/ingredient.model';

export const getAndUpdateRecipes = createAction(
  '[Recipe] Recipe Getter',
  props<{ updatedRecipes: Recipe[] }>()
);

export const addRecipeIngredients = createAction(
  '[Recipe] Update Ingredients',
  props<{ recipeIng: Ingredient[] }>()
);

export const updateRecipe = createAction(
  '[Recipe] Update Recipe',
  props<{ index: number; updatedRecipe: Recipe }>()
);

export const addRecipe = createAction(
  '[Recipe] Add Recipe',
  props<{ recipeToAdd: Recipe }>()
);

export const deleteRecipe = createAction(
  '[Recipe] Delete Recipe',
  props<{ recipeId: number }>()
);
