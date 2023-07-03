import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingForm', { static: false }) shoppingForm: NgForm;

  editMode: boolean = false;
  subscribe: Subscription;
  ingIndex: number;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.subscribe = this.shoppingListService.ingredientsEdited.subscribe(
      (ingIndex: number) => {
        this.ingIndex = ingIndex;
        this.editMode = true;
        this.shoppingForm.setValue({
          name: this.shoppingListService.getIngredients[ingIndex].name,
          amount: this.shoppingListService.getIngredients[ingIndex].amount,
        });
      }
    );
  }

  onSubmit() {
    if (this.editMode) {
      this.shoppingListService.editIngredient(
        this.ingIndex,
        this.shoppingForm.value.name,
        this.shoppingForm.value.amount
      );
      this.editMode = false;
      this.shoppingForm.reset();
      return;
    }
    this.shoppingListService.addNewIng(
      new Ingredient(
        this.shoppingForm.value.name,
        Number(this.shoppingForm.value.amount)
      )
    );

    this.shoppingForm.reset();
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  onCancel() {
    this.editMode = false;
    this.shoppingForm.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.ingIndex);
    console.log(this.shoppingListService.getIngredients);
    this.onCancel();
  }
}
