import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { RecipeService } from '../recipes/recipe.service';

export const productResolver: (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => void = () => {
  if (inject(RecipeService).getRecipes().length === 0) {
    return inject(DataStorageService).fetchData();
  }

  return inject(RecipeService).getRecipes();
};
