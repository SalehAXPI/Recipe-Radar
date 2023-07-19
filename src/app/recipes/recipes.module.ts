import { NgModule } from '@angular/core';
import { RecipesComponent } from './recipes.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortenStrPipe } from './recipe-list/recipe-item/shorten-str.pipe';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const declarations = [
  RecipesComponent,
  RecipeDetailsComponent,
  RecipeListComponent,
  RecipeItemComponent,
  RecipeStartComponent,
  RecipeEditComponent,
  ShortenStrPipe,
];

const neededImports = [
  ReactiveFormsModule,
  RouterModule,
  RecipesRoutingModule,
  SharedModule,
];

@NgModule({
  declarations: declarations,
  imports: [neededImports],
})
export class RecipesModule {}
