import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shared/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  authMode = new BehaviorSubject<'signup' | 'login'>('signup');
  invalidForm: boolean = false;
  private formData = {
    email: '',
    password: '',
  };

  constructor(
    private loadingService: LoadingService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadingService.isFetching.next(false);

    const passwordVal = [
      Validators.required,
      Validators.pattern('[^\\s]+'),
      Validators.minLength(5),
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
    if (
      this.authForm.get('password')?.invalid ||
      this.authForm.get('email')?.invalid
    ) {
      this.invalidForm = true;
      return;
    }

    this.formData = this.authForm.value;
    this.invalidForm = false;
    this.authForm.reset();

    console.log(this.formData);
  }

  onSwitchMode() {
    this.invalidForm = false;

    this.authMode.getValue() === 'signup'
      ? this.authMode.next('login')
      : this.authMode.next('signup');
  }
}
