import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    {
      path: 'recipes',
      loadChildren: () =>
        import('./recipes/recipes-routing').then((e) => e.RecipesRouting),
    },
    { path: 'shopping-list', component: ShoppingListComponent },
    { path: '**', redirectTo: '/recipes' },
  ];