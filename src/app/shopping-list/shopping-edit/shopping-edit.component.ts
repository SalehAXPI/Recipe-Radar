import { Component, ElementRef, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent {
  // @ts-ignore
  @ViewChild('ingredientName', { static: true }) ingredientName: ElementRef;
  // @ts-ignore
  @ViewChild('ingredientAmount', { static: true }) ingredientAmount: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}

  onAddIng() {
    if (!Number(this.ingredientAmount.nativeElement.value)) {
      alert('Fill inputs correctly!');
      return;
    }

    this.shoppingListService.addNewIng(
      new Ingredient(
        this.ingredientName.nativeElement.value,
        Number(this.ingredientAmount.nativeElement.value)
      )
    );
  }
}
