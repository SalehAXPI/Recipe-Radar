import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  addIngredient,
  deleteIngredient,
  editIngredient,
  stopEditing,
} from '../store/shopping-list.actions';
import { AppState } from '../../store/app.reducer';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingForm', { static: false }) shoppingForm!: NgForm;
  editMode: boolean = false;
  private subscribe!: Subscription;
  private ingIndex!: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscribe = this.store.select('shoppingList').subscribe((state) => {
      this.editMode = !!state.ingEditing.ingredient;
      if (this.editMode) {
        this.ingIndex = state.ingEditing.ingredientIndex;
        this.populateForm();
      }
    });
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  onSubmit() {
    const { name, amount } = this.shoppingForm.value;
    if (this.editMode) {
      this.store.dispatch(
        editIngredient({
          ingredientIndex: this.ingIndex,
          updatedIngredient: { name: name, amount: amount },
        })
      );
    } else {
      this.store.dispatch(
        addIngredient({ ingredients: [new Ingredient(name, Number(amount))] })
      );
    }
    this.resetForm();
  }

  onCancel() {
    this.store.dispatch(stopEditing());
    this.editMode = false;
    this.resetForm();
  }

  onDelete() {
    this.store.dispatch(deleteIngredient({ ingredientIndex: this.ingIndex }));
    this.onCancel();
  }

  private populateForm() {
    this.store.select('shoppingList').subscribe((state) => {
      const ingSelected = state.ingEditing.ingredient;
      if (ingSelected)
        this.shoppingForm.setValue({
          name: ingSelected.name,
          amount: ingSelected.amount,
        });
    });
  }

  private resetForm() {
    this.shoppingForm.reset();
  }
}
