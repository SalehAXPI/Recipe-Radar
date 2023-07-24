import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from '../../shared/ingredient.model';
import { Subscription } from 'rxjs';
import { DropdownDirective } from '../../shared/dropdown.directive';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [DropdownDirective, CommonModule],
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
    if (recipes.length !== 0) {
      this.clickedRecipe = this.recipeService.getRecipeById(this.recipeId! - 1);
    } else {
      this.subscription = this.recipeService.recipeChanged.subscribe(
        (recipe) => {
          if (recipe[this.recipeId! - 1])
            this.clickedRecipe = this.recipeService.getRecipeById(
              this.recipeId! - 1
            );
          else this.router.navigate(['recipes']);
        }
      );
    }
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
    // this.subscription.unsubscribe();
  }
}
