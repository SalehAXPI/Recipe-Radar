import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from '../../shared/ingredient.model';
import { Observable } from 'rxjs';
import { DropdownDirective } from '../../shared/dropdown.directive';
import { CommonModule } from '@angular/common';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { deleteRecipe, updateIngredient } from '../store/recipe.actions';

@Component({
  standalone: true,
  imports: [DropdownDirective, CommonModule],
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  clickedRecipe?: Recipe;
  recipes: Observable<Recipe[]> = this.store.select(
    (state) => state.recipes.recipes
  );
  recipeId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.recipeId = +param['id'];
      this.setClickedRecipe();
    });
  }

  setClickedRecipe() {
    this.store
      .select((state) => state.recipes.recipes)
      .subscribe((recipes) => {
        this.clickedRecipe = recipes[this.recipeId! - 1];
      });
  }

  updateIngredient() {
    this.store.dispatch(
      updateIngredient({
        recipeIng: this.clickedRecipe!.ingredients.map((ing) => {
          return new Ingredient(ing.name, ing.amount);
        }),
      })
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({ recipeId: this.recipeId! - 1 }));
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
