import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  addIngredient,
  deleteIngredient,
  editIngredient,
} from '../store/shopping-list.actions';

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

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ addIng: Ingredient[] }>
  ) {}

  ngOnInit() {
    this.subscribe = this.shoppingListService.ingredientsEdited.subscribe(
      (ingIndex: number) => {
        this.editMode = true;
        this.ingIndex = ingIndex;
        this.populateForm();
      }
    );
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  onSubmit() {
    const { name, amount } = this.shoppingForm.value;
    if (this.editMode) {
      this.store.dispatch(
        editIngredient({
          ingIndex: this.ingIndex,
          newIng: { name: name, amount: amount },
        })
      );
    } else {
      this.store.dispatch(
        addIngredient({ ingArr: [new Ingredient(name, Number(amount))] })
      );
    }
    this.resetForm();
  }

  onCancel() {
    this.editMode = false;
    this.resetForm();
  }

  onDelete() {
    this.store.dispatch(deleteIngredient({ ingIndex: this.ingIndex }));
    this.onCancel();
  }

  private populateForm() {
    const ingredients = this.store.select('addIng').subscribe((ing) => {
      if (!ing.length) return;

      const ingSelected = ing[this.ingIndex];
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
