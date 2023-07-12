import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  clickedRecipe: Recipe = {} as Recipe;
  recipeId!: number | null;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.recipeId = param['id'] ? +param['id'] : null;
      if (this.recipeService.getRecipes().length !== 0) {
        this.clickedRecipe = this.recipeService.getRecipeById(
          this.recipeId! - 1
        );
      } else {
        this.recipeService.recipeChanged.subscribe(() => {
          this.clickedRecipe = this.recipeService.getRecipeById(
            this.recipeId! - 1
          );
        });
      }
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
}
