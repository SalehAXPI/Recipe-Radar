import { Ingredient } from '../../shared/ingredient.model';
import { createReducer, on } from '@ngrx/store';
import {
  addIngredient,
  deleteIngredient,
  editIngredient,
  startEditing,
  stopEditing,
} from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  ingEditing: { ingredient: undefined | Ingredient; ingredientIndex: number };
}

export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Example', 5),
    new Ingredient('Another Example', 1),
  ],
  ingEditing: {
    ingredient: undefined,
    ingredientIndex: -1,
  },
};

const initialEditingState = {
  ingredient: undefined,
  ingredientIndex: -1,
};

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => ({
    ...state,
    ingredients: [...action.ingredients, ...state.ingredients],
    ingEditing: initialEditingState,
  })),
  on(editIngredient, (state, { ingredientIndex, updatedIngredient }) => ({
    ...state,
    ingredients: state.ingredients.map((ingredient, index) =>
      index === ingredientIndex
        ? { ...ingredient, ...updatedIngredient }
        : ingredient
    ),
    ingEditing: initialEditingState,
  })),
  on(deleteIngredient, (state, action) => ({
    ...state,
    ingredients: state.ingredients.filter(
      (ingredient, index) => index !== action.ingredientIndex
    ),
    ingEditing: initialEditingState,
  })),
  on(startEditing, (state, action) => ({
    ...state,
    ingEditing: {
      ingredient: state.ingredients[action.ingredientIndex],
      ingredientIndex: action.ingredientIndex,
    },
  })),
  on(stopEditing, (state) => ({
    ...state,
    ingEditing: initialEditingState,
  }))
);
