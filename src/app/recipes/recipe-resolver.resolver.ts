import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

export const productResolver: (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => void = () => {
  if (inject(DataStorageService).fetchedRecipes) return;
  return inject(DataStorageService).fetchData();
};
