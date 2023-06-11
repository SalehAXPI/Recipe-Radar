import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  // @ts-ignore
  clickedRecipe: Recipe;
  // @ts-ignore
  recipeId: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.recipeId = +param['id'];
      this.clickedRecipe = this.recipeService.getRecipeById(this.recipeId);
    });
  }

  updateIngredient() {
    this.recipeService.updateIngredients(this.clickedRecipe.ingredients);
  }
}
