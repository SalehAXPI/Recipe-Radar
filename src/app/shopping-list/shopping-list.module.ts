import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoppingListRoutingModule } from './shopping-list.routing.module';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ShoppingListRoutingModule,
    RouterModule,
  ],
})
export class ShoppingListModule {}
