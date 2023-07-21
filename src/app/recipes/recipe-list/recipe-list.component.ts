import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RecipeItemComponent, CommonModule],
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];
  private subscription!: Subscription;
  private loggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.recipeService.getRecipes().length !== 0) {
      this.recipes = this.recipeService.getRecipes();
    }
    this.subscription = this.recipeService.recipeChanged.subscribe(
      (recipe: Recipe[]) => {
        this.recipes = recipe;
      }
    );
    this.authService.loggedUser.subscribe((user) => {
      this.loggedIn = !!user;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNewRecipeClick() {
    if (this.loggedIn) {
      this.router.navigate(['new'], { relativeTo: this.route });
      return;
    }

    this.router.navigate(['auth']);
  }
}
