import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shared/loading.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirstLetterUppercasePipe } from './first-letter-uppercase.pipe';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { isFormValid, startAuth, switchAuthMode } from './store/auth.actions';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FirstLetterUppercasePipe, CommonModule],
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  authMode = this.store.select((state) => state.auth.form.authMode);
  validForm$ = this.store.select((state) => state.auth.form.isFormValid);

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    const passwordVal = [
      Validators.required,
      Validators.pattern('[^\\s]+'),
      Validators.minLength(6),
    ];

    this.authMode.subscribe((typeOfAuth) => {
      this.authForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          typeOfAuth === 'signup' ? [...passwordVal] : [Validators.required],
        ],
      });
    });
  }

  onSubmit() {
    this.store.dispatch(isFormValid({ isValid: this.authForm.valid }));
    if (!this.authForm.valid) return;

    const { email, password } = this.authForm.value;
    this.store.dispatch(startAuth({ email, password }));

    this.authForm.reset();
  }

  onSwitchMode() {
    this.loadingService.error.next(undefined);
    this.store.dispatch(switchAuthMode());
  }
}
