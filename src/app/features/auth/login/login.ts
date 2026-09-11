import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }
}
