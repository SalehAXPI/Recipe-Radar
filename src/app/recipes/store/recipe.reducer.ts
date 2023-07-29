import { Recipe } from '../recipe.model';
import { createReducer, on } from '@ngrx/store';
import { getAndUpdateRecipes } from './recipe.actions';

export interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
};

export const recipeReducer = createReducer(
  initialState,
  on(getAndUpdateRecipes, (state, action) => {
    return {
      ...state,
      recipes: action.updatedRecipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: [...recipe.ingredients],
        };
      }),
    };
  })
);
