import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { LoadingService } from './loading.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { getAndUpdateRecipes } from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  authToken: string | undefined;
  fetchedRecipes: Recipe[] | undefined;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private store: Store<AppState>
  ) {}

  saveData() {
    this.store.select('auth').subscribe((state) => {
      this.authToken = state.user?.token;
    });
    console.log('SaveData Token!');

    this.store.select('recipes').subscribe((recipes) => {
      this.http
        .put(
          'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json',
          recipes.recipes,
          this.authToken
            ? {
                params: { auth: this.authToken },
              }
            : {}
        )
        .subscribe({
          error: (errorResponse) => {
            if (errorResponse.error instanceof ErrorEvent) {
              this.loadingService.error.next(
                `Error : ${errorResponse.error.message}`
              );
            } else
              this.loadingService.error.next(
                `Error Code : ${errorResponse.status}, Message : ${errorResponse.message}`
              );
          },
        });
    });
  }

  fetchData() {
    this.store.select('auth').subscribe((state) => {
      this.authToken = state.user?.token;
    });
    const fetchedRecipes = this.http.get<Recipe[]>(
      'https://reciperadar-a2db4-default-rtdb.firebaseio.com/recipes.json',
      this.authToken
        ? {
            params: { auth: this.authToken },
          }
        : {}
    );

    fetchedRecipes.subscribe({
      next: (recipe: Recipe[]) => {
        this.fetchedRecipes = recipe;
        recipe
          ? this.store.dispatch(getAndUpdateRecipes({ updatedRecipes: recipe }))
          : null;
      },
      error: (errorResponse) => {
        if (errorResponse.error instanceof ErrorEvent) {
          this.loadingService.error.next(
            `Error : ${errorResponse.error.message}`
          );
        } else
          this.loadingService.error.next(
            `Error Code : ${errorResponse.status}, Message : ${errorResponse.message}`
          );
      },
    });
  }
}
