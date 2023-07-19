import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from '../../shared/ingredient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  clickedRecipe: Recipe = {} as Recipe;
  recipeId!: number | null;
  private subscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.recipeId = param['id'] ? +param['id'] : null;
      this.setClickedRecipe();
    });
  }

  setClickedRecipe() {
    const recipes = this.recipeService.getRecipes();
    if (!recipes[this.recipeId! - 1]) {
      this.router.navigate(['recipes']);
      return;
    } else {
      this.clickedRecipe = recipes[this.recipeId! - 1];
    }

    this.subscription = this.recipeService.recipeChanged.subscribe((recipe) => {
      this.clickedRecipe = recipe[this.recipeId! - 1];
    });
  }

  updateIngredient() {
    this.recipeService.updateIngredients(
      this.clickedRecipe.ingredients.map((ing) => {
        return new Ingredient(ing.name, ing.amount);
      })
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeId! - 1);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
