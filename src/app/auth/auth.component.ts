import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shared/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  authMode = new BehaviorSubject<'signup' | 'login'>('signup');
  invalidForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private auhtService: AuthService
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
    if (this.authForm.invalid) {
      this.invalidForm = true;
      return;
    }

    const { email, password } = this.authForm.value;
    const authAction =
      this.authMode.getValue() === 'signup'
        ? this.auhtService.signUp(email, password)
        : this.auhtService.login(email, password);

    authAction.subscribe({
      next: (resData) => {
        console.log(resData);
      },
      error: this.handleAuthError,
      complete: this.handleAuthCompletion,
    });

    this.resetForm();
  }

  handleAuthError(err: string) {
    this.loadingService.isFetching.next(false);
    this.loadingService.error.next(err);
  }

  handleAuthCompletion() {
    this.loadingService.isFetching.next(false);
    this.invalidForm = false;
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
