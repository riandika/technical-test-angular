import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../_api/auth-api.service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly authStorage = inject(AuthStorageService);

  showPassword = signal(false);
  isLoading = signal(false);
  loginError = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  isInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];

    return control.invalid && (control.dirty || control.touched);
  }

  useDemoAccount(): void {
    this.loginForm.patchValue({
      email: 'emily.johnson@x.dummyjson.com',
      password: 'emilyspass',
    });

    this.loginError.set(null);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginError.set(null);
    this.isLoading.set(true);

    const { email, password } = this.loginForm.getRawValue();

    this.authApi.findUserByEmail(email).subscribe({
      next: (userResponse) => {
        const user = userResponse.users[0];

        if (!user) {
          this.isLoading.set(false);
          this.loginError.set('Email is not registered.');
          return;
        }

        this.authApi
          .login({
            username: user.username,
            password
          })
          .subscribe({
            next: (response) => {
              this.authStorage.setSession(response);
              this.isLoading.set(false);

              void this.router.navigate(['/home']);
            },
            error: () => {
              this.isLoading.set(false);
              this.loginError.set('Invalid credentials.');
            },
          });
      },
      error: () => {
        this.isLoading.set(false);
        this.loginError.set('Unable to verify email. Please try again.');
      },
    });
  }
}
