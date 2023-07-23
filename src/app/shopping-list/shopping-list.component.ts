import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subscription } from 'rxjs';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { startEditing } from './store/shopping-list.actions';
import { AppState } from './store/shopping-list.reducer';

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

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.changeSubStat = this.store.select('shoppingList').subscribe((e) => {
      this.ingredients = e.ingredients;
    });
  }

  ngOnDestroy() {
    this.changeSubStat.unsubscribe();
  }

  onEdit(i: number) {
    this.store.dispatch(startEditing({ ingIndex: i }));
  }
}
