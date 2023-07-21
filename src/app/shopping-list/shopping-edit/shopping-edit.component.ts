import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  constructor(private shoppingListService: ShoppingListService) {}

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
      this.editIngredients(name, Number(amount));
    } else {
      this.addNewIngredient(name, Number(amount));
    }
    this.resetForm();
  }

  onCancel() {
    this.editMode = false;
    this.resetForm();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.ingIndex);
    this.onCancel();
  }

  private populateForm() {
    const ingredients = this.shoppingListService.getIngredients[this.ingIndex];
    this.shoppingForm.setValue({
      name: ingredients.name,
      amount: ingredients.amount,
    });
  }

  private editIngredients(name: string, amount: number) {
    this.shoppingListService.editIngredient(this.ingIndex, name, amount);
    this.editMode = false;
  }

  private addNewIngredient(name: string, amount: number) {
    this.shoppingListService.addNewIng(new Ingredient(name, Number(amount)));
  }

  private resetForm() {
    this.shoppingForm.reset();
  }
}
