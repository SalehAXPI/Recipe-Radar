import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { FirstLetterUppercasePipe } from './first-letter-uppercase.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AuthComponent, FirstLetterUppercasePipe],
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild([{ path: 'auth', component: AuthComponent }]),
    SharedModule,
  ],
})
export class AuthModule {}
