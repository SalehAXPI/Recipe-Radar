import { Component, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { ShortenStrPipe } from './shorten-str.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ShortenStrPipe, RouterModule],
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
})
export class RecipeItemComponent {
  @Input() recipe!: Recipe;
  @Input() recipeId!: number;

  constructor() {}
}
