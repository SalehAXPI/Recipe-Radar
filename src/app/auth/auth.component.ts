import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shared/loading.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirstLetterUppercasePipe } from './first-letter-uppercase.pipe';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { startLogin, startSignup } from './store/auth.actions';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FirstLetterUppercasePipe, CommonModule],
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  authMode = new BehaviorSubject<'signup' | 'login'>('login');
  invalidForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.select('auth').subscribe({
      next: (val) => {
        val.user
          ? this.router.navigate(['/recipes'])
          : this.router.navigate(['/auth']);
      },
    });

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
    if (this.authForm.invalid) {
      this.invalidForm = true;
      return;
    }

    this.invalidForm = false;
    const { email, password } = this.authForm.value;
    this.authMode.getValue() === 'signup'
      ? this.store.dispatch(startSignup({ email, password }))
      : this.store.dispatch(startLogin({ email, password }));

    const authAction = this.store.select('auth');

    authAction.subscribe((state) => {
      if (state.user) this.router.navigate(['/recipes']);

      if (state.authError) this.handleAuthError(state.authError);
    });

    this.resetForm();
  }

  handleAuthError(err: string) {
    this.loadingService.isFetching.next(false);
    this.loadingService.error.next(err);
  }

  resetForm() {
    this.authForm.reset();
  }

  onSwitchMode() {
    this.invalidForm = false;
    this.loadingService.error.next(undefined);

    this.authMode.getValue() === 'signup'
      ? this.authMode.next('login')
      : this.authMode.next('signup');
  }
}
