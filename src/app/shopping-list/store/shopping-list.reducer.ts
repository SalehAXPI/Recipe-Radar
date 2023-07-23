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

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => {
    return {
      ingredients: [...state.ingredients, ...action.ingArr],
      ingEditing: {
        ingredient: undefined,
        ingredientIndex: -1,
      },
    };
  }),
  on(editIngredient, (state, action) => {
    const stateCopy = [...state.ingredients];
    stateCopy[action.ingIndex] = {
      ...stateCopy[action.ingIndex],
      name: action.newIng.name,
      amount: action.newIng.amount,
    };

    return {
      ingredients: stateCopy,
      ingEditing: { ingredient: undefined, ingredientIndex: -1 },
    };
  }),
  on(deleteIngredient, (state, action) => {
    const copyState = [...state.ingredients];
    copyState.splice(action.ingIndex, 1);
    return {
      ingredients: copyState,
      ingEditing: { ingredient: undefined, ingredientIndex: -1 },
    };
  }),
  on(startEditing, (state, action) => {
    const copyState = [...state.ingredients];
    return {
      ingredients: copyState,
      ingEditing: {
        ingredient: copyState[action.ingIndex],
        ingredientIndex: action.ingIndex,
      },
    };
  }),
  on(stopEditing, (state) => {
    const copyState = [...state.ingredients];
    return {
      ingredients: copyState,
      ingEditing: {
        ingredient: undefined,
        ingredientIndex: -1,
      },
    };
  })
);
