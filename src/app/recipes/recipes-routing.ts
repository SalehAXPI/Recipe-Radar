import { Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { productResolver } from './recipe-resolver.resolver';
import { authGuard } from '../auth/auth.guard';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';

export const RecipesRouting: Routes = [
  {
    path: '',
    component: RecipesComponent,
    resolve: [productResolver],
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      {
        path: 'new',
        component: RecipeEditComponent,
      },
      {
        path: ':id',
        component: RecipeDetailsComponent,
        resolve: [productResolver],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [productResolver],
      },
      { path: '**', redirectTo: '/recipes' },
    ],
  },
];
