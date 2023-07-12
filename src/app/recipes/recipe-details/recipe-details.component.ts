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
  clickedRecipe!: Recipe;
  private id: number | undefined;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.id = param['id'] ? +param['id'] : undefined;
      this.clickedRecipe = this.recipeService.getRecipeById(this.id! - 1);
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
    this.recipeService.deleteRecipe(this.id! - 1);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
