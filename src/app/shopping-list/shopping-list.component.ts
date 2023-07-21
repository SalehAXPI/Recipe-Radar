import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ShoppingEditComponent, CommonModule],
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Ingredient[];
  private changeSubStat!: Subscription;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients;
    this.changeSubStat = this.shoppingListService.ingredientsChanged.subscribe(
      (ing: Ingredient[]) => {
        this.ingredients = ing;
      }
    );
  }

  ngOnDestroy() {
    this.changeSubStat.unsubscribe();
  }

  onEdit(i: number) {
    this.shoppingListService.editIngredientsIndex(i);
  }
}
