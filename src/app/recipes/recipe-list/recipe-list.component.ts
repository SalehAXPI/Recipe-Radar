import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];
  private subscription!: Subscription;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    if (this.recipeService.getRecipes().length !== 0) {
      this.recipes = this.recipeService.getRecipes();
    }
    this.subscription = this.recipeService.recipeChanged.subscribe(
      (recipe: Recipe[]) => {
        this.recipes = recipe;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
