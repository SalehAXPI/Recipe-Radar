import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingComponent } from './loading/loading.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';

const declarations = [AlertComponent, LoadingComponent, DropdownDirective];

@NgModule({
  declarations: declarations,
  imports: [CommonModule],
  exports: [declarations, CommonModule],
})
export class SharedModule {}
