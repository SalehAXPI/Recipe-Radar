import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
