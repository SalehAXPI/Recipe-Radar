import { Recipe } from '../recipe.model';
import { createReducer, on } from '@ngrx/store';
import {
  addRecipe,
  deleteRecipe,
  getAndUpdateRecipes,
  updateRecipe,
} from './recipe.actions';

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
      recipes: action.updatedRecipes,
    };
  }),
  on(updateRecipe, (state, action) => {
    return {
      ...state,
      recipes: [
        ...state.recipes.slice(0, action.index), // Copy elements before the updated recipe
        action.updatedRecipe, // Insert the updated recipe at the specified index
        ...state.recipes.slice(action.index + 1), // Copy elements after the updated recipe
      ],
    };
  }),
  on(addRecipe, (state, action) => {
    return {
      ...state,
      recipes: [...state.recipes, action.recipeToAdd],
    };
  }),
  on(deleteRecipe, (state, action) => {
    const stateArr = [...state.recipes];
    stateArr.splice(action.recipeId, 1);
    return {
      ...state,
      recipes: [...stateArr],
    };
  })
);
