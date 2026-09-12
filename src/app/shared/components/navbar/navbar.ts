import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { LoginResponse } from '../../../features/auth/_types/auth.types';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  isProfileOpen = signal(false);

  user = signal<LoginResponse | null>(
    this.authStorage.getUser(),
  );

  toggleProfile(): void {
    this.isProfileOpen.update((value) => !value);
  }

  closeProfile(): void {
    this.isProfileOpen.set(false);
  }

  logout(): void {
    this.authStorage.clearSession();
    this.isProfileOpen.set(false);

    void this.router.navigate(['/login']);
  }
}
