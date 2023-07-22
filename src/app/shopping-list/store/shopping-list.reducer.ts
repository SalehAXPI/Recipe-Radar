import { Ingredient } from '../../shared/ingredient.model';
import { createReducer, on } from '@ngrx/store';
import {
  addIngredient,
  deleteIngredient,
  editIngredient,
} from './shopping-list.actions';

const initialState = [
  new Ingredient('Example', 5),
  new Ingredient('Another Example', 1),
];

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => [...state, ...action.ingArr]),
  on(editIngredient, (state, action) => {
    const stateCopy = [...state];
    stateCopy[action.ingIndex] = {
      ...stateCopy[action.ingIndex],
      name: action.newIng.name,
      amount: action.newIng.amount,
    };

    return stateCopy;
  }),
  on(deleteIngredient, (state, action) => {
    const copyState = [...state];
    copyState.splice(action.ingIndex, 1);
    return copyState;
  })
);
