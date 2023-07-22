import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  imports: [ShoppingEditComponent, CommonModule],
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Observable<Ingredient[]>;
  private changeSubStat!: Subscription;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ addIng: Ingredient[] }>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('addIng');
  }

  ngOnDestroy() {
    // this.changeSubStat.unsubscribe();
  }

  onEdit(i: number) {
    this.shoppingListService.editIngredientsIndex(i);
  }
}
