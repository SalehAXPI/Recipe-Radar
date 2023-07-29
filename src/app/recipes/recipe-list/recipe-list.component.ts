import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';

@Component({
  standalone: true,
  imports: [RecipeItemComponent, CommonModule],
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent {
  recipes: Observable<Recipe[]> = this.store.select(
    (state) => state.recipes.recipes
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  onNewRecipeClick() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
