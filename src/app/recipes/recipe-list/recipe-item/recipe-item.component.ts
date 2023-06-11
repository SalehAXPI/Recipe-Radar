import { Component, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
})
export class RecipeItemComponent {
  // @ts-ignore
  @Input() recipe: Recipe;
  // @ts-ignore
  @Input() recipeId: number;

  constructor(private recipeService: RecipeService, private router: Router) {}
}
