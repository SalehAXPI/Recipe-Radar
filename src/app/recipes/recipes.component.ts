import { Component } from '@angular/core';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RecipeListComponent, RouterModule],
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent {}
